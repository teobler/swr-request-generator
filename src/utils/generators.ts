import { camelCase, compact, Dictionary, get, isEmpty, reduce, replace, some } from "lodash";
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

export const generateFunctionName = (operationId?: string) => `use${toCapitalCase(camelCase(operationId))}Request`;

export const generateClientName = (method: string, responseType: any) =>
  method === "get"
    ? `useGetRequest<${responseType || undefined}, IResponseError>`
    : `useMutationRequest<${responseType || undefined}, AxiosResponse<${responseType || undefined}>>`;
// TODO: 1.refactor THeader logic to align with resolvedPath.xxxParams
// TODO: 2.add response type for download file
export const generateRequestArguments = (resolvedPath: IResolvedPath) => {
  const argumentTypes = !isEmpty({ ...resolvedPath.TReq, ...resolvedPath.THeader })
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

export const generateHeader = (
  hasBody: boolean,
  contentTypes: { [operationId: string]: string },
  operationId?: string,
  header?: Record<string, string>,
) => {
  const result = reduce(header, (result, _, key) => result + `"${key}": ` + camelCase(key) + ", ", "");
  const contentType = hasBody ? `"Content-Type": "${get(contentTypes, operationId ?? "", "application/json")}"` : "";

  return `headers: { ${result}${contentType}},`;
};

export const generateResponseType = (axiosHeaderConfig: string) =>
  axiosHeaderConfig.includes('"Accept":') ? 'responseType: "blob",' : "";
