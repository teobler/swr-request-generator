import { ResolvedPath } from "../../types";
import {
  generateEnums,
  generateFunctionName,
  generateGetClientName,
  generateGetRequestArguments,
  generateHeader,
  generateMutationClientName,
  generateMutationRequestArguments,
  generateResponseType,
} from "../generators";
import { ResolvedDefinitions } from "src/resolvers/DefinitionsResolver";

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
      TResp: "Response",
      TReqQuery: {},
      TReqPath: {},
      TReqCookie: {},
      TReqBody: {},
      THeader: {},
    } as ResolvedPath;

    describe("#get method", () => {
      it("should return axios config only when request argument is empty", () => {
        expect(generateGetRequestArguments(resolvedPath)).toBe(
          "SWRConfig?: SWRConfig<Response, ResponseError>, axiosConfig?: AxiosRequestConfig",
        );
      });

      it("should return arg and it's corresponding type when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateGetRequestArguments({ ...resolvedPath, pathParams: ["id"], TReqQuery: { id: "string" } }),
          ),
        ).toBe("{id}:{'id':string;},SWRConfig?:SWRConfig<Response,ResponseError>,axiosConfig?:AxiosRequestConfig");
      });

      it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateGetRequestArguments({
              ...resolvedPath,
              TReqQuery: { BookController_createBookRequest: "ICreateBookRequest" },
            }),
          ),
        ).toBe("SWRConfig?:SWRConfig<Response,ResponseError>,axiosConfig?:AxiosRequestConfig");
      });

      it("should return args and it's corresponding types when multiple arguments present", () => {
        expect(
          removeSpaces(
            generateGetRequestArguments({
              ...resolvedPath,
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id,name}:{'id':string;'name':string;},SWRConfig?:SWRConfig<Response,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should receive last param as axios config", () => {
        expect(
          removeSpaces(
            generateGetRequestArguments({
              ...resolvedPath,
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id,name}:{'id':string;'name':string;},SWRConfig?:SWRConfig<Response,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should include header params", () => {
        expect(
          removeSpaces(
            generateGetRequestArguments({
              ...resolvedPath,
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
              THeader: { "Custom-Header": "string", Custom: "number" },
            }),
          ),
        ).toBe(
          "{id,name,customHeader,Custom}:{'Custom':number;'customHeader':string;'id':string;'name':string;},SWRConfig?:SWRConfig<Response,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });
    });

    describe("#others methods", () => {
      it("should return axios config when request argument is empty for POST method", () => {
        expect(generateMutationRequestArguments({ ...resolvedPath, method: "post" })).toBe(
          "mutationConfig?: SWRMutationConfig<undefined, AxiosResponse<Response>, ResponseError>, axiosConfig?: AxiosRequestConfig",
        );
      });

      it("should return arg and it's corresponding type when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateMutationRequestArguments({
              ...resolvedPath,
              method: "put",
              pathParams: ["id"],
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id}:{'id':string;},mutationConfig?:SWRMutationConfig<undefined,AxiosResponse<Response>,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should return arg and it's corresponding type with camelCase when request only one argument presents", () => {
        expect(
          removeSpaces(
            generateMutationRequestArguments({
              ...resolvedPath,
              method: "post",
              TReqBody: { BookController_createBookRequest: "ICreateBookRequest" },
            }),
          ),
        ).toBe(
          "mutationConfig?:SWRMutationConfig<undefined,AxiosResponse<Response>,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should return args and it's corresponding types when multiple arguments present", () => {
        expect(
          removeSpaces(
            generateMutationRequestArguments({
              ...resolvedPath,
              method: "delete",
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id}:{'id':string;},mutationConfig?:SWRMutationConfig<undefined,AxiosResponse<Response>,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should receive last param as axios config", () => {
        expect(
          removeSpaces(
            generateMutationRequestArguments({
              ...resolvedPath,
              method: "post",
              pathParams: ["id"],
              queryParams: ["name"],
              TReqQuery: { name: "string" },
              TReqPath: { id: "string" },
            }),
          ),
        ).toBe(
          "{id}:{'id':string;},mutationConfig?:SWRMutationConfig<undefined,AxiosResponse<Response>,ResponseError>,axiosConfig?:AxiosRequestConfig",
        );
      });

      it("should include header params", () => {
        expect(
          removeSpaces(
            generateMutationRequestArguments({
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
          "{id,customHeader,Custom}:{'Custom':number;'customHeader':string;'id':string;},mutationConfig?:SWRMutationConfig<undefined,AxiosResponse<Response>,ResponseError>,axiosConfig?:AxiosRequestConfig",
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
      [
        "Response",
        "IUpdateBookByIdUsingPutRequest",
        "useMutationRequest<IUpdateBookByIdUsingPutRequest, AxiosResponse<Response>, ResponseError>",
      ],
      ["Response", "undefined", "useMutationRequest<undefined, AxiosResponse<Response>, ResponseError>"],
      ["Response", undefined, "useMutationRequest<undefined, AxiosResponse<Response>, ResponseError>"],
    ])("should return different client given different request method", (responseType, responseBodyType, result) => {
      expect(generateMutationClientName(responseType, responseBodyType)).toBe(result);
    });
  });

  describe("## generateGetClientName", () => {
    it("should return different client given different request method", () => {
      expect(generateGetClientName("Response")).toBe("useGetRequest<Response, ResponseError>");
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
      expect(generateEnums(definitions as ResolvedDefinitions, key)).toBe(result);
    });
  });

  describe("## generateHeader", () => {
    it("should return headers config only from swagger", () => {
      expect(
        generateHeader(false, {}, undefined, {
          Accept: "string",
          "Custom-Header": "string",
        }),
      ).toBe('headers: { "Accept": Accept, "Custom-Header": customHeader, },');
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
      ).toBe('headers: { "Accept": Accept, "Custom-Header": customHeader, "Content-Type": "application/pdf"},');
    });
  });

  describe("## generateResponseType", () => {
    it("should return responseType is blob given headers config contains accept header", () => {
      expect(generateResponseType('headers: { "Accept": accept }')).toBe('responseType: "blob",');
    });
  });
});
