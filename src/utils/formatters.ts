import { camelCase, Dictionary, forEach, indexOf, isEmpty, map, pickBy, replace, trimEnd } from "lodash";
import prettier from "prettier";
import { isObject } from "./specifications";
import { ENUM_SUFFIX, ERROR_MESSAGES } from "../constants";

export const toCapitalCase = (str?: string): string => {
  if (!str) {
    return "";
  }

  const camelStr = camelCase(str);
  return `${camelStr.charAt(0).toUpperCase()}${camelStr.slice(1)}`;
};

const addPrefix = (prefix: string) => (str: string = "") => `${prefix}${str}`;
export const addPrefixForInterface = addPrefix("I");

export const arrayToObject = (arr: any[] = []) => {
  let obj: any = {};

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

export const toTypes = (definitions: Dictionary<any> | string) => {
  if (isEmpty(definitions)) {
    return;
  }

  const fieldDefinitionList = map<string, any>(definitions, (value: any, key: string) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `${convertKeyToCamelCaseAndAddQuote(key)}: FormData`;
    }

    return isObject(value)
      ? `${convertKeyToCamelCaseAndAddQuote(key)}: ${JSON.stringify(value).replace(/"/g, "")};`
      : `${convertKeyToCamelCaseAndAddQuote(key)}: ${replace(value, ENUM_SUFFIX, "")};`;
  });

  return (
    definitions &&
    `{
        ${fieldDefinitionList.sort().join("\n")}
      }`
  );
};

export const toRequestTypes = (requestTypeObj: Record<string, string>) => {
  const requestBodyFieldList = map<string, any>(requestTypeObj.body, (value: any) => {
    if (isObject(value) && Object.keys(value).length === 1 && !isEmpty(pickBy(value, (type) => type === "FormData"))) {
      return `FormData;`;
    }

    return isObject(value)
      ? `${JSON.stringify(value).replace(/"/g, "")};`
      : `${replace(value, ENUM_SUFFIX, "")};`;
  });
  const requestBodyDefinition = isEmpty(requestBodyFieldList) ? "" : `body: ${requestBodyFieldList.sort().join("\n")}`;

  if (requestTypeObj.query && Object.keys(requestTypeObj.query).length > 0) {
    const requestQueryDefinition = `query: ${toTypes(requestTypeObj.query)}`
    return (
      `{
        ${requestBodyDefinition}
        ${requestQueryDefinition}
      }`
    );
  }

  const requestQueryFieldList = map<string, any>(requestTypeObj.query, (value: any) => {
    return isObject(value)
      ? `${JSON.stringify(value).replace(/"/g, "")};`
      : `${replace(value, ENUM_SUFFIX, "")};`;
  });
  const requestQueryDefinition = isEmpty(requestQueryFieldList) ? "" : `query: ${requestQueryFieldList.sort().join("\n")}`;

  return (
    `{
        ${requestBodyDefinition}
        ${requestQueryDefinition}
      }`
  );
}

const convertKeyToCamelCaseAndAddQuote = (key: string) => {
  const isOptional = indexOf(key, "?") > -1;
  return `'${camelCase(toCapitalCase(trimEnd(key, "?")))}'${isOptional ? "?" : ""}`;
};

export const convertJsonToString = (
  str: unknown,
  errorMsg: string = ERROR_MESSAGES.INVALID_JSON_FILE_ERROR,
  output: (message: string) => void = console.error,
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
