import { ParameterObject, SchemaObject } from "@ts-stack/openapi-spec";
import { ResolvedSchema } from "src/resolvers/DefinitionsResolver";

export interface ReqBody {
  [bodyName: string]: string | Record<string, string>;
}

export interface ResolvedPath {
  url: string;
  method: string;
  TResp: ResolvedSchema;
  TReqQuery: { [queryName: string]: string } | Record<string, never>;
  TReqPath: { [pathName: string]: string } | Record<string, never>;
  TReqCookie?: { [cookieName: string]: string } | Record<string, never>;
  TReqBody: ReqBody | Record<string, never>;
  THeader: { [headerName: string]: string } | Record<string, never>;
  requestBody?: string;
  operationId?: string;
  pathParams: string[] | [];
  queryParams: string[] | [];
  cookieParams: string[] | [];
}

export interface Parameters {
  pathParams: ParameterObject[];
  queryParams: ParameterObject[];
  cookieParams: ParameterObject[];
}

export interface CodegenConfig {
  output?: string;
  fileHeaders?: string[];
  timeout?: number;
  data?: string[];
  clients?: string[];
  fileName?: string;
  needRequestHook?: boolean;
  needClient?: boolean;
}

export interface SchemaObjectWithNullable extends SchemaObject {
  nullable?: boolean;
}

export interface SchemaResolverInputs {
  results: Record<string, ResolvedSchema>;
  schema?: SchemaObjectWithNullable;
  key?: string;
  parentKey?: string;
}
