import { camelCase, compact, Dictionary, forEach, has, indexOf, isEmpty, map, replace, trimEnd } from "lodash";
import prettier from "prettier";
import { ERROR_MESSAGES } from "./constants";
import { Reference, RequestBody, Schema } from "@openapi-integration/openapi-schema";
import { IResolvedPath } from "./types";

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

export const toTypes = (obj: Dictionary<any> | string) => {
  if (!obj) {
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

export const isSchema = (schema?: Schema | Reference): schema is Schema => !has(schema, "$ref");
export const isRequestBody = (requestBody?: RequestBody | Reference): requestBody is RequestBody =>
  !has(requestBody, "$ref");

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
    ? `${requestParams ? requestParams + ", " : ""}SWRConfig?: ISWRConfig<${resolvedPath.TResp || undefined}, IResponseError>, axiosConfig?: AxiosRequestConfig`
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
