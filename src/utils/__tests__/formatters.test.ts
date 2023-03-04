import {
  arrayToObject,
  convertJsonStringToJson,
  convertResponseTypeObject,
  toCapitalCase,
  toTypes,
} from "../formatters";

describe("# formatters", () => {
  describe("#toCapitalCase", () => {
    it.each([
      [undefined, ""],
      ["helloWorld", "HelloWorld"],
    ])("should transform word to capital case but return empty string for undefined input", (input, result) => {
      expect(toCapitalCase(input)).toEqual(result);
    });
  });

  describe("#arrayToObject", () => {
    it.each([
      [[], {}],
      [["a"], { a: "a" }],
      [["a", "b"], { a: "a", b: "b" }],
    ])("should convert array to object", (input, result) => {
      expect(arrayToObject(input as any)).toEqual(result);
    });
  });

  describe("#toTypes", () => {
    it.each([
      [{}, undefined],
      [{ "a ": "a" }, "{\n" + "        'a': a;\n" + "      }"],
      [{ "a_b?": "a" }, "{\n" + "        'a_b'?: a;\n" + "      }"],
      [{ AddBcd: "a" }, "{\n" + "        'AddBcd': a;\n" + "      }"],
      [{ filename: "a" }, "{\n" + "        'filename': a;\n" + "      }"],
      [{ a: { b: "b" } }, "{\n" + "        'a': {b:b};\n" + "      }"],
      [
        { uploadDocumentRequest: { file: "FormData" } },
        "{\n" + "        'uploadDocumentRequest': FormData\n" + "      }",
      ],
    ])("should return type definition for TypeScript code", (definitions: any, result) => {
      expect(toTypes(definitions)).toBe(result);
    });
  });

  describe("# convertJsonStringToJson", () => {
    it("when inputs is a valid json string, should parse it and return correct json object", () => {
      expect(convertJsonStringToJson("{}")).toEqual({});
      expect(convertJsonStringToJson('["foo","bar",{"foo":"bar"}]')).toEqual(["foo", "bar", { foo: "bar" }]);
    });

    it("when inputs is not a string, should return nothing", () => {
      expect(convertJsonStringToJson(3)).toEqual(undefined);
      expect(convertJsonStringToJson(true)).toEqual(undefined);
      expect(convertJsonStringToJson({})).toEqual(undefined);
      expect(convertJsonStringToJson([])).toEqual(undefined);
    });

    it("when inputs is an invalid json string, should print error message", () => {
      const mockPrint = vitest.fn();
      convertJsonStringToJson("{a: 1}", "some error", mockPrint);
      expect(mockPrint).toHaveBeenCalledWith("some error");
    });
  });

  describe("# convertResponseTypeObject", () => {
    it.each([
      ["", undefined],
      [undefined, undefined],
      [{ "data?": "SomeOtherSchema[]", key: "value" }, "{data?:SomeOtherSchema[],key:value}"],
    ])("should convert resolved responseType to ts format string", (responseType, result) => {
      expect(convertResponseTypeObject(responseType)).toEqual(result);
    });
  });
});
