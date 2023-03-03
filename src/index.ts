import * as fs from "fs";
import * as yaml from "js-yaml";
import { DefinitionsResolver } from "./resolvers/DefinitionsResolver";
import * as path from "path";
import { PathResolver } from "./resolvers/PathResolver";
import axios from "axios";
import { map } from "lodash";
import { ERROR_MESSAGES, FILE_TIP, LOG_MESSAGE } from "./constants";
import { program } from "commander";
import { convertJsonStringToJson, prettifyCode } from "./utils/formatters";
import { CodegenConfig } from "./types";
import { OasObject, PathsObject } from "@ts-stack/openapi-spec";
import { useGetRequest } from "./template/useGetRequest";
import { useMutationRequest } from "./template/useMutationRequest";
import { client } from "./template/client";
import { greenConsole, redConsole } from "./utils/console";

program.option("-a, --authorization <value>", "authorization header value").parse(process.argv);

const codegenConfigPath = path.resolve("ts-codegen.config.json");

const getCodegenConfig = (): CodegenConfig =>
  fs.existsSync(codegenConfigPath)
    ? require(codegenConfigPath)
    : {
        output: ".output",
        fileHeaders: [],
        clients: [],
      };

const {
  output = ".output",
  fileHeaders,
  timeout,
  data,
  clients,
  fileName,
  needRequestHook,
  needClient,
} = getCodegenConfig();

const codegen = (schema: OasObject | string) => {
  if (typeof schema === "string") {
    redConsole(ERROR_MESSAGES.INVALID_JSON_FILE_ERROR);
    return;
  }

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  const fileStr =
    (fileHeaders ? fileHeaders.join("\n") : "") +
    "\n\n" +
    FILE_TIP +
    [
      ...PathResolver.of(schema.paths as PathsObject)
        .resolve()
        .toRequest(),
      ...DefinitionsResolver.of(schema.components).scanDefinitions().toDeclarations(),
    ].join("\n\n");

  fs.writeFileSync(path.resolve(output, `./${fileName || "request"}.ts`), prettifyCode(fileStr), "utf-8");
};

(data || []).map((file: string) => {
  if (!file.endsWith("json") && !file.endsWith("yml") && !file.endsWith("yaml")) {
    redConsole(ERROR_MESSAGES.INVALID_FILE_FORMAT);
    return;
  }

  console.log(LOG_MESSAGE.READING);

  const schemaStr = fs.readFileSync(file, "utf8");
  const schema = file.endsWith("json") ? convertJsonStringToJson(schemaStr) : yaml.load(schemaStr);

  if (schema) {
    console.log(LOG_MESSAGE.GENERATING + "\n");
    codegen(schema);
    greenConsole(LOG_MESSAGE.SUCCESSFUL + "\n");
  }
});

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

  map(clients, (client, index) => {
    console.log(LOG_MESSAGE.GETTING_FROM_REMOTE(index));
    instance
      .get(client)
      .then((response) => {
        console.log(LOG_MESSAGE.GENERATING + "\n");
        codegen(response.data);
        greenConsole(LOG_MESSAGE.SUCCESSFUL + "\n");
      })
      .catch((error) => {
        redConsole(`${error.code}: ${ERROR_MESSAGES.FETCH_CLIENT_FAILED_ERROR}`);
      });
  });
}

if (needRequestHook) {
  fs.writeFileSync(path.resolve(output, "./useGetRequest.ts"), prettifyCode(useGetRequest), "utf-8");
  fs.writeFileSync(path.resolve(output, "./useMutationRequest.ts"), prettifyCode(useMutationRequest), "utf-8");
}

if (needClient) {
  fs.writeFileSync(path.resolve(output, "./client.ts"), prettifyCode(client), "utf-8");
}
