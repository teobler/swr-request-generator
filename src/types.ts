import { ParameterObject, SchemaObject } from "@ts-stack/openapi-spec";
import { ResolvedSchema } from "src/resolvers/DefinitionsResolver";

export interface IReqBody {
  [bodyName: string]: string | Record<string, string>;
}

export interface IResolvedPath {
  url: string;
  method: string;
  TResp: ResolvedSchema;
  TReqQuery: { [queryName: string]: string } | Record<string, never>;
  TReqPath: { [pathName: string]: string } | Record<string, never>;
  TReqCookie?: { [cookieName: string]: string } | Record<string, never>;
  TReqBody: IReqBody | Record<string, never>;
  THeader: { [headerName: string]: string } | Record<string, never>;
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
  needRequestHook?: boolean;
  needClient?: boolean;
}

export interface ISchemaObjectWithNullable extends SchemaObject {
  nullable?: boolean;
}

export interface ISchemaResolverInputs {
  results: Record<string, ResolvedSchema>;
  schema?: ISchemaObjectWithNullable;
  key?: string;
  parentKey?: string;
}
