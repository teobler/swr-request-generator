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
    TResp: "AttachmentBo",
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
    TResp: "Resource",
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
      UpdateBookJourneyUsingPOSTRequest: "StatusFormData",
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
    TResp: "BookDetailVo",
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
      updateBookByIdUsingPUTRequest: "UpdateBookRequest",
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
      fruit: "Fruit",
      "roleId?": "string",
      scheduleDate: "number",
    },
    TResp: "ScheduleVo[]",
    cookieParams: [],
    method: "get",
    operationId: "getScheduleDetailsByDateUsingGET",
    pathParams: [],
    queryParams: ["scheduleDate", "roleId", "fruit"],
    url: "/schedules",
  },
  {
    THeader: {},
    TReqBody: {
      uploadDocumentUsingPOSTRequest: "FileUploadReq",
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
    TResp: "DocumentVo",
    cookieParams: [],
    method: "get",
    operationId: "getDocumentByIdUsingGET",
    pathParams: ["documentId"],
    queryParams: ["from"],
    url: "/documents/${documentId}/doc",
  },
  {
    THeader: {},
    TReqBody: {
      updatePetsRequest: "Cat | Dog | null",
    },
    TReqCookie: {},
    TReqPath: {},
    TReqQuery: {},
    TResp: "",
    cookieParams: [],
    method: "patch",
    operationId: "updatePets",
    pathParams: [],
    queryParams: [],
    requestBody: "updatePetsRequest",
    url: "/pets",
  },
];

const expectedRequest = [
  'export const useUpdateBookJourneyUsingPostRequest = ({journeyId,journeyType}:{\n        \'journeyId\': string;\n\'journeyType\': string;\n      }, mutationConfig?: SWRMutationConfig<UpdateBookJourneyUsingPostRequest, AxiosResponse<{[key:string]:any}>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdateBookJourneyUsingPostRequest, AxiosResponse<{[key:string]:any}>, IResponseError>({\n        url: `/book-journey/${journeyId}/${journeyType}`,\n        method: "post",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  "export const useDeleteAttachmentUsingDeleteRequest = ({id,authorities,userId,userName}:{\n        'authorities': string;\n'id': string;\n'userId': string;\n'userName': string;\n      }, mutationConfig?: SWRMutationConfig<undefined, AxiosResponse<undefined>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<undefined, AxiosResponse<undefined>, IResponseError>({\n        url: `/${id}`,\n        method: \"delete\",headers: { \"Authorities\": authorities, \"User-Id\": userId, \"User-Name\": userName, },\n        mutationConfig,\n        axiosConfig});",
  'export const useDownloadUsingGetRequest = ({id,accept}:{\n        \'accept\': string;\n\'id\': string;\n      }, SWRConfig?: ISWRConfig<Resource, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<Resource, IResponseError>({\n        url: `/${id}`,\n        method: "get",headers: { "Accept": accept, },responseType: "blob",\n        ...axiosConfig}, SWRConfig);',
  "export const useFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: ISWRConfig<BookDetailVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<BookDetailVo, IResponseError>({\n        url: `/book/${id}`,\n        method: \"get\",headers: { },\n        ...axiosConfig}, SWRConfig);",
  "export const useGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: FromFrom;\n      }, SWRConfig?: ISWRConfig<DocumentVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<DocumentVo, IResponseError>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",headers: { },\n        params: {\n    from\n    },...axiosConfig}, SWRConfig);",
  "export const useGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId,fruit}:{\n        'fruit': Fruit;\n'roleId'?: string;\n'scheduleDate': number;\n      }, SWRConfig?: ISWRConfig<ScheduleVo[], IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<ScheduleVo[], IResponseError>({\n        url: `/schedules`,\n        method: \"get\",headers: { },\n        params: {\n    scheduleDate,\nroleId,\nfruit\n    },...axiosConfig}, SWRConfig);",
  'export const useUpdateBookByIdUsingPutRequest = ({id}:{\n        \'id\': string;\n      }, mutationConfig?: SWRMutationConfig<UpdateBookByIdUsingPutRequest, AxiosResponse<undefined>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdateBookByIdUsingPutRequest, AxiosResponse<undefined>, IResponseError>({\n        url: `/book/${id}`,\n        method: "put",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUpdatePetsRequest = (mutationConfig?: SWRMutationConfig<UpdatePetsRequest, AxiosResponse<undefined>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdatePetsRequest, AxiosResponse<undefined>, IResponseError>({\n        url: `/pets`,\n        method: "patch",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUploadAttachmentUsingPostRequest = ({authorities,userId,userName}:{\n        \'authorities\': string;\n\'userId\': string;\n\'userName\': string;\n      }, mutationConfig?: SWRMutationConfig<UploadAttachmentUsingPostRequest, AxiosResponse<AttachmentBo>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UploadAttachmentUsingPostRequest, AxiosResponse<AttachmentBo>, IResponseError>({\n        url: `/`,\n        method: "post",headers: { "Authorities": authorities, "User-Id": userId, "User-Name": userName, "Content-Type": "multipart/form-data"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUploadDocumentUsingPostRequest = (mutationConfig?: SWRMutationConfig<UploadDocumentUsingPostRequest, AxiosResponse<undefined>, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UploadDocumentUsingPostRequest, AxiosResponse<undefined>, IResponseError>({\n        url: `/documents`,\n        method: "post",headers: { "Content-Type": "multipart/form-data"},\n        mutationConfig,\n        axiosConfig});',
  "export interface UpdateBookJourneyUsingPostRequest {\n        body: StatusFormData;\n        \n      }",
  "export interface GetDocumentByIdUsingGetRequest {\n        \n        query: {\n        'from'?: FromFrom;\n      }\n      }",
  "export interface GetScheduleDetailsByDateUsingGetRequest {\n        \n        query: {\n        'fruit': Fruit;\n'roleId'?: string;\n'scheduleDate': number;\n      }\n      }",
  "export interface UpdateBookByIdUsingPutRequest {\n        body: UpdateBookRequest;\n        \n      }",
  "export interface UpdatePetsRequest {\n        body: Cat | Dog | null;\n        \n      }",
  "export interface UploadAttachmentUsingPostRequest {\n        body: FormData;\n        \n      }",
  "export interface UploadDocumentUsingPostRequest {\n        body: FileUploadReq;\n        \n      }",
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];

const expectedContentType = {
  UpdateBookJourneyUsingPOST: "application/json",
  updateBookByIdUsingPUT: "application/json",
  updatePets: "application/json",
  uploadAttachmentUsingPOST: "multipart/form-data",
  uploadDocumentUsingPOST: "multipart/form-data",
};
