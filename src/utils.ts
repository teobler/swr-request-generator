import { camelCase, Dictionary, forEach, indexOf, isEmpty, map, replace, trimEnd } from "lodash";
import prettier from "prettier";
import { ENUM_SUFFIX, ERROR_MESSAGES } from "./constants";
import { isObject } from "./specifications";

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

export const toTypes = (obj: Dictionary<any> | string) => {
  if (isEmpty(obj)) {
    return;
  }

  const list = map<string, any>(obj, (value: any, key: string) => {
    if (isObject(value)) {
      return `${convertKeyToCamelCaseAndAddQuote(key)}: ${JSON.stringify(value).replace(/"/g, "")};`;
    }

    return `${convertKeyToCamelCaseAndAddQuote(key)}: ${replace(value, ENUM_SUFFIX, "")};`;
  });

  return (
    obj &&
    `{
        ${list.sort().join("\n")}
      }`
  );
};

const convertKeyToCamelCaseAndAddQuote = (k: string) => {
  const isOptional = indexOf(k, "?") > -1;
  return `'${camelCase(toCapitalCase(trimEnd(k, "?")))}'${isOptional ? "?" : ""}`;
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
