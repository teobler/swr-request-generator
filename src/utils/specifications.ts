import { Reference, RequestBody, Schema } from "@openapi-integration/openapi-schema";
import { has } from "lodash";

export const isArray = (data: any) => Object.prototype.toString.call(data) === "[object Array]";
export const isObject = (data: any) => Object.prototype.toString.call(data) === "[object Object]";
export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
export const isSchema = (schema?: Schema | Reference): schema is Schema => !has(schema, "$ref");
export const isRequestBody = (requestBody?: RequestBody | Reference): requestBody is RequestBody =>
  !has(requestBody, "$ref");
