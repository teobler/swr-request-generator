import { SchemaResolver } from "../SchemaResolver";

describe("# SchemaResolver", () => {
  it("should return any object definition given schema type is object without title and properties", () => {
    expect(
      SchemaResolver.of({
        results: {},
        schema: { type: "object" },
        key: "key",
        parentKey: "parentKey",
      }).resolve(),
    ).toEqual("{[key:string]:any}");
  });

  it("should return object given schema type is object without properties", () => {
    expect(
      SchemaResolver.of({
        results: {},
        schema: { type: "object", title: "URLStreamHandler" },
        key: "URLStreamHandler",
        parentKey: "URLStreamHandler",
      }).resolve(),
    ).toEqual("object");
  });

  it("should return object definition given schema type is object with properties", () => {
    expect(
      SchemaResolver.of({
        results: {},
        schema: {
          type: "object",
          properties: {
            authorName: { type: "string", example: "Tony" },
            createdDate: { type: "integer", format: "int64", example: 19920010 },
            fileName: { type: "string", example: "aaa" },
            id: { type: "string", example: "001" },
            mimeType: { type: "string", example: ".png" },
            path: { type: "string", example: "/home" },
            attachment: { $ref: "#/components/schemas/ScheduleVO" },
          },
          title: "BookDetailVo",
        },
        key: "BookDetailVo",
        parentKey: "BookDetailVo",
      }).resolve(),
    ).toEqual({
      "attachment?": "IScheduleVo",
      "authorName?": "string",
      "createdDate?": "number",
      "fileName?": "string",
      "id?": "string",
      "mimeType?": "string",
      "path?": "string",
    });
  });

  it.each([
    [{ type: "string" }, "userInfo", "string"],
    [{ type: "integer", format: "int32" }, "port", "number"],
    [{ type: "integer", format: "int64", example: 19920010 }, "createdDate", "number"],
  ])("should return basic type when schema type is basic type", (schema: any, key: string, result: string) => {
    expect(
      SchemaResolver.of({
        results: {},
        schema,
        key,
        parentKey: key,
      }).resolve(),
    ).toBe(result);
  });

  it("should return interface name when schema has $ref", () => {
    expect(
      SchemaResolver.of({
        results: {},
        schema: { $ref: "#/components/schemas/BookDetailVo" },
        key: "attachment",
        parentKey: "attachment",
      }).resolve(),
    ).toBe("IBookDetailVo");
  });

  it("should return FormData when schema type is string and format is binary", () => {
    expect(
      SchemaResolver.of({
        results: {},
        schema: { type: "string", format: "binary" },
        key: "file",
        parentKey: "file",
      }).resolve(),
    ).toBe("FormData");
  });

  it.each([
    [{ $ref: "#/components/schemas/BookDetailVo", type: "array" }, "attachment", "IBookDetailVo[]"],
    [{ $ref: "#/components/schemas/URLStreamHandler" }, "deserializedFields", "IUrlStreamHandler"],
    [{ type: "array", items: { $ref: "#/components/schemas/ErrorInfo" } }, "errors", "IErrorInfo[]"],
    [{ $ref: "#/components/schemas/BookDetailVo" }, undefined, "IBookDetailVo"],
  ])("should return interface name when schema has $ref", (schema: any, key: string | undefined, result: string) => {
    expect(
      SchemaResolver.of({
        results: {},
        schema,
        key,
        parentKey: key,
      }).resolve(),
    ).toBe(result);
  });

  it.each([
    [{ type: "string", enum: ["AAA", "BBB"] }, "from", "parentFrom", "keyof typeof ParentFromFrom#EnumTypeSuffix"],
    [{ type: "number", enum: [1, 2, 3] }, "to", "parentTo", "ParentToTo#EnumTypeSuffix"],
  ])(
    "should return enum with suffix when schema has enum property",
    (schema: any, key: string, parentKey: string, result: string) => {
      expect(
        SchemaResolver.of({
          results: {},
          schema,
          key,
          parentKey,
        }).resolve(),
      ).toBe(result);
    },
  );
});
