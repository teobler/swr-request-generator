import { compact, forEach, get, includes, isEmpty } from "lodash";
import { SchemaResolver } from "./SchemaResolver";
import { isRequestBody } from "../utils/specifications";
import { generateEnums } from "../utils/generators";
import { toCapitalCase, toTypes } from "../utils/formatters";
import { ENUM_SUFFIX } from "../constants";
import { ComponentsObject } from "@ts-stack/openapi-spec";

export interface RequestBodyOrResponseBody {
  [key: string]: string;
}

// RequestBodyOrResponseBody for normal interface
// [string | number] for enums
// string for interface name
// empty string for no response
export type ResolvedSchema = RequestBodyOrResponseBody | [string | number] | string;

export type ResolvedDefinitions = { [requestOrResponseOrEnum: string]: ResolvedSchema };

export class DefinitionsResolver {
  resolvedDefinitions: ResolvedDefinitions = {};

  static of(components?: ComponentsObject) {
    return new DefinitionsResolver(components);
  }

  constructor(private components?: ComponentsObject) {}

  scanDefinitions = () => {
    const results: ResolvedDefinitions = {};
    const requestBodies = get(this.components, "requestBodies");
    const schemas = get(this.components, "schemas");

    forEach(requestBodies, (requestBody, requestBodyName: string) => {
      if (isRequestBody(requestBody)) {
        return (results[requestBodyName] = SchemaResolver.of({
          results,
          schema: get(requestBody, "content.application/json.schema"),
          key: requestBodyName,
          parentKey: requestBodyName,
        })
          .resolve()
          .getSchemaType());
      }

      return (results[requestBodyName] = SchemaResolver.of({
        results,
        schema: requestBody,
        key: requestBodyName,
        parentKey: requestBodyName,
      })
        .resolve()
        .getSchemaType());
    });

    forEach(schemas, (schema, schemaName) => {
      const result = SchemaResolver.of({
        results,
        schema: schema,
        key: schemaName,
        // enum is a top level data type, will not have children, parentKey should be empty
        parentKey: schema.enum ? "" : schemaName,
      })
        .resolve()
        .getSchemaType();

      if (!schema.enum) results[schemaName] = result;
      return result;
    });

    this.resolvedDefinitions = results;
    return this;
  };

  toDeclarations = (): string[] => {
    const arr = Object.keys(this.resolvedDefinitions)
      .sort()
      .map((key) => {
        if (includes(key, ENUM_SUFFIX)) {
          return generateEnums(this.resolvedDefinitions, key);
        }

        if (this.resolvedDefinitions[key] === "object" || isEmpty(this.resolvedDefinitions[key])) {
          return `export interface ${toCapitalCase(key)} {[key:string]:any}`;
        }
        const val = toTypes(this.resolvedDefinitions[key], "interface");
        if (val) {
          return `export interface ${toCapitalCase(key)} ${val}`;
        }
      });
    return compact(arr);
  };
}
