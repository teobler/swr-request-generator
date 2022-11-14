import { addPrefixForInterface, arrayToObject, convertJsonToString, toCapitalCase, toTypes } from "../formatters";

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
      expect(arrayToObject(input)).toEqual(result);
    });
  });

  describe("#addPrefixForInterface", () => {
    it.each([
      ["xxx", "Ixxx"],
      ["", "I"],
      [undefined, "I"],
      ["undefined", "Iundefined"],
    ])("should add prefix I for interface", (input, result) => {
      expect(addPrefixForInterface(input)).toEqual(result);
    });
  });

  describe("#toTypes", () => {
    it.each([
      [{}, "request", undefined],
      [{ "a ": "a" }, "request", "{\n" + "        'a': a;\n" + "      }"],
      [{ "a_b?": "a" }, "request", "{\n" + "        'ab'?: a;\n" + "      }"],
      [{ "a_b?": "a" }, "interface", "{\n" + "        'a_b'?: a;\n" + "      }"],
      [{ AddBcd: "a" }, "request", "{\n" + "        'addBcd': a;\n" + "      }"],
      [{ AddBcd: "a" }, "interface", "{\n" + "        'AddBcd': a;\n" + "      }"],
      [{ filename: "a" }, "request", "{\n" + "        'filename': a;\n" + "      }"],
      [{ a: { b: "b" } }, "request", "{\n" + "        'a': {b:b};\n" + "      }"],
      [
        { uploadDocumentRequest: { file: "FormData" } },
        "request",
        "{\n" + "        'uploadDocumentRequest': FormData\n" + "      }",
      ],
    ])("should return type definition for TypeScript code", (definitions, category: any, result) => {
      expect(toTypes(definitions, category)).toBe(result);
    });
  });

  describe("# convertJsonToString", () => {
    it("when inputs is a valid json string, should parse it and return correct json object", () => {
      expect(convertJsonToString("{}")).toEqual({});
      expect(convertJsonToString('["foo","bar",{"foo":"bar"}]')).toEqual(["foo", "bar", { foo: "bar" }]);
    });

    it("when inputs is not a string, should return nothing", () => {
      expect(convertJsonToString(3)).toEqual(undefined);
      expect(convertJsonToString(true)).toEqual(undefined);
      expect(convertJsonToString({})).toEqual(undefined);
      expect(convertJsonToString([])).toEqual(undefined);
    });

    it("when inputs is an invalid json string, should print error message", () => {
      const mockPrint = jest.fn();
      convertJsonToString("{a: 1}", "some error", mockPrint);
      expect(mockPrint).toHaveBeenCalledWith("some error");
    });
  });
});
