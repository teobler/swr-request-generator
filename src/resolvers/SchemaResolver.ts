import { get, indexOf, map, reduce } from "lodash";
import { Schema } from "@openapi-integration/openapi-schema";
import { isArray } from "../utils/specifications";
import { addPrefixForInterface, toCapitalCase } from "../utils/formatters";
import { ISchemaResolverInputs, TDictionary } from "../types";
import { ENUM_SUFFIX } from "../constants";

export class SchemaResolver {
  private schemaType: TDictionary<any> | string = {};

  static of(inputs: ISchemaResolverInputs) {
    return new SchemaResolver(inputs);
  }

  constructor(private inputs: ISchemaResolverInputs) {}

  getSchemaType = () => this.schemaType;

  resolve = (type?: string) => {
    const { schema = {}, results, parentKey, key } = this.inputs;
    const advancedType = this.resolveRef(schema.$ref, type || schema.type);
    if (schema.$ref) {
      this.schemaType = advancedType;
      return this;
    }

    if (schema.items) {
      this.schemaType = this.resolveItems(schema.items, schema.type, key, parentKey);
      return this;
    }

    if (schema.enum) {
      const enumKey = this.getEnumName(key!, parentKey);
      // Implicit operation!: Assign enum array definition to results
      results[enumKey] = schema.enum;

      this.schemaType = enumKey;
      return this;
    }

    if (schema.type === "object") {
      if (schema.properties) {
        this.schemaType = this.resolveProperties(schema.properties, schema.required, parentKey);
        return this;
      }

      if (schema.title) {
        this.schemaType = schema.type;
        return this;
      }

      this.schemaType = "{[key:string]:any}";
      return this;
    }

    if (schema.type === "string" && schema.format === "binary") {
      this.schemaType = "FormData";
      return this;
    }

    this.schemaType = this.getBasicType(schema.type, advancedType);
    return this;
  };

  getEnumName = (propertyName: string, parentKey: string = "") =>
    `${toCapitalCase(parentKey)}${toCapitalCase(propertyName)}${ENUM_SUFFIX}`;

  resolveRef = ($ref?: string, type?: string): string => {
    if (!$ref) {
      return "";
    }

    const refType = addPrefixForInterface(toCapitalCase(this.pickTypeByRef($ref)));
    return type === "array" ? `${refType}[]` : refType;
  };

  getBasicType = (basicType: string = "", advancedType?: string): string => {
    switch (basicType) {
      case "integer":
        return "number";
      case "array":
        return this.getTypeForArray(advancedType);
      case "":
        return advancedType || "";
      default:
        return basicType;
    }
  };

  getTypeForArray = (advancedType?: string) => (advancedType ? `${advancedType}[]` : "Array<any>");

  pickTypeByRef = (str?: string) => {
    if (!str) {
      return;
    }
    const list = str.split("/");
    return list[list.length - 1];
  };

  resolveItems = (items?: Schema | Schema[], type?: string, key?: string, parentKey?: string): any => {
    if (!items) {
      return {};
    }

    const child = get(items, "items");

    if (type === "array") {
      if (child) {
        return `${this.resolveItems(child, (items as any).type, key, parentKey)}[]`;
      }

      if (!get(items, "$ref")) {
        return `${get(items, "type")}[]`;
      }
    }

    if (isArray(items)) {
      return map(items, (item) =>
        SchemaResolver.of({ results: this.inputs.results, schema: item as Schema, key, parentKey })
          .resolve()
          .getSchemaType(),
      );
    }

    return SchemaResolver.of({ results: this.inputs.results, schema: items as Schema, key, parentKey })
      .resolve(type)
      .getSchemaType();
  };

  resolveProperties = (
    properties: { [propertyName: string]: Schema } = {},
    required: string[] = [],
    parentKey?: string,
  ): TDictionary<any> =>
    reduce(
      properties,
      (o, v, k) => ({
        ...o,
        [`${k}${indexOf(required, k) > -1 ? "" : "?"}`]: SchemaResolver.of({
          results: this.inputs.results,
          schema: v as Schema,
          key: k,
          parentKey,
        })
          .resolve()
          .getSchemaType(),
      }),
      {},
    );
}
