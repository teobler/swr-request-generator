import { camelCase, compact, get, isEmpty, reduce, replace, some } from "lodash";
import { isNumber } from "./specifications";
import { IReqBody, IResolvedPath } from "../types";
import { ENUM_SUFFIX } from "../constants";
import { arrayToObject, convertResponseTypeObject, toCapitalCase, toTypes } from "./formatters";
import { RequestBodiesAndParams } from "src/resolvers/PathResolver";
import { ResolvedDefinitions, ResolvedSchema } from "src/resolvers/DefinitionsResolver";

export const generateEnums = (definitions: ResolvedDefinitions, key: string) => {
  if (isEmpty(definitions)) {
    return "";
  }

  const enums = definitions[key] as [string | number];
  const hasNumber = some(enums, (enumValue) => isNumber(enumValue));
  const enumName = replace(key, ENUM_SUFFIX, "");

  return hasNumber
    ? `export type ${enumName} = ${enums.map((item: string | number) => JSON.stringify(item)).join("|")}`
    : `export enum ${enumName} ${JSON.stringify(arrayToObject(enums)).replace(/:/gi, "=")}`;
};

export const generateFunctionName = (operationId?: string) => `use${toCapitalCase(camelCase(operationId))}Request`;

export const generateGetClientName = (responseType?: ResolvedSchema) =>
  `useGetRequest<${convertResponseTypeObject(responseType)}, IResponseError>`;

export const generateMutationClientName = (responseType?: ResolvedSchema, requestBodyTypes?: string) =>
  `useMutationRequest<${requestBodyTypes}, AxiosResponse<${convertResponseTypeObject(responseType)}>, IResponseError>`;

export const generateRequestBodyAndParams = (
  requestBodyType?: IReqBody,
  requestQueryType?: Record<string, string>,
  operationId = "",
): RequestBodiesAndParams => {
  if (isEmpty(requestBodyType) && isEmpty(requestQueryType)) {
    return [undefined, undefined];
  }

  return [`${toCapitalCase(operationId)}Request`, { query: requestQueryType, body: requestBodyType }];
};

export const generateGetRequestArguments = (resolvedPath: IResolvedPath) => {
  const requestType = {
    ...resolvedPath.TReqQuery,
    ...resolvedPath.TReqPath,
    ...resolvedPath.THeader,
  };
  const argumentTypes = !isEmpty(requestType) ? toTypes(requestType, "request") : undefined;
  const requestParamList = compact([
    ...(resolvedPath.pathParams ?? []),
    ...(resolvedPath.queryParams ?? []),
    ...Object.keys(resolvedPath.THeader ?? {}),
  ]).map((param) => camelCase(param));
  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;

  return `${requestParams ? requestParams + ", " : ""}SWRConfig?: ISWRConfig<${convertResponseTypeObject(
    resolvedPath.TResp,
  )}, IResponseError>, axiosConfig?: AxiosRequestConfig`;
};

export const generateMutationRequestArguments = (resolvedPath: IResolvedPath, requestBodyTypes?: string) => {
  const requestType = {
    ...resolvedPath.TReqPath,
    ...resolvedPath.THeader,
  };
  const argumentTypes = !isEmpty(requestType) ? toTypes(requestType, "request") : undefined;
  const requestParamList = compact([
    ...(resolvedPath.pathParams ?? []),
    ...Object.keys(resolvedPath.THeader ?? {}),
  ]).map((param) => camelCase(param));
  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;

  return `${
    requestParams ? requestParams + ", " : ""
  }mutationConfig?: SWRMutationConfig<${requestBodyTypes}, AxiosResponse<${convertResponseTypeObject(
    resolvedPath.TResp,
  )}>, IResponseError>, axiosConfig?: AxiosRequestConfig`;
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
