import { PathResolver } from "../PathResolver";
import openAPI from "./mock-data/openAPI.json";

describe("PathResolver", () => {
  it("should get resolved paths by openAPI schema", () => {
    expect(PathResolver.of((openAPI as any).paths).resolve().resolvedPaths).toEqual(expectedPathResolvedData);
  });

  it("should get correct request creator by resolved paths", () => {
    expect(
      PathResolver.of((openAPI as any).paths)
        .resolve()
        .toRequest(),
    ).toEqual(expectedRequest);
  });

  it("should get correct content type for different operation id", () => {
    expect(PathResolver.of((openAPI as any).paths).resolve().contentType).toEqual(expectedContentType);
  });
});

const expectedPathResolvedData = [
  {
    THeader: {
      Authorities: "string",
      "User-Id": "string",
      "User-Name": "string",
    },
    TReqBody: {
      uploadAttachmentUsingPOSTRequest: {
        attachment: "FormData",
      },
    },
    TReqCookie: {},
    TReqPath: {},
    TReqQuery: {},
    TResp: "IAttachmentBo",
    cookieParams: [],
    method: "post",
    operationId: "uploadAttachmentUsingPOST",
    pathParams: [],
    queryParams: [],
    requestBody: "uploadAttachmentUsingPOSTRequest",
    url: "/",
  },
  {
    THeader: {
      Accept: "string",
    },
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {
      id: "string",
    },
    TReqQuery: {},
    TResp: "IResource",
    cookieParams: [],
    method: "get",
    operationId: "downloadUsingGET",
    pathParams: ["id"],
    queryParams: [],
    url: "/${id}",
  },
  {
    THeader: {
      Authorities: "string",
      "User-Id": "string",
      "User-Name": "string",
    },
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {
      id: "string",
    },
    TReqQuery: {},
    TResp: "",
    cookieParams: [],
    method: "delete",
    operationId: "deleteAttachmentUsingDELETE",
    pathParams: ["id"],
    queryParams: [],
    url: "/${id}",
  },
  {
    THeader: {},
    TReqBody: {
      UpdateBookJourneyUsingPOSTRequest: "IStatusFormData",
    },
    TReqCookie: {},
    TReqPath: {
      journeyId: "string",
      journeyType: "string",
    },
    TReqQuery: {},
    TResp: "{[key:string]:any}",
    cookieParams: [],
    method: "post",
    operationId: "UpdateBookJourneyUsingPOST",
    pathParams: ["journeyId", "journeyType"],
    queryParams: [],
    requestBody: "UpdateBookJourneyUsingPOSTRequest",
    url: "/book-journey/${journeyId}/${journeyType}",
  },
  {
    THeader: {},
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {
      id: "string",
    },
    TReqQuery: {},
    TResp: "IBookDetailVo",
    cookieParams: [],
    method: "get",
    operationId: "findBookByIdUsingGET",
    pathParams: ["id"],
    queryParams: [],
    url: "/book/${id}",
  },
  {
    THeader: {},
    TReqBody: {
      updateBookByIdUsingPUTRequest: "IUpdateBookRequest",
    },
    TReqCookie: {},
    TReqPath: {
      id: "string",
    },
    TReqQuery: {},
    TResp: "",
    cookieParams: [],
    method: "put",
    operationId: "updateBookByIdUsingPUT",
    pathParams: ["id"],
    queryParams: [],
    requestBody: "updateBookByIdUsingPUTRequest",
    url: "/book/${id}",
  },
  {
    THeader: {},
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {},
    TReqQuery: {
      "roleId?": "string",
      scheduleDate: "number",
    },
    TResp: "IScheduleVo[]",
    cookieParams: [],
    method: "get",
    operationId: "getScheduleDetailsByDateUsingGET",
    pathParams: [],
    queryParams: ["scheduleDate", "roleId"],
    url: "/schedules",
  },
  {
    THeader: {},
    TReqBody: {
      uploadDocumentUsingPOSTRequest: "IFileUploadReq",
    },
    TReqCookie: {},
    TReqPath: {},
    TReqQuery: {},
    TResp: "",
    cookieParams: [],
    method: "post",
    operationId: "uploadDocumentUsingPOST",
    pathParams: [],
    queryParams: [],
    requestBody: "uploadDocumentUsingPOSTRequest",
    url: "/documents",
  },
  {
    THeader: {},
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {
      documentId: "string",
    },
    TReqQuery: {
      "from?": "FromFrom#EnumTypeSuffix",
    },
    TResp: "IDocumentVo",
    cookieParams: [],
    method: "get",
    operationId: "getDocumentByIdUsingGET",
    pathParams: ["documentId"],
    queryParams: ["from"],
    url: "/documents/${documentId}/doc",
  },
];

const expectedRequest = [
  'export const useUpdateBookJourneyUsingPostRequest = ({journeyId,journeyType}:{\n        \'journeyId\': string;\n\'journeyType\': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<IUpdateBookJourneyUsingPostRequest, AxiosResponse<{[key:string]:any}>, IResponseError>({\n        url: `/book-journey/${journeyId}/${journeyType}`,\n        method: "post",headers: { "Content-Type": "application/json"},\n        ...axiosConfig});',
  "export const useDeleteAttachmentUsingDeleteRequest = ({id,authorities,userId,userName}:{\n        'authorities': string;\n'id': string;\n'userId': string;\n'userName': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<undefined, AxiosResponse<undefined>, IResponseError>({\n        url: `/${id}`,\n        method: \"delete\",headers: { \"Authorities\": authorities, \"User-Id\": userId, \"User-Name\": userName, },\n        ...axiosConfig});",
  'export const useDownloadUsingGetRequest = ({id,accept}:{\n        \'accept\': string;\n\'id\': string;\n      }, SWRConfig?: ISWRConfig<IResource, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<IResource, IResponseError>({\n        url: `/${id}`,\n        method: "get",headers: { "Accept": accept, },responseType: "blob",\n        ...axiosConfig}, SWRConfig);',
  "export const useFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: ISWRConfig<IBookDetailVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<IBookDetailVo, IResponseError>({\n        url: `/book/${id}`,\n        method: \"get\",headers: { },\n        ...axiosConfig}, SWRConfig);",
  "export const useGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: FromFrom;\n      }, SWRConfig?: ISWRConfig<IDocumentVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<IDocumentVo, IResponseError>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",headers: { },\n        params: {\n    from\n    },...axiosConfig}, SWRConfig);",
  "export const useGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId}:{\n        'roleId'?: string;\n'scheduleDate': number;\n      }, SWRConfig?: ISWRConfig<IScheduleVo[], IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<IScheduleVo[], IResponseError>({\n        url: `/schedules`,\n        method: \"get\",headers: { },\n        params: {\n    scheduleDate,\nroleId\n    },...axiosConfig}, SWRConfig);",
  'export const useUpdateBookByIdUsingPutRequest = ({id}:{\n        \'id\': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<IUpdateBookByIdUsingPutRequest, AxiosResponse<undefined>, IResponseError>({\n        url: `/book/${id}`,\n        method: "put",headers: { "Content-Type": "application/json"},\n        ...axiosConfig});',
  'export const useUploadAttachmentUsingPostRequest = ({authorities,userId,userName}:{\n        \'authorities\': string;\n\'userId\': string;\n\'userName\': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<IUploadAttachmentUsingPostRequest, AxiosResponse<IAttachmentBo>, IResponseError>({\n        url: `/`,\n        method: "post",headers: { "Authorities": authorities, "User-Id": userId, "User-Name": userName, "Content-Type": "multipart/form-data"},\n        ...axiosConfig});',
  'export const useUploadDocumentUsingPostRequest = (axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<IUploadDocumentUsingPostRequest, AxiosResponse<undefined>, IResponseError>({\n        url: `/documents`,\n        method: "post",headers: { "Content-Type": "multipart/form-data"},\n        ...axiosConfig});',
  "export interface IUpdateBookJourneyUsingPostRequest {\n        body: IStatusFormData;\n        \n      }",
  "export interface IGetDocumentByIdUsingGetRequest {\n        \n        query: {\n        'from'?: FromFrom;\n      }\n      }",
  "export interface IGetScheduleDetailsByDateUsingGetRequest {\n        \n        query: {\n        'roleId'?: string;\n'scheduleDate': number;\n      }\n      }",
  "export interface IUpdateBookByIdUsingPutRequest {\n        body: IUpdateBookRequest;\n        \n      }",
  "export interface IUploadAttachmentUsingPostRequest {\n        body: FormData;\n        \n      }",
  "export interface IUploadDocumentUsingPostRequest {\n        body: IFileUploadReq;\n        \n      }",
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];

const expectedContentType = {
  UpdateBookJourneyUsingPOST: "application/json",
  updateBookByIdUsingPUT: "application/json",
  uploadAttachmentUsingPOST: "multipart/form-data",
  uploadDocumentUsingPOST: "multipart/form-data",
};
