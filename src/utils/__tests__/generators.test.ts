import { IResolvedPath } from "../../types";
import {
  generateClientName,
  generateEnums,
  generateFunctionName,
  generateHeader,
  generateRequestArguments,
  generateResponseType,
} from "../generators";

describe("# generators", () => {
  describe("## generateRequestArguments", () => {
    const removeSpaces = (str: string) => str.replace(/[\n \r]/g, "");
    const resolvedPath = {
      url: "url",
      TReq: undefined,
      pathParams: [""],
      queryParams: [""],
      cookieParams: [""],
      method: "get",
      TResp: "IResponse",
      TReqQuery: {},
      TReqPath: {},
      TReqCookie: {},
      TReqBody: {},
      THeader: {},
    } as IResolvedPath;

    describe("#get method", () => {
      it("should return axios config only when request argument is empty", () => {
        expect(generateRequestArguments(resolvedPath)).toBe(
          "SWRConfig?: ISWRConfig<IResponse, IResponseError>, axiosConfig?: AxiosRequestConfig",
        );
      });

      it("should return arg and it's corresponding type when request only one argument presents", () => {
        expect(
          removeSpaces(generateRequestArguments({ ...resolvedPath, pathParams: ["id"], TReqQuery: { id: "string" } })),
        ).toBe("{id}:{'id':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig");
      });

      it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              TReqQuery: { BookController_createBookRequest: "ICreateBookRequest" },
            }),
          ),
        ).toBe("SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig");
      });

      it("should return args and it's corresponding types when multiple arguments present", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
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
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id,name}:{'id':string;'name':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should include header params", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
              THeader: { "Custom-Header": "string", Custom: "number" },
            }),
          ),
        ).toBe(
          "{id,name,customHeader,custom}:{'custom':number;'customHeader':string;'id':string;'name':string;},SWRConfig?:ISWRConfig<IResponse,IResponseError>,axiosConfig?:AxiosRequestConfig",
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
            generateRequestArguments({
              ...resolvedPath,
              method: "put",
              pathParams: ["id"],
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe("{id}:{'id':string;},axiosConfig?:AxiosRequestConfig");
      });

      it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              method: "post",
              TReqBody: { BookController_createBookRequest: "ICreateBookRequest" },
            }),
          ),
        ).toBe("axiosConfig?:AxiosRequestConfig");
      });

      it("should return args and it's corresponding types when multiple arguments present", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              method: "delete",
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe("{id}:{'id':string;},axiosConfig?:AxiosRequestConfig");
      });

      it("should receive last param as axios config", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              method: "post",
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe("{id}:{'id':string;},axiosConfig?:AxiosRequestConfig");
      });

      it("should include header params", () => {
        expect(
          removeSpaces(
            generateRequestArguments({
              ...resolvedPath,
              method: "post",
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
              THeader: { "Custom-Header": "string", Custom: "number" },
            }),
          ),
        ).toBe(
          "{id,customHeader,custom}:{'custom':number;'customHeader':string;'id':string;},axiosConfig?:AxiosRequestConfig",
        );
      });
    });
  });

  describe("## generateFunctionName", () => {
    it.each([
      ["PersonController_findPersonById", "usePersonControllerFindPersonByIdRequest"],
      ["PersonController_findPersonById", "usePersonControllerFindPersonByIdRequest"],
      ["PersonController_findPersonById", "usePersonControllerFindPersonByIdRequest"],
      ["PersonController_findPersonById", "usePersonControllerFindPersonByIdRequest"],
    ])("should return expected method name different request method", (operationId, result) => {
      expect(generateFunctionName(operationId)).toBe(result);
    });
  });

  describe("## generateClientName", () => {
    it.each([
      ["get", "IResponse", "useGetRequest<IResponse, IResponseError>"],
      ["post", "IResponse", "useMutationRequest<undefined, AxiosResponse<IResponse>, IResponseError>"],
      ["put", "IResponse", "useMutationRequest<undefined, AxiosResponse<IResponse>, IResponseError>"],
      ["delete", "IResponse", "useMutationRequest<undefined, AxiosResponse<IResponse>, IResponseError>"],
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

  describe("## generateHeader", () => {
    it("should return headers config only from swagger", () => {
      expect(
        generateHeader(false, {}, undefined, {
          Accept: "string",
          "Custom-Header": "string",
        }),
      ).toBe('headers: { "Accept": accept, "Custom-Header": customHeader, },');
    });

    it.each([
      [true, {}, undefined, undefined, 'headers: { "Content-Type": "application/json"},'],
      [
        true,
        { downloadUsingGET: "application/pdf" },
        "downloadUsingGET",
        undefined,
        'headers: { "Content-Type": "application/pdf"},',
      ],
      [
        true,
        { downloadUsingGET: "application/pdf" },
        "uploadUsingPOST",
        undefined,
        'headers: { "Content-Type": "application/json"},',
      ],
    ])("should return content type only when has body params", (hasBody, contentTypes, operationId, header, result) => {
      expect(generateHeader(hasBody, contentTypes, operationId, header)).toBe(result);
    });

    it("should return content type and header params from swagger", () => {
      expect(
        generateHeader(true, { downloadUsingGET: "application/pdf" }, "downloadUsingGET", {
          Accept: "string",
          "Custom-Header": "string",
        }),
      ).toBe('headers: { "Accept": accept, "Custom-Header": customHeader, "Content-Type": "application/pdf"},');
    });
  });

  describe("## generateResponseType", () => {
    it("should return responseType is blob given headers config contains accept header", () => {
      expect(generateResponseType('headers: { "Accept": accept }')).toBe('responseType: "blob",');
    });
  });
});
