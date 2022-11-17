import { ParameterObject, SchemaObject } from "@ts-stack/openapi-spec";
import { ResolvedSchema } from "src/resolvers/DefinitionsResolver";

export interface ReqBody {
  [bodyName: string]: string | Record<string, string>;
}

export interface IResolvedPath {
  url: string;
  method: string;
  TResp: ResolvedSchema;
  TReqQuery: { [queryName: string]: string } | {};
  TReqPath: { [pathName: string]: string } | {};
  TReqCookie?: { [cookieName: string]: string } | {};
  TReqBody: ReqBody | {};
  THeader: { [headerName: string]: string } | {};
  requestBody?: string;
  operationId?: string;
  pathParams: string[] | [];
  queryParams: string[] | [];
  cookieParams: string[] | [];
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
