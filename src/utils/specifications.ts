import { ReferenceObject, RequestBodyObject, SchemaObject } from "@ts-stack/openapi-spec";
import { has } from "./lodash.js";

export const isArray = (data: unknown): data is Array<unknown> => Array.isArray(data);
export const isObject = (data: unknown): data is object => Object.prototype.toString.call(data) === "[object Object]";
export const isNumber = (data: unknown): data is number => typeof data === "number";
export const isSchema = (schema?: SchemaObject | ReferenceObject): schema is SchemaObject => !has(schema, "$ref");
export const isRequestBody = (requestBody?: RequestBodyObject | ReferenceObject): requestBody is RequestBodyObject =>
  !has(requestBody, "$ref");
export const isValidVariableName = (variableName: string) => /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(variableName);
