import { SchemaResolver } from "./SchemaResolver";
import { assign, camelCase, chain, filter, get, isEmpty, map, pick, reduce, sortBy } from "lodash";
import { HTTP_METHODS, SLASH } from "../constants";
import { IParameters, IResolvedPath, ReqBody } from "../types";
import { isRequestBody, isSchema } from "../utils/specifications";
import {
  generateEnums,
  generateFunctionName,
  generateGetClientName,
  generateGetRequestArguments,
  generateHeader,
  generateMutationClientName,
  generateMutationRequestArguments,
  generateRequestBodyAndParams,
  generateResponseType,
} from "../utils/generators";
import { toCapitalCase, toRequestTypes } from "../utils/formatters";
import {
  OperationObject,
  ParameterObject,
  PathItemObject,
  PathsObject,
  ReferenceObject,
  RequestBodyObject,
  ResponsesObject,
} from "@ts-stack/openapi-spec";
import { yellowConsole } from "../utils/console";

export type RequestBodiesAndParams =
  | [string, { body: ReqBody | undefined; query: Record<string, string> | undefined }]
  | [undefined, undefined];

type RequestTypeOfPathItemObject = Extract<
  "get" | "post" | "put" | "delete" | "patch" | "options" | "head",
  keyof PathItemObject
>;

export class PathResolver {
  resolvedPaths: IResolvedPath[] = [];
  extraDefinitions = {};
  contentType: { [operationId: string]: string } = {};

  static of(paths: PathsObject) {
    return new PathResolver(paths);
  }

  constructor(private paths: PathsObject) {}

  resolve = () => {
    this.resolvedPaths = reduce(
      this.paths,
      (results: IResolvedPath[], path: PathItemObject, pathName: string) => [
        ...results,
        ...this.resolvePath(path, pathName),
      ],
      [],
    );
    return this;
  };

  toRequest = (): string[] => {
    const data = sortBy(this.resolvedPaths, (o) => o.operationId);
    const requestBodiesAndParams: RequestBodiesAndParams[] = [];
    const requestHooks = data.map((resolvedPath: IResolvedPath) => {
      const headerType = get(resolvedPath, "THeader");
      const cookie = get(resolvedPath.cookieParams, "[0]");
      const requestBody = get(resolvedPath, "requestBody");
      const body = camelCase(toCapitalCase(requestBody || cookie));
      const params = this.toHookParams(get(resolvedPath, "queryParams"));
      const axiosHeaderConfig = generateHeader(!isEmpty(body), this.contentType, resolvedPath.operationId, headerType);
      const [requestInterfaceName, requestInterfaceObj] = generateRequestBodyAndParams(
        resolvedPath.TReqBody,
        resolvedPath.TReqQuery,
        resolvedPath.operationId,
      );
      requestBodiesAndParams.push([requestInterfaceName, requestInterfaceObj] as RequestBodiesAndParams);

      if (resolvedPath.method === "get") {
        return `export const ${generateFunctionName(resolvedPath.operationId)} = (${generateGetRequestArguments(
          resolvedPath,
        )}) => 
        ${generateGetClientName(resolvedPath.TResp)}({
        url: \`${resolvedPath.url}\`,
        method: "${resolvedPath.method}",${axiosHeaderConfig}${generateResponseType(axiosHeaderConfig)}
        ${params ? `params: ${params},` : ""}...axiosConfig}, SWRConfig);`;
      }

      return `export const ${generateFunctionName(resolvedPath.operationId)} = (${generateMutationRequestArguments(
        resolvedPath,
        requestInterfaceName,
      )}) => 
        ${generateMutationClientName(resolvedPath.TResp, requestInterfaceName)}({
        url: \`${resolvedPath.url}\`,
        method: "${resolvedPath.method}",${axiosHeaderConfig}${generateResponseType(axiosHeaderConfig)}
        mutationConfig,
        axiosConfig});`;
    });

    const enums = Object.keys(this.extraDefinitions).map((k) => generateEnums(this.extraDefinitions, k));

    const requestParamsDefinition = requestBodiesAndParams
      .map(([interfaceName, request]: RequestBodiesAndParams) => {
        if (!interfaceName) return undefined;

        Object.keys(request).forEach((key) => {
          if (isEmpty(request[key as "body" | "query"])) {
            delete request[key as "body" | "query"];
          }
        });

        return `export interface ${interfaceName} ${toRequestTypes(request)}`;
      })
      .filter(Boolean) as string[];

    return [...requestHooks, ...requestParamsDefinition, ...enums];
  };

  private toHookParams = (data: string[] = []) =>
    !isEmpty(data)
      ? `{
    ${data.join(",\n")}
    }`
      : undefined;

  private resolvePath(path: PathItemObject, pathName: string) {
    const operations = pick(path, HTTP_METHODS);

    return Object.keys(operations).map((httpMethod) => ({
      url: this.getRequestURL(pathName),
      method: httpMethod,
      ...this.resolveOperation(operations[httpMethod as RequestTypeOfPathItemObject] as OperationObject),
    }));
  }

  private getRequestURL = (pathName: string) => {
    return chain(pathName)
      .split(SLASH)
      .map((p) => (this.isPathParam(p) ? `$${p}` : p))
      .join(SLASH)
      .value();
  };

  private isPathParam = (str: string) => str.startsWith("{");

  private resolveOperation = (operation: OperationObject) => {
    if (!operation.operationId) {
      yellowConsole("your request does not have an operation id, generated request method will not has uniq name!\n");
    }

    const pickParamsByType = this.pickParams(operation.parameters as ParameterObject[] | undefined);
    // axios config header data
    const headerParams = pickParamsByType("header");
    // axios config params data
    const params = {
      pathParams: pickParamsByType("path"),
      queryParams: pickParamsByType("query"),
      cookieParams: pickParamsByType("cookie"),
    };

    return {
      operationId: operation.operationId,
      TResp: this.getResponseTypes(operation.responses),
      TReqQuery: this.getQueryParamsTypes(params.queryParams),
      TReqPath: this.getPathParamsTypes(params.pathParams),
      TReqCookie: this.getCookieParamsTypes(params.cookieParams),
      TReqBody: this.getRequestBodyTypes(operation.operationId, get(operation, "requestBody")),
      THeader: this.getPathParamsTypes(headerParams),
      ...this.getParamsNames(params),
      ...this.getRequestBodyName(get(operation, "requestBody"), operation.operationId),
    };
  };

  private getParamsNames = (params: IParameters) => {
    const getNames = (list: ParameterObject[]) => (isEmpty(list) ? [] : map(list, (item) => item.name));
    return {
      pathParams: getNames(params.pathParams),
      queryParams: getNames(params.queryParams),
      cookieParams: getNames(params.cookieParams),
    };
  };

  private getPathParamsTypes = (pathParams: ParameterObject[]) =>
    pathParams.reduce((results, param) => {
      const schema = get(param, "schema");

      if (isSchema(schema)) {
        return {
          ...results,
          [`${param.name}${param.required ? "" : "?"}`]: schema.type === "integer" ? "number" : schema.type,
        };
      }

      return {
        ...results,
      };
    }, {});

  private getQueryParamsTypes = (queryParams: ParameterObject[]) =>
    queryParams.reduce(
      (results, param) => ({
        ...results,
        [`${param.name}${param.required ? "" : "?"}`]: SchemaResolver.of({
          results: this.extraDefinitions,
          schema: param.schema,
          key: param.name,
          parentKey: param.name,
        })
          .resolve()
          .getSchemaType(),
      }),
      {},
    );

  private getCookieParamsTypes = (formDataParams?: ParameterObject[]) => {
    return formDataParams?.reduce((results, param) => {
      return {
        ...results,
        [`${param.name}${param.required ? "" : "?"}`]: SchemaResolver.of({
          results: this.extraDefinitions,
          schema: param.schema,
          key: param.name,
          parentKey: param.name,
        })
          .resolve()
          .getSchemaType(),
      };
    }, {});
  };

  private getResponseTypes = (responses?: ResponsesObject) =>
    SchemaResolver.of({
      results: this.extraDefinitions,
      schema:
        get(responses, "200.content.application/json.schema") ||
        get(responses, "200.content.*/*.schema") ||
        get(responses, "201.content.application/json.schema") ||
        get(responses, "201.content.*/*.schema"),
    })
      .resolve()
      .getSchemaType();

  private pickParams = (parameters?: ParameterObject[]) => (type: "query" | "header" | "path" | "cookie") =>
    filter(parameters, (param) => param.in === type);

  private getContentType(key: string, operationId?: string) {
    // in openAPI spec, the key of content in requestBody field is content type
    operationId && assign(this.contentType, { [operationId]: key });
  }

  private getRequestBodyTypes(operationId?: string, requestBody?: RequestBodyObject | ReferenceObject) {
    if (isRequestBody(requestBody)) {
      return reduce(
        get(requestBody, "content"),
        (results, content, key) => {
          this.getContentType(key, operationId);

          return {
            ...results,
            [`${operationId}Request`]: SchemaResolver.of({
              results: this.extraDefinitions,
              schema: content.schema,
              key: `${operationId}Request`,
              parentKey: `${operationId}Request`,
            })
              .resolve()
              .getSchemaType(),
          };
        },
        {},
      );
    }

    return {
      [`${operationId}Request`]: SchemaResolver.of({
        results: this.extraDefinitions,
        schema: requestBody,
        key: `${operationId}Request`,
        parentKey: `${operationId}Request`,
      })
        .resolve()
        .getSchemaType(),
    };
  }

  private getRequestBodyName(requestBody?: RequestBodyObject | ReferenceObject, operationId?: string) {
    if (requestBody) {
      return {
        requestBody: `${operationId}Request`,
      };
    }
  }
}
