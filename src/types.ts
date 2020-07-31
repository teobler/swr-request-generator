import { Parameter } from "@openapi-integration/openapi-schema";

export interface IResolvedPath {
  url: string;
  method: string;
  TResp: any;
  TReq: any;
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
