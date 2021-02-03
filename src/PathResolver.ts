import {
  Operation,
  Parameter,
  Path,
  Paths,
  Reference,
  RequestBody,
  Response,
  Schema,
} from "@openapi-integration/openapi-schema";
import { SchemaResolver } from "./SchemaResolver";
import { generateEnums } from "./DefinitionsResolver";
import { camelCase, chain, Dictionary, filter, get, isEmpty, map, pick, reduce, sortBy } from "lodash";
import {
  generateClientName,
  generateFunctionName,
  generateRequestArguments,
  isRequestBody,
  isSchema,
  toCapitalCase,
} from "./utils";
import { HTTP_METHODS, SLASH } from "./constants";
import { IParameters, IResolvedPath } from "./types";

// TODO: Should handle `deprecated` and `security` in Operation?
export class PathResolver {
  resolvedPaths: IResolvedPath[] = [];
  extraDefinitions = {};
  contentType = "";

  static of(paths: Paths) {
    return new PathResolver(paths);
  }

  constructor(private paths: Paths) {}

  resolve = () => {
    this.resolvedPaths = reduce(
      this.paths,
      (results: IResolvedPath[], path: Path, pathName: string) => [...results, ...this.resolvePath(path, pathName)],
      [],
    );
    return this;
  };

  toRequest = (): string[] => {
    const data = sortBy(this.resolvedPaths, (o) => o.operationId);
    const requests = data.map((resolvedPath: IResolvedPath) => {
      const bodyData = get(resolvedPath.bodyParams, "[0]");
      const cookie = get(resolvedPath.formDataParams, "[0]");
      const requestBody = get(resolvedPath, "requestBody");
      const body = camelCase(toCapitalCase(requestBody || bodyData || cookie));
      const params = this.toRequestParams(get(resolvedPath, "queryParams"));

      return `export const ${generateFunctionName(
        resolvedPath.method,
        resolvedPath.operationId,
      )} = (${generateRequestArguments(resolvedPath)}) => 
        ${generateClientName(resolvedPath.method, resolvedPath.TResp)}({
        url: \`${resolvedPath.url}\`,
        method: "${resolvedPath.method}",
        ${body ? `data: ${body},` : ""}${params ? `params: ${params},` : ""}${
        body ? `headers: {'Content-Type': "${this.contentType}"},` : ""
      }...axiosConfig}${resolvedPath.method === "get" ? ", SWRConfig" : ""});`;
    });

    const enums = Object.keys(this.extraDefinitions).map((k) => generateEnums(this.extraDefinitions, k));
    return [...requests, ...enums];
  };

  toRequestParams = (data: any[] = []) =>
    !isEmpty(data)
      ? `{
    ${data.join(",\n")}
    }`
      : undefined;

  resolvePath(path: Path, pathName: string) {
    const operations = pick(path, HTTP_METHODS);

    return Object.keys(operations).map((httpMethod) => ({
      url: this.getRequestURL(pathName),
      method: httpMethod,
      ...this.resolveOperation((operations as Dictionary<any>)[httpMethod]),
    }));
  }

  getRequestURL = (pathName: string) => {
    return chain(pathName)
      .split(SLASH)
      .map((p) => (this.isPathParam(p) ? `$${p}` : p))
      .join(SLASH)
      .value();
  };

  isPathParam = (str: string) => str.startsWith("{");

  // TODO: handle the case when v.parameters = Reference
  resolveOperation = (operation: Operation) => {
    const pickParamsByType = this.pickParams(operation.parameters as Parameter[]);
    const params = {
      pathParams: pickParamsByType("path"),
      queryParams: pickParamsByType("query"),
      bodyParams: pickParamsByType("body"),
      formDataParams: pickParamsByType("cookie"),
    };

    return {
      operationId: operation.operationId,
      TResp: this.getResponseTypes(operation.responses),
      TReq: this.getRequestTypes(params, operation.operationId as string, get(operation, "requestBody")),
      ...this.getParamsNames(params),
      ...this.getRequestBodyName(get(operation, "requestBody"), operation.operationId),
    };
  };

  getParamsNames = (params: IParameters) => {
    const getNames = (list: any[]) => (isEmpty(list) ? [] : map(list, (item) => item.name));
    return {
      pathParams: getNames(params.pathParams),
      queryParams: getNames(params.queryParams),
      bodyParams: getNames(params.bodyParams),
      formDataParams: getNames(params.formDataParams),
    };
  };

  getRequestTypes = (params: IParameters, operationId: string, requestBody?: RequestBody | Reference) => ({
    ...this.getPathParamsTypes(params.pathParams),
    ...this.getBodyAndQueryParamsTypes(params.bodyParams),
    ...this.getBodyAndQueryParamsTypes(params.queryParams),
    ...this.getFormDataParamsTypes(params.formDataParams),
    ...this.getRequestBodyTypes(operationId, requestBody),
  });

  getPathParamsTypes = (pathParams: Parameter[]) =>
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

  getBodyAndQueryParamsTypes = (bodyParams: Parameter[]) =>
    bodyParams.reduce(
      (results, param) => ({
        ...results,
        [`${param.name}${param.required ? "" : "?"}`]: SchemaResolver.of({
          results: this.extraDefinitions,
          schema: param.schema,
          key: param.name,
          parentKey: param.name,
        }).resolve(),
      }),
      {},
    );

  // TODO: handle other params here?
  getFormDataParamsTypes = (formDataParams: any[]) => {
    return formDataParams.reduce((results, param) => {
      if (param.schema) {
        return {
          ...results,
          [`${param.name}${param.required ? "" : "?"}`]: SchemaResolver.of({
            results: this.extraDefinitions,
            schema: param.schema,
            key: param.name,
            parentKey: param.name,
          }).resolve(),
        };
      }
      return {
        ...results,
        [`${param.name}${param.required ? "" : "?"}`]: param.type === "file" ? "File" : param.type,
      };
    }, {});
  };

  // TODO: handle Response or Reference
  getResponseTypes = (responses: { [responseName: string]: Response | Reference }) =>
    SchemaResolver.of({
      results: this.extraDefinitions,
      // TODO: handle other content type here
      schema:
        get(responses, "200.content.application/json.schema") ||
        get(responses, "200.content.*/*.schema") ||
        get(responses, "201.content.application/json.schema") ||
        get(responses, "201.content.*/*.schema"),
    }).resolve();

  // TODO: when parameters has enum
  pickParams = (parameters: Parameter[]) => (type: "path" | "query" | "body" | "cookie") =>
    filter(parameters, (param) => param.in === type);

  getRequestBodyTypes(operationId: string, requestBody?: RequestBody | Reference) {
    if (isRequestBody(requestBody)) {
      return reduce(
        get(requestBody, "content"),
        (results, content, key) => {
          if (this.contentType === "") {
            this.contentType = key;
          }

          return {
            ...results,
            [`${operationId}Request`]: SchemaResolver.of({
              results: this.extraDefinitions,
              schema: content.schema,
              key: `${operationId}Request`,
              parentKey: `${operationId}Request`,
            }).resolve(),
          };
        },
        {},
      );
    }

    return {
      [`${operationId}Request`]: SchemaResolver.of({
        results: this.extraDefinitions,
        schema: requestBody as Schema,
        key: `${operationId}Request`,
        parentKey: `${operationId}Request`,
      }).resolve(),
    };
  }

  getRequestBodyName(requestBody?: RequestBody | Reference, operationId?: string) {
    if (requestBody) {
      return {
        requestBody: `${operationId}Request`,
      };
    }
  }
}
