import { get, indexOf, map, reduce, some } from "lodash";
import { Schema } from "@openapi-integration/openapi-schema";
import { isArray, isNumber } from "../utils/specifications";
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
      this.schemaType = this.resolveItems(schema.items, schema.type);
      return this;
    }

    if (schema.enum) {
      const enumKey = this.getEnumName(key!, parentKey);
      results[enumKey] = schema.enum;
      const hasNumber = some(schema.enum, (v) => isNumber(v));

      if (hasNumber) {
        this.schemaType = enumKey;
        return this;
      }

      this.schemaType = `keyof typeof ${enumKey}`;
      return this;
    }

    if (schema.type === "object") {
      if (schema.properties) {
        this.schemaType = this.resolveProperties(schema.properties, schema.required);
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

  resolveItems = (items?: Schema | Schema[], type?: string): any => {
    if (!items) {
      return {};
    }

    const child = get(items, "items");

    if (type === "array") {
      if (child) {
        return `${this.resolveItems(child, (items as any).type)}[]`;
      }

      if (!get(items, "$ref")) {
        return `${get(items, "type")}[]`;
      }
    }

    if (isArray(items)) {
      return map(items, (item) =>
        SchemaResolver.of({ results: {}, schema: item as Schema })
          .resolve()
          .getSchemaType(),
      );
    }

    return SchemaResolver.of({ results: {}, schema: items as Schema })
      .resolve(type)
      .getSchemaType();
  };

  resolveProperties = (
    properties: { [propertyName: string]: Schema } = {},
    required: string[] = [],
  ): TDictionary<any> =>
    reduce(
      properties,
      (o, v, k) => ({
        ...o,
        [`${k}${indexOf(required, k) > -1 ? "" : "?"}`]: SchemaResolver.of({
          results: {},
          schema: v as Schema,
          key: k,
        })
          .resolve()
          .getSchemaType(),
      }),
      {},
    );
}
