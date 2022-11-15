import { compact, Dictionary, forEach, get, includes, isEmpty } from "lodash";
import { SchemaResolver } from "./SchemaResolver";
import { isRequestBody } from "../utils/specifications";
import { generateEnums } from "../utils/generators";
import { addPrefixForInterface, toCapitalCase, toTypes } from "../utils/formatters";
import { ENUM_SUFFIX } from "../constants";
import { ComponentsObject } from "@ts-stack/openapi-spec";

export class DefinitionsResolver {
  resolvedDefinitions: any;

  static of(components?: ComponentsObject) {
    return new DefinitionsResolver(components);
  }

  constructor(private components?: ComponentsObject) {}

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
      return (results[schemaName] = SchemaResolver.of({
        results,
        schema: schema,
        key: schemaName,
        parentKey: schemaName,
      })
        .resolve()
        .getSchemaType());
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
          return `export interface ${addPrefixForInterface(toCapitalCase(key))} {[key:string]:any}`;
        }
        const val = toTypes(this.resolvedDefinitions[key], "interface");
        if (val) {
          return `export interface ${addPrefixForInterface(toCapitalCase(key))} ${val}`;
        }
      });
    return compact(arr);
  };
}
