import { camelCase, compact, Dictionary, forEach, indexOf, isEmpty, map, replace, some, trimEnd } from "lodash";
import prettier from "prettier";
import { ERROR_MESSAGES } from "./constants";
import { IResolvedPath } from "./types";
import { isNumber, isObject } from "./specifications";

const ENUM_SUFFIX = `#EnumTypeSuffix`;

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

export const generateRequestArguments = (resolvedPath: IResolvedPath) => {
  const argumentTypes = !isEmpty(resolvedPath.TReq) ? toTypes(resolvedPath.TReq) : undefined;
  const requestParamList = compact([
    ...resolvedPath.pathParams,
    ...resolvedPath.queryParams,
    ...resolvedPath.bodyParams,
    ...resolvedPath.formDataParams,
    resolvedPath.requestBody,
  ]).map((param) => camelCase(param));

  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;
  return resolvedPath.method === "get"
    ? `${requestParams ? requestParams + ", " : ""}SWRConfig?: ISWRConfig<${
        resolvedPath.TResp || undefined
      }, IResponseError>, axiosConfig?: AxiosRequestConfig`
    : `${requestParams ? requestParams + ", " : ""}axiosConfig?: AxiosRequestConfig`;
};

export const generateFunctionName = (method: string, operationId?: string) => {
  return method === "get" ? `use${toCapitalCase(camelCase(operationId))}Request` : `${camelCase(operationId)}Request`;
};

export const generateClientName = (method: string, responseType: any) => {
  return method === "get"
    ? `useRequest<${responseType || undefined}, IResponseError>`
    : `client.request<${responseType || undefined}, AxiosResponse<${responseType || undefined}>>`;
};

export const generateEnums = (definitions: Dictionary<any>, key: string) => {
  if (isEmpty(definitions)) {
    return "";
  }

  const enums = definitions[key];
  const hasNumber = some(enums, (enumValue) => isNumber(enumValue));
  const enumName = replace(key, ENUM_SUFFIX, "");

  return hasNumber
    ? `export type ${enumName} = ${enums.map((item: string | number) => JSON.stringify(item)).join("|")}`
    : `export enum ${enumName} ${JSON.stringify(arrayToObject(enums)).replace(/:/gi, "=")}`;
};
