import { has } from "lodash";
import { ReferenceObject, RequestBodyObject, SchemaObject } from "@ts-stack/openapi-spec";

export const isArray = (data: any) => Object.prototype.toString.call(data) === "[object Array]";
export const isObject = (data: any): data is Object => Object.prototype.toString.call(data) === "[object Object]";
export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
export const isSchema = (schema?: SchemaObject | ReferenceObject): schema is SchemaObject => !has(schema, "$ref");
export const isRequestBody = (requestBody?: RequestBodyObject | ReferenceObject): requestBody is RequestBodyObject =>
  !has(requestBody, "$ref");
