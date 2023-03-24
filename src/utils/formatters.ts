import { camelCase, isEmpty } from "moderndash";
import prettier from "prettier";
import { isObject, isValidVariableName } from "./specifications.js";
import { ENUM_SUFFIX, ERROR_MESSAGES } from "../constants.js";
import { ReqBody } from "src/types.js";
import { ResolvedSchema } from "src/resolvers/DefinitionsResolver.js";
import { redConsole } from "../utils/console.js";
import { pickBy, trimEnd } from "./lodash.js";

export const toCapitalCase = (str?: string): string => {
  if (!str) {
    return "";
  }

  const camelStr = camelCase(str);
  return `${camelStr.charAt(0).toUpperCase()}${camelStr.slice(1)}`;
};

export const arrayToObject = (arr: [string | number] | [] = []) => {
  const obj: Record<string, string | number> = {};

  arr.forEach((item) => {
    obj[item] = item;
  });

  return obj;
};

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: "all",
    arrowParens: "always",
    parser: "typescript",
  });

export const toTypes = (definitions: ResolvedSchema) => {
  if (isEmpty(definitions)) {
    return;
  }

  const fieldDefinitionList = Object.entries(definitions).map(([key, value]) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `${convertKeyAndAddQuote(key)}: FormData`;
    }

    return isObject(value)
      ? `${convertKeyAndAddQuote(key)}: ${JSON.stringify(value).replace(/"/g, "")};`
      : `${convertKeyAndAddQuote(key)}: ${(value as string).replace(ENUM_SUFFIX, "")};`;
  });

  return (
    definitions &&
    `{
        ${fieldDefinitionList.sort().join("\n")}
      }`
  );
};

export const toRequestTypes = (requestTypeObj: {
  body: ReqBody | undefined;
  query: Record<string, string> | undefined;
}) => {
  const requestBodyFieldList = Object.entries(requestTypeObj.body ?? {}).map(([, value]) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `FormData;`;
    }

    return isObject(value)
      ? `${JSON.stringify(value).replace(/"/g, "")};`
      : `${(value as string).replace(ENUM_SUFFIX, "")};`;
  });
  const requestBodyDefinition = isEmpty(requestBodyFieldList) ? "" : `body: ${requestBodyFieldList.sort().join("\n")}`;

  if (requestTypeObj.query && Object.keys(requestTypeObj.query).length > 0) {
    const requestQueryDefinition = `query: ${toTypes(requestTypeObj.query)}`;
    return `{
        ${requestBodyDefinition}
        ${requestQueryDefinition}
      }`;
  }

  const requestQueryFieldList = Object.entries(requestTypeObj.query || {}).map(([, value]) => {
    return isObject(value)
      ? `${JSON.stringify(value).replace(/"/g, "")};`
      : `${(value as string).replace(ENUM_SUFFIX, "")};`;
  });
  const requestQueryDefinition = isEmpty(requestQueryFieldList)
    ? ""
    : `query: ${requestQueryFieldList.sort().join("\n")}`;

  return `{
        ${requestBodyDefinition}
        ${requestQueryDefinition}
      }`;
};

const convertKeyAndAddQuote = (key: string) => {
  const isOptional = key.includes("?");
  const trimmedKey = trimEnd(key, "?");
  const newKey = isValidVariableName(trimmedKey) ? trimmedKey : camelCase(toCapitalCase(trimmedKey));

  return `'${newKey}'${isOptional ? "?" : ""}`;
};

export const convertJsonStringToJson = (
  str: unknown,
  errorMsg: string = ERROR_MESSAGES.INVALID_JSON_FILE_ERROR,
  output: (message: string) => void = redConsole,
) => {
  if (typeof str !== "string") {
    return;
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    output(errorMsg);
    return;
  }
};

export const convertResponseTypeObject = (responseType?: ResolvedSchema) => {
  if (isObject(responseType)) {
    return JSON.stringify(responseType).replace(/"/g, "");
  }

  if (responseType === "") {
    return undefined;
  }

  return responseType;
};
