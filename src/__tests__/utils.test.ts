import { generateFunctionName, generateRequestArguments, testJSON, toCapitalCase } from "../utils";
import { IResolvedPath } from "../types";

describe("#toCapitalCase", () => {
  it("when word is undefined, should return empty string", () => {
    expect(toCapitalCase()).toEqual("");
  });

  it("should transform word to capital case", () => {
    expect(toCapitalCase("helloWorld")).toEqual("HelloWorld");
  });
});

describe("#testJSON", () => {
  it("when inputs is a valid json string, should parse it and return correct json object", () => {
    expect(testJSON("{}")).toEqual({});
    expect(testJSON('["foo","bar",{"foo":"bar"}]')).toEqual(["foo", "bar", { foo: "bar" }]);
  });
  it("when inputs is not a string, should return nothing", () => {
    expect(testJSON(3)).toEqual(undefined);
    expect(testJSON(true)).toEqual(undefined);
    expect(testJSON({})).toEqual(undefined);
    expect(testJSON([])).toEqual(undefined);
  });
  it("when inputs is an invalid json string, should print error message", () => {
    const mockPrint = jest.fn();
    testJSON("{a: 1}", "some error", mockPrint);
    expect(mockPrint).toHaveBeenCalledWith("some error");
  });
});

describe("#generateRequestArguments", () => {
  const removeSpaces = (str: string) => str.replace(/[\n \r]/g, "");

  it("should return empty string when request argument is empty", () => {
    expect(generateRequestArguments(resolvedPath)).toBe("");
  });

  it("should return arg and it's corresponding type when request only one argument presents", () => {
    expect(
      removeSpaces(generateRequestArguments({ ...resolvedPath, pathParams: ["id"], TReq: { id: "string" } })),
    ).toBe("{id}:{'id':string;}");
  });

  it("should return args and it's corresponding types when multiple arguments present", () => {
    expect(
      removeSpaces(
        generateRequestArguments({
          ...resolvedPath,
          pathParams: ["id"],
          queryParams: ["name"],
          TReq: { id: "string", name: "string" },
        }),
      ),
    ).toBe("{id,name}:{'id':string;'name':string;}");
  });

  const resolvedPath = {
    TReq: undefined,
    pathParams: [""],
    queryParams: [""],
    bodyParams: [""],
    formDataParams: [""],
  } as IResolvedPath;
});

describe("#generateFunctionName", () => {
  it("should return expected method name", () => {
    const operationId = "PersonController_findPersonById";
    expect(generateFunctionName(operationId)).toBe("createPersonControllerFindPersonByIdRequest");
  });
});
