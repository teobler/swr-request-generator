import fs, { WriteStream } from "node:fs";
import * as yaml from "js-yaml";
import { DefinitionsResolver } from "./resolvers/DefinitionsResolver.js";
import path from "node:path";
import { PathResolver } from "./resolvers/PathResolver.js";
import axios from "axios";
import { ERROR_MESSAGES, FILE_TIP, getSplittingMessage, LOG_MESSAGE } from "./constants.js";
import { program } from "commander";
import { convertJsonStringToJson, prettifyCode } from "./utils/formatters.js";
import { CodegenConfig } from "./types.js";
import { OasObject, PathsObject } from "@ts-stack/openapi-spec";
import { useGetRequest } from "./template/useGetRequest.js";
import { useMutationRequest } from "./template/useMutationRequest.js";
import { client } from "./template/client.js";
import { greenConsole, redConsole } from "./utils/console.js";

program.option("-a, --authorization <value>", "authorization header value").parse(process.argv);

const codegenConfigPath = path.resolve("ts-codegen.config.json");

const getCodegenConfig = async (): Promise<CodegenConfig> =>
  fs.existsSync(codegenConfigPath)
    ? await import(codegenConfigPath, { assert: { type: "json" } }).then((module) => module.default)
    : {
        output: ".output",
        fileHeaders: [],
        clients: [],
      };

const codegen = (schema: OasObject | string, writeStream: WriteStream, isMultiFile: boolean, fileIndex: number) => {
  if (typeof schema === "string") {
    throw Error(ERROR_MESSAGES.INVALID_JSON_FILE_ERROR);
  }

  const fileStr =
    (isMultiFile ? getSplittingMessage(fileIndex) : "") +
    [
      ...PathResolver.of(schema.paths as PathsObject)
        .resolve()
        .toRequest(),
      ...DefinitionsResolver.of(schema.components).scanDefinitions().toDeclarations(),
    ].join("\n\n");

  writeStream.write(prettifyCode(fileStr), "utf-8");
};

const generateFromFiles = (data: string[] = [], requestWriteStream: WriteStream, isMultiFile: boolean) => {
  data.map((file: string, index: number) => {
    if (!file.endsWith("json") && !file.endsWith("yml") && !file.endsWith("yaml")) {
      redConsole(ERROR_MESSAGES.INVALID_FILE_FORMAT);
      return;
    }

    console.log(LOG_MESSAGE.READING_FROM_LOCAL(index));

    const schemaStr = fs.readFileSync(file, "utf8");
    const schema = file.endsWith("json") ? convertJsonStringToJson(schemaStr) : yaml.load(schemaStr);

    if (schema) {
      console.log(LOG_MESSAGE.GENERATING);
      codegen(schema, requestWriteStream, isMultiFile, index);
      greenConsole(LOG_MESSAGE.LOCAL_SUCCESSFUL(index));
    }
  });
};

const generateFromClients = (
  clients: string[] = [],
  requestWriteStream: WriteStream,
  isMultiFile: boolean,
  timeout?: number,
  data?: string[],
) => {
  if (clients) {
    const options = program.opts();

    const instance = axios.create({
      timeout: timeout || 10 * 1000,
      headers: options.authorization
        ? {
            Authorization: options.authorization,
          }
        : undefined,
    });

    clients.map((client, index) => {
      console.log(LOG_MESSAGE.GETTING_FROM_REMOTE(index));
      instance
        .get(client)
        .then((response) => {
          console.log(LOG_MESSAGE.GENERATING);
          codegen(response.data, requestWriteStream, isMultiFile, index + (data?.length ?? 0));
          greenConsole(LOG_MESSAGE.REMOTE_SUCCESSFUL(index));
        })
        .catch((error) => {
          redConsole(`${error.code}: ${ERROR_MESSAGES.FETCH_CLIENT_FAILED_ERROR}`);
        });
    });
  }
};

const setupDirAndCreateWriteStream = (output: string, fileName = "request", fileHeaders?: string[]) => {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  const requestFilePath = path.resolve(output, `./${fileName}.ts`);

  if (fs.existsSync(path.resolve(output, `./${fileName || "request"}.ts`))) {
    fs.unlinkSync(requestFilePath);
  }

  const requestFileWriteStream = fs.createWriteStream(requestFilePath);

  requestFileWriteStream.on("error", (err) => {
    redConsole(err.message);
  });

  requestFileWriteStream.on("finish", () => {
    greenConsole(LOG_MESSAGE.SUCCESSFUL);
  });

  requestFileWriteStream.write(prettifyCode((fileHeaders ? fileHeaders.join("\n") : "") + "\n\n" + FILE_TIP), "utf-8");

  return { requestFileWriteStream };
};

getCodegenConfig().then(
  ({ output = ".output", fileHeaders, timeout, data, clients, fileName, needRequestHook, needClient }) => {
    if (!data && !clients) {
      redConsole(ERROR_MESSAGES.NO_CLIENTS_OR_DATA);
      return;
    }

    const isMultiFile = (data?.length ?? 0) + (clients?.length ?? 0) > 1;
    const { requestFileWriteStream } = setupDirAndCreateWriteStream(output, fileName, fileHeaders);

    generateFromFiles(data, requestFileWriteStream, isMultiFile);
    generateFromClients(clients, requestFileWriteStream, isMultiFile, timeout, data);

    requestFileWriteStream.end();

    if (needRequestHook) {
      fs.writeFileSync(path.resolve(output, "./useGetRequest.ts"), prettifyCode(useGetRequest), "utf-8");
      fs.writeFileSync(path.resolve(output, "./useMutationRequest.ts"), prettifyCode(useMutationRequest), "utf-8");
    }

    if (needClient) {
      fs.writeFileSync(path.resolve(output, "./client.ts"), prettifyCode(client), "utf-8");
    }
  },
);
