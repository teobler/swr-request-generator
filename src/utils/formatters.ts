import { camelCase, forEach, indexOf, isEmpty, map, pickBy, replace, trimEnd } from "lodash";
import prettier from "prettier";
import { isObject, isValidVariableName } from "./specifications";
import { ENUM_SUFFIX, ERROR_MESSAGES } from "../constants";
import { ReqBody } from "src/types";
import { ResolvedSchema } from "src/resolvers/DefinitionsResolver";
import { redConsole } from "../utils/console";

export const toCapitalCase = (str?: string): string => {
  if (!str) {
    return "";
  }

  const camelStr = camelCase(str);
  return `${camelStr.charAt(0).toUpperCase()}${camelStr.slice(1)}`;
};

export const arrayToObject = (arr: [string | number] | [] = []) => {
  const obj: Record<string, string | number> = {};

  forEach(arr, (item) => {
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

  const fieldDefinitionList = map(definitions, (value: Record<string, string>, key: string) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `${convertKeyAndAddQuote(key)}: FormData`;
    }

    return isObject(value)
      ? `${convertKeyAndAddQuote(key)}: ${JSON.stringify(value).replace(/"/g, "")};`
      : `${convertKeyAndAddQuote(key)}: ${replace(value, ENUM_SUFFIX, "")};`;
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
  const requestBodyFieldList = map(requestTypeObj.body, (value) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `FormData;`;
    }

    return isObject(value) ? `${JSON.stringify(value).replace(/"/g, "")};` : `${replace(value, ENUM_SUFFIX, "")};`;
  });
  const requestBodyDefinition = isEmpty(requestBodyFieldList) ? "" : `body: ${requestBodyFieldList.sort().join("\n")}`;

  if (requestTypeObj.query && Object.keys(requestTypeObj.query).length > 0) {
    const requestQueryDefinition = `query: ${toTypes(requestTypeObj.query)}`;
    return `{
        ${requestBodyDefinition}
        ${requestQueryDefinition}
      }`;
  }

  const requestQueryFieldList = map(requestTypeObj.query, (value) => {
    return isObject(value) ? `${JSON.stringify(value).replace(/"/g, "")};` : `${replace(value, ENUM_SUFFIX, "")};`;
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
  const isOptional = indexOf(key, "?") > -1;
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
