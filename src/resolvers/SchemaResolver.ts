import { get, indexOf, map, reduce } from "lodash";
import { isArray, isObject } from "../utils/specifications";
import { addPrefixForInterface, toCapitalCase } from "../utils/formatters";
import { ISchemaResolverInputs, SchemaObjectWithNullable, TDictionary } from "../types";
import { ENUM_SUFFIX } from "../constants";
import { SchemaObject, SchemaObjectType } from "@ts-stack/openapi-spec";

export class SchemaResolver {
  private schemaType: TDictionary<any> | string = {};

  static of(inputs: ISchemaResolverInputs) {
    return new SchemaResolver(inputs);
  }

  constructor(private inputs: ISchemaResolverInputs) {}

  getSchemaType = () => this.schemaType;

  resolve = (type?: SchemaObjectType) => {
    const { schema = {}, results, parentKey, key } = this.inputs;
    if (schema.$ref) {
      this.schemaType = this.resolveRef(schema.$ref, type || (schema.type as SchemaObjectType));
      return this;
    }

    if (schema.oneOf || schema.anyOf) {
      this.schemaType = this.resolveOneOfAndAnyOf((schema.oneOf || schema.anyOf) as SchemaObjectWithNullable[]);
      this.schemaType = this.resolveNullable().getSchemaType();
      return this;
    }

    if (schema.allOf) {
      this.schemaType = this.resolveAllOf(schema.allOf as SchemaObjectWithNullable[]);
      this.schemaType = this.resolveNullable().getSchemaType();
      return this;
    }

    if (schema.items) {
      this.schemaType = this.resolveItems(schema.items, schema.type as SchemaObjectType, key, parentKey);
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

    this.schemaType = this.getBasicType(
      schema.type as SchemaObjectType,
      this.resolveRef(schema.$ref, type || (schema.type as SchemaObjectType)),
    );
    return this;
  };

  resolveNullable = () => {
    if (this.inputs.schema?.nullable) {
      this.schemaType = isObject(this.schemaType)
        ? `${JSON.stringify(this.schemaType)} | null`
        : `${this.schemaType} | null`;
    }

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

  resolveOneOfAndAnyOf = (oneOfOrAnyOf: SchemaObjectWithNullable[]) => {
    return oneOfOrAnyOf
      .map((schema) => {
        const schemaType = SchemaResolver.of({ results: {}, schema })
          .resolve(schema.type as SchemaObjectType)
          .resolveNullable()
          .getSchemaType();

        return JSON.stringify(schemaType);
      })
      .join(" | ")
      .replace(ENUM_SUFFIX, "")
      .replace(/"/g, "");
  };

  resolveAllOf = (allOf: SchemaObjectWithNullable[]) => {
    return allOf
      .map((schema) => {
        const schemaType = SchemaResolver.of({ results: {}, schema })
          .resolve(schema.type as SchemaObjectType)
          .resolveNullable()
          .getSchemaType();

        return JSON.stringify(schemaType);
      })
      .join(" & ")
      .replace(ENUM_SUFFIX, "")
      .replace(/"/g, "");
  };

  getBasicType = (basicType?: SchemaObjectType, advancedType?: string): string => {
    switch (basicType) {
      case "integer":
        return "number";
      case "array":
        return this.getTypeForArray(advancedType);
      case undefined:
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

  resolveItems = (
    items?: SchemaObject | SchemaObject[],
    type?: SchemaObjectType,
    key?: string,
    parentKey?: string,
  ): any => {
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
        SchemaResolver.of({ results: this.inputs.results, schema: item, key, parentKey })
          .resolve()
          .resolveNullable()
          .getSchemaType(),
      );
    }

    return SchemaResolver.of({ results: this.inputs.results, schema: items as SchemaObject, key, parentKey })
      .resolve(type)
      .resolveNullable()
      .getSchemaType();
  };

  resolveProperties = (
    properties: {
      [propertyName: string]: SchemaObject;
    } = {},
    required: string[] = [],
    parentKey?: string,
  ): TDictionary<any> =>
    reduce(
      properties,
      (o, v, k) => ({
        ...o,
        [`${k}${indexOf(required, k) > -1 ? "" : "?"}`]: SchemaResolver.of({
          results: this.inputs.results,
          schema: v,
          key: k,
          parentKey,
        })
          .resolve()
          .resolveNullable()
          .getSchemaType(),
      }),
      {},
    );
}
