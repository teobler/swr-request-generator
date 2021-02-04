import { IResolvedPath } from "../types";
import { generateClientName, generateEnums, generateFunctionName, generateRequestArguments } from "../generators";

describe("# generators", () => {
  describe("## generateRequestArguments", () => {
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

  describe("## generateFunctionName", () => {
    it.each([
      ["get", "PersonController_findPersonById", "usePersonControllerFindPersonByIdRequest"],
      ["post", "PersonController_findPersonById", "personControllerFindPersonByIdRequest"],
      ["put", "PersonController_findPersonById", "personControllerFindPersonByIdRequest"],
      ["delete", "PersonController_findPersonById", "personControllerFindPersonByIdRequest"],
    ])("should return expected method name different request method", (method, operationId, result) => {
      expect(generateFunctionName(method, operationId)).toBe(result);
    });
  });

  describe("## generateClientName", () => {
    it.each([
      ["get", "IResponse", "useRequest<IResponse, IResponseError>"],
      ["post", "IResponse", "client.request<IResponse, AxiosResponse<IResponse>>"],
      ["put", "IResponse", "client.request<IResponse, AxiosResponse<IResponse>>"],
      ["delete", "IResponse", "client.request<IResponse, AxiosResponse<IResponse>>"],
    ])("should return different client given different request method", (method, responseType, result) => {
      expect(generateClientName(method, responseType)).toBe(result);
    });
  });

  describe("## generateEnums", () => {
    it.each([
      [
        { "FromFrom#EnumTypeSuffix": ["AAA", "BBB"] },
        "FromFrom#EnumTypeSuffix",
        'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
      ],
      [{ "FromFrom#EnumTypeSuffix": [1, 2] }, "FromFrom#EnumTypeSuffix", "export type FromFrom = 1|2"],
      [{}, "", ""],
    ])("should generate enums from definitions", (definitions, key, result) => {
      expect(generateEnums(definitions, key)).toBe(result);
    });
  });
});
