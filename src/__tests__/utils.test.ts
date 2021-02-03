import {
  addPrefixForInterface,
  arrayToObject,
  generateClientName,
  generateFunctionName,
  generateRequestArguments,
  testJSON,
  toCapitalCase,
} from "../utils";
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

  describe("#get method", () => {
    it("should return axios config only when request argument is empty", () => {
      expect(generateRequestArguments(resolvedPath)).toBe(
        "SWRConfig?: ISWRConfig<IResponse, IResponseError>, axiosConfig?: AxiosRequestConfig",
      );
    });

    it("should return arg and it's corresponding type when request only one argument presents", () => {
      expect(
        removeSpaces(generateRequestArguments({ ...resolvedPath, pathParams: ["id"], TReq: { id: "string" } })),
      ).toBe("{id}:{'id':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig");
    });

    it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
      expect(
        removeSpaces(
          generateRequestArguments({
            ...resolvedPath,
            bodyParams: ["BookController_createBookRequest"],
            TReq: { BookController_createBookRequest: "ICreateBookRequest" },
          }),
        ),
      ).toBe(
        "{bookControllerCreateBookRequest}:{'bookControllerCreateBookRequest':ICreateBookRequest;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig",
      );
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
      ).toBe(
        "{id,name}:{'id':string;'name':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig",
      );
    });

    it("should receive last param as axios config", () => {
      expect(
        removeSpaces(
          generateRequestArguments({
            ...resolvedPath,
            pathParams: ["id"],
            queryParams: ["name"],
            TReq: { id: "string", name: "string" },
          }),
        ),
      ).toBe(
        "{id,name}:{'id':string;'name':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig",
      );
    });
  });

  describe("#others methods", () => {
    it("should return axios config when request argument is empty for POST method", () => {
      expect(generateRequestArguments({ ...resolvedPath, method: "post" })).toBe("axiosConfig?: AxiosRequestConfig");
    });

    it("should return arg and it's corresponding type when request only one argument presents", () => {
      expect(
        removeSpaces(
          generateRequestArguments({ ...resolvedPath, method: "put", pathParams: ["id"], TReq: { id: "string" } }),
        ),
      ).toBe("{id}:{'id':string;},axiosConfig?:AxiosRequestConfig");
    });

    it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
      expect(
        removeSpaces(
          generateRequestArguments({
            ...resolvedPath,
            method: "post",
            bodyParams: ["BookController_createBookRequest"],
            TReq: { BookController_createBookRequest: "ICreateBookRequest" },
          }),
        ),
      ).toBe(
        "{bookControllerCreateBookRequest}:{'bookControllerCreateBookRequest':ICreateBookRequest;},axiosConfig?:AxiosRequestConfig",
      );
    });

    it("should return args and it's corresponding types when multiple arguments present", () => {
      expect(
        removeSpaces(
          generateRequestArguments({
            ...resolvedPath,
            method: "delete",
            pathParams: ["id"],
            queryParams: ["name"],
            TReq: { id: "string", name: "string" },
          }),
        ),
      ).toBe("{id,name}:{'id':string;'name':string;},axiosConfig?:AxiosRequestConfig");
    });

    it("should receive last param as axios config", () => {
      expect(
        removeSpaces(
          generateRequestArguments({
            ...resolvedPath,
            method: "post",
            pathParams: ["id"],
            queryParams: ["name"],
            TReq: { id: "string", name: "string" },
          }),
        ),
      ).toBe("{id,name}:{'id':string;'name':string;},axiosConfig?:AxiosRequestConfig");
    });
  });

  const resolvedPath = {
    TReq: undefined,
    pathParams: [""],
    queryParams: [""],
    bodyParams: [""],
    formDataParams: [""],
    method: "get",
    TResp: "IResponse",
  } as IResolvedPath;
});

describe("#generateFunctionName", () => {
  it("should return expected method name for get request", () => {
    const operationId = "PersonController_findPersonById";
    expect(generateFunctionName("get", operationId)).toBe("usePersonControllerFindPersonByIdRequest");
  });

  it("should return expected method name for other requests", () => {
    const operationId = "PersonController_findPersonById";
    expect(generateFunctionName("post", operationId)).toBe("personControllerFindPersonByIdRequest");
    expect(generateFunctionName("put", operationId)).toBe("personControllerFindPersonByIdRequest");
    expect(generateFunctionName("delete", operationId)).toBe("personControllerFindPersonByIdRequest");
  });
});

describe("#generateClientName", () => {
  it("should return createRequestHook client given request method is get", () => {
    expect(generateClientName("get", "IResponse")).toBe("useRequest<IResponse, IResponseError>");
  });

  it("should return normal client given request method is others", () => {
    expect(generateClientName("post", "IResponse")).toBe("client.request<IResponse, AxiosResponse<IResponse>>");
    expect(generateClientName("put", "IResponse")).toBe("client.request<IResponse, AxiosResponse<IResponse>>");
    expect(generateClientName("delete", "IResponse")).toBe("client.request<IResponse, AxiosResponse<IResponse>>");
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
