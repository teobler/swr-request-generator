import { compact, Dictionary, forEach, get, includes } from "lodash";
import { SchemaResolver } from "./SchemaResolver";
import { Components, Schema } from "@openapi-integration/openapi-schema";
import { isRequestBody } from "./specifications";
import { generateEnums } from "./generators";
import { addPrefixForInterface, toCapitalCase, toTypes } from "./formatters";
import { ENUM_SUFFIX } from "./constants";

// TODO: 1. Handle required params.
// TODO: handle `in: fromData`
// TODO: handle `in schema`
// TODO: 确认不同 endpoint 是否都会生成 openAPI

export class DefinitionsResolver {
  resolvedDefinitions: any;

  static of(components?: Components) {
    return new DefinitionsResolver(components);
  }

  constructor(private components?: Components) {}

  scanDefinitions = () => {
    const results: Dictionary<any> = {};
    const requestBodies = get(this.components, "requestBodies");
    const schemas = get(this.components, "schemas");

    forEach(requestBodies, (requestBody, requestBodyName) => {
      if (isRequestBody(requestBody)) {
        return (results[requestBodyName] = SchemaResolver.of({
          results,
          schema: get(requestBody, "content.application/json.schema"),
          key: requestBodyName,
          parentKey: requestBodyName,
        }).resolve());
      }

      return (results[requestBodyName] = SchemaResolver.of({
        results,
        schema: requestBody as Schema,
        key: requestBodyName,
        parentKey: requestBodyName,
      }).resolve());
    });

    forEach(schemas, (schema, schemaName) => {
      return (results[schemaName] = SchemaResolver.of({
        results,
        schema: schema,
        key: schemaName,
        parentKey: schemaName,
      }).resolve());
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

        if (this.resolvedDefinitions[key] === "object") {
          return `export interface ${addPrefixForInterface(toCapitalCase(key))} {[key:string]:any}`;
        }
        const val = toTypes(this.resolvedDefinitions[key]);
        if (val) {
          return `export interface ${addPrefixForInterface(toCapitalCase(key))} ${val}`;
        }
      });
    return compact(arr);
  };
}
