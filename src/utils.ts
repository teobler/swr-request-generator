import { camelCase, Dictionary, forEach, has, indexOf, map, replace, trimEnd } from "lodash";
import prettier from "prettier";
import { ERROR_MESSAGES } from "./constants";
import { Reference, RequestBody, Schema } from "@openapi-integration/openapi-schema";

export const toCapitalCase = (str?: string): string => {
  if (!str) {
    return "";
  }
  const camelStr = camelCase(str);
  return `${camelStr.charAt(0).toUpperCase()}${camelStr.slice(1)}`;
};

export const addPrefix = (prefix: string) => (str: string = "") => `${prefix}${str}`;

export const addPrefixForInterface = addPrefix("I");

export const arrayToObject = (arr: any[] = []) => {
  let obj: any = {};
  forEach(arr, (item) => {
    obj[item] = item;
  });
  return obj;
};

export const isArray = (data: any) => Object.prototype.toString.call(data) === "[object Array]";
export const isObject = (data: any) => Object.prototype.toString.call(data) === "[object Object]";
export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: "all",
    arrowParens: "always",
    parser: "typescript",
  });

const ENUM_SUFFIX = `#EnumTypeSuffix`;

export const toTypes = (obj: Dictionary<any> | string) => {
  if (!obj) {
    return;
  }
  const list = map<string, any>(obj, (value: any, key: string) => {
    if (isObject(value)) {
      return `${quoteKey(key)}: ${JSON.stringify(value)};`;
    }

    return `${quoteKey(key)}: ${replace(value, ENUM_SUFFIX, "")};`;
  });

  return (
    obj &&
    `{
        ${list.sort().join("\n")}
      }`
  );
};

export const quoteKey = (k: string) => {
  const isOptional = indexOf(k, "?") > -1;
  return `'${trimEnd(k, "?")}'${isOptional ? "?" : ""}`;
};

export function testJSON(
  str: unknown,
  errorMsg: string = ERROR_MESSAGES.INVALID_JSON_FILE_ERROR,
  output: (message: string) => void = console.error,
) {
  if (typeof str !== "string") {
    return;
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    output(errorMsg);
    return;
  }
}

export const isSchema = (schema?: Schema | Reference): schema is Schema => !has(schema, "$ref");
export const isRequestBody = (requestBody?: RequestBody | Reference): requestBody is RequestBody =>
  !has(requestBody, "$ref");
