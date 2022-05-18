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

const convertKeyToCamelCaseAndAddQuote = (key: string) => {
  const isOptional = indexOf(key, "?") > -1;
  key = trimEnd(key, "?")
  const isValidVariableName = /^([a-zA-Z_$][a-zA-Z\d_$]*)$/gm.test(key);
  return `'${ isValidVariableName ? key : camelCase(toCapitalCase(key))}'${isOptional ? "?" : ""}`;
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
