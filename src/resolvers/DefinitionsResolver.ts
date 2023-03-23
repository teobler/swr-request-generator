import { isEmpty } from "moderndash";
import { SchemaResolver } from "./SchemaResolver.js";
import { isRequestBody } from "../utils/specifications.js";
import { generateEnums } from "../utils/generators.js";
import { toCapitalCase, toTypes } from "../utils/formatters.js";
import { ENUM_SUFFIX } from "../constants.js";
import { ComponentsObject } from "@ts-stack/openapi-spec";
import { get } from "../utils/lodash.js";
import { RequestBodyObject } from "@ts-stack/openapi-spec/src/origin/request-body-object.js";
import { ReferenceObject } from "@ts-stack/openapi-spec/src/origin/reference-object.js";
import { SchemaObject } from "@ts-stack/openapi-spec/dist/origin/schema-object.js";

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
    const requestBodies: { [requestBodyName: string]: RequestBodyObject | ReferenceObject } = get(
      this.components,
      "requestBodies",
      {},
    );
    const schemas: { [schemaName: string]: SchemaObject } = get(this.components, "schemas", {});

    Object.entries(requestBodies).forEach(([requestBodyName, requestBody]) => {
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

    Object.entries(schemas).forEach(([schemaName, schema]) => {
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
    return Object.keys(this.resolvedDefinitions)
      .sort()
      .map((key) => {
        if (key.includes(ENUM_SUFFIX)) {
          return generateEnums(this.resolvedDefinitions, key);
        }

        if (this.resolvedDefinitions[key] === "object" || isEmpty(this.resolvedDefinitions[key])) {
          return `export interface ${toCapitalCase(key)} {[key:string]:any}`;
        }
        const val = toTypes(this.resolvedDefinitions[key]);
        if (val) {
          return `export interface ${toCapitalCase(key)} ${val}`;
        }
      })
      .filter((x) => !!x) as string[];
  };
}
