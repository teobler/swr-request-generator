import { camelCase, isEmpty } from "moderndash";
import { isNumber, isValidVariableName } from "./specifications.js";
import { ReqBody, ResolvedPath } from "../types.js";
import { ENUM_SUFFIX } from "../constants.js";
import { arrayToObject, convertResponseTypeObject, toCapitalCase, toTypes } from "./formatters.js";
import { RequestBodiesAndParams } from "src/resolvers/PathResolver.js";
import { ResolvedDefinitions, ResolvedSchema } from "src/resolvers/DefinitionsResolver.js";
import { get } from "../utils/lodash.js";

export const generateEnums = (definitions: ResolvedDefinitions, key: string) => {
  if (isEmpty(definitions)) {
    return "";
  }

  const enums = definitions[key] as [string | number];
  const hasNumber = enums.some((enumValue) => isNumber(enumValue));
  const enumName = key.replace(ENUM_SUFFIX, "");

  return hasNumber
    ? `export type ${enumName} = ${enums.map((item: string | number) => JSON.stringify(item)).join("|")}`
    : `export enum ${enumName} ${JSON.stringify(arrayToObject(enums)).replace(/:/gi, "=")}`;
};

export const generateFunctionName = (operationId?: string) =>
  `use${toCapitalCase(camelCase(operationId || ""))}Request`;

export const generateGetClientName = (responseType?: ResolvedSchema) =>
  `useGetRequest<${convertResponseTypeObject(responseType)}, ResponseError>`;

export const generateMutationClientName = (responseType?: ResolvedSchema, requestBodyTypes?: string) =>
  `useMutationRequest<${requestBodyTypes}, AxiosResponse<${convertResponseTypeObject(responseType)}>, ResponseError>`;

export const generateRequestBodyAndParams = (
  requestBodyType?: ReqBody,
  requestQueryType?: Record<string, string>,
  operationId = "",
): RequestBodiesAndParams => {
  if (isEmpty(requestBodyType) && isEmpty(requestQueryType)) {
    return [undefined, undefined];
  }

  return [`${toCapitalCase(operationId)}Request`, { query: requestQueryType, body: requestBodyType }];
};

export const generateGetRequestArguments = (resolvedPath: ResolvedPath) => {
  const requestType = {
    ...resolvedPath.TReqQuery,
    ...resolvedPath.TReqPath,
    ...resolvedPath.THeader,
  };
  const argumentTypes = !isEmpty(requestType) ? toTypes(requestType) : undefined;
  const requestParamList = [
    ...(resolvedPath.pathParams ?? []),
    ...(resolvedPath.queryParams ?? []),
    ...Object.keys(resolvedPath.THeader ?? {}),
  ]
    .filter(Boolean)
    .map((param) => (isValidVariableName(param) ? param : camelCase(param)));
  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;

  return `${requestParams ? requestParams + ", " : ""}SWRConfig?: SWRConfig<${convertResponseTypeObject(
    resolvedPath.TResp,
  )}, ResponseError>, axiosConfig?: AxiosRequestConfig`;
};

export const generateMutationRequestArguments = (resolvedPath: ResolvedPath, requestBodyTypes?: string) => {
  const requestType = {
    ...resolvedPath.TReqPath,
    ...resolvedPath.THeader,
  };
  const argumentTypes = !isEmpty(requestType) ? toTypes(requestType) : undefined;
  const requestParamList = [...(resolvedPath.pathParams ?? []), ...Object.keys(resolvedPath.THeader ?? {})]
    .filter(Boolean)
    .map((param) => (isValidVariableName(param) ? param : camelCase(param)));
  const requestParams = requestParamList.length === 0 ? "" : `{${requestParamList.join(",")}}:${argumentTypes}`;

  return `${
    requestParams ? requestParams + ", " : ""
  }mutationConfig?: SWRMutationConfig<${requestBodyTypes}, AxiosResponse<${convertResponseTypeObject(
    resolvedPath.TResp,
  )}>, ResponseError>, axiosConfig?: AxiosRequestConfig`;
};

export const generateHeader = (
  hasBody: boolean,
  contentTypes: { [operationId: string]: string },
  operationId?: string,
  header?: Record<string, string>,
) => {
  const result = Object.entries(header ?? {}).reduce((result, [typeKey]) => {
    const typeValue = isValidVariableName(typeKey) ? typeKey : camelCase(typeKey);
    return result + `"${typeKey}": ` + typeValue + ", ";
  }, "");
  const contentType = hasBody ? `"Content-Type": "${get(contentTypes, operationId ?? "", "application/json")}"` : "";

  return `headers: { ${result}${contentType}},`;
};

export const generateResponseType = (axiosHeaderConfig: string) =>
  axiosHeaderConfig.includes('"Accept":') ? 'responseType: "blob",' : "";
