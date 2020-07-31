import * as fs from "fs";
import { DefinitionsResolver } from "./DefinitionsResolver";
import * as path from "path";
import { prettifyCode, testJSON } from "./utils";
import { PathResolver } from "./PathResolver";
import axios from "axios";
import { map } from "lodash";
import { ERROR_MESSAGES, LOG_MESSAGE } from "./constants";
import { Spec } from "@openapi-integration/openapi-schema";

interface ICodegenConfig {
  output?: string;
  actionCreatorImport?: string;
  timeout?: number;
  data?: string[];
  clients?: string[];
  fileName?: string;
}

const codegenConfigPath = path.resolve("ts-codegen.config.json");

const getCodegenConfig = (): ICodegenConfig =>
  fs.existsSync(codegenConfigPath)
    ? require(codegenConfigPath)
    : {
        output: ".output",
        actionCreatorImport: "",
        clients: [],
      };

const { output = ".output", actionCreatorImport, timeout, data, clients, fileName } = getCodegenConfig();

const codegen = (schema: Spec | string) => {
  if (typeof schema === "string") {
    console.error(ERROR_MESSAGES.INVALID_JSON_FILE_ERROR);
    return;
  }

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  const fileStr =
    actionCreatorImport +
    [
      ...PathResolver.of(schema.paths)
        .resolve()
        .toRequest(),
      ...DefinitionsResolver.of(schema.components)
        .scanDefinitions()
        .toDeclarations(),
    ].join("\n\n");

  fs.writeFileSync(path.resolve(output, `./${fileName || "request"}.ts`), prettifyCode(fileStr), "utf-8");
};

(data || []).map((file: string) => {
  console.log("reading swagger schema from local file...\n");

  const schemaStr = fs.readFileSync(file, "utf8");
  const schema = testJSON(schemaStr);

  if (schema) {
    console.log(LOG_MESSAGE.GENERATING + "\n");
    codegen(schema);
    console.log(LOG_MESSAGE.SUCCESSFUL + "\n");
  }
});

if (clients) {
  const instance = axios.create({
    timeout: timeout || 10 * 1000,
  });

  map(clients, (client, index) => {
    console.log(`getting swagger schema from client ${index + 1}...\n`);
    instance
      .get(client)
      .then((response) => {
        console.log(LOG_MESSAGE.GENERATING + "\n");
        codegen(response.data);
        console.log(LOG_MESSAGE.SUCCESSFUL + "\n");
      })
      .catch((error) => {
        console.error(`${error.code}: ${ERROR_MESSAGES.FETCH_CLIENT_FAILED_ERROR}`);
      });
  });
}
