import { Parameter, Schema } from "@openapi-integration/openapi-schema";

export interface IResolvedPath {
  url: string;
  method: string;
  TResp: any;
  TReq: any;
  THeader: any;
  requestBody?: string;
  operationId?: string;
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  formDataParams: string[];
}

export interface IParameters {
  pathParams: Parameter[];
  queryParams: Parameter[];
  bodyParams: Parameter[];
  formDataParams: Parameter[];
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

export interface ISchemaResolverInputs {
  results: TDictionary<any>;
  schema?: Schema;
  key?: string;
  parentKey?: string;
}
