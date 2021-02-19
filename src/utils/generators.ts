import { camelCase, compact, Dictionary, isEmpty, reduce, replace, some } from "lodash";
import { isNumber } from "./specifications";
import { IResolvedPath } from "../types";
import { ENUM_SUFFIX } from "../constants";
import { arrayToObject, toCapitalCase, toTypes } from "./formatters";

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

export const generateFunctionName = (method: string, operationId?: string) =>
  method === "get" ? `use${toCapitalCase(camelCase(operationId))}Request` : `${camelCase(operationId)}Request`;

export const generateClientName = (method: string, responseType: any) =>
  method === "get"
    ? `useRequest<${responseType || undefined}, IResponseError>`
    : `client.request<${responseType || undefined}, AxiosResponse<${responseType || undefined}>>`;

export const generateRequestArguments = (resolvedPath: IResolvedPath) => {
  const argumentTypes = !isEmpty(resolvedPath.TReq)
    ? toTypes({ ...resolvedPath.TReq, ...resolvedPath.THeader })
    : undefined;
  const requestParamList = compact([
    ...resolvedPath.pathParams,
    ...resolvedPath.queryParams,
    ...resolvedPath.bodyParams,
    ...resolvedPath.formDataParams,
    ...Object.keys(resolvedPath.THeader),
    resolvedPath.requestBody,
  ]).map((param) => camelCase(param));

  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;

  return resolvedPath.method === "get"
    ? `${requestParams ? requestParams + ", " : ""}SWRConfig?: ISWRConfig<${
        resolvedPath.TResp || undefined
      }, IResponseError>, axiosConfig?: AxiosRequestConfig`
    : `${requestParams ? requestParams + ", " : ""}axiosConfig?: AxiosRequestConfig`;
};

export const generateHeader = (header?: Record<string, string>) => {
  const result = reduce(header, (result, _, key) => result + `"${key}": ` + camelCase(key) + ", ", "");

  return isEmpty(header) ? "" : `headers: { ${result}},`;
};
