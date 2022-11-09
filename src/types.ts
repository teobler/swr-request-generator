import { ParameterObject, SchemaObject } from "@ts-stack/openapi-spec";

export interface IResolvedPath {
  url: string;
  method: string;
  TResp: any;
  TReqQuery: any,
  TReqPath: any,
  TReqCookie: any,
  TReqBody: Record<string, any>;
  THeader: Record<string, any>;
  requestBody?: string;
  operationId?: string;
  pathParams: string[];
  queryParams: string[];
  cookieParams: string[];
}

export interface IParameters {
  pathParams: ParameterObject[];
  queryParams: ParameterObject[];
  cookieParams: ParameterObject[];
}

export interface ICodegenConfig {
  output?: string;
  fileHeaders?: string[];
  timeout?: number;
  data?: string[];
  clients?: string[];
  fileName?: string;
}

export type TDictionary<T> = { [key: string]: T };

export interface SchemaObjectWithNullable extends SchemaObject {
  nullable?: boolean;
}

export interface ISchemaResolverInputs {
  results: TDictionary<any>;
  schema?: SchemaObjectWithNullable;
  key?: string;
  parentKey?: string;
}
