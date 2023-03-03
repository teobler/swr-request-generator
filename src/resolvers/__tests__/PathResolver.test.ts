import { PathResolver } from "../PathResolver";
import openAPI from "./mock-data/openAPI.json";
import { OasObject } from "@ts-stack/openapi-spec";

describe("PathResolver", () => {
  it("should get resolved paths by openAPI schema", () => {
    expect(PathResolver.of((openAPI as unknown as OasObject).paths!).resolve().resolvedPaths).toEqual(
      expectedPathResolvedData,
    );
  });

  it("should get correct request creator by resolved paths", () => {
    expect(
      PathResolver.of((openAPI as unknown as OasObject).paths!)
        .resolve()
        .toRequest(),
    ).toEqual(expectedRequest);
  });

  it("should get correct content type for different operation id", () => {
    expect(PathResolver.of((openAPI as unknown as OasObject).paths!).resolve().contentType).toEqual(
      expectedContentType,
    );
  });
});

const expectedPathResolvedData = [
  {
    THeader: {},
    TReqBody: {},
    TReqCookie: {},
    TReqPath: {},
    TReqQuery: {},
    TResp: {
      "data?": "AuthenticationData[]",
      "others?": "string",
    },
    cookieParams: [],
    method: "get",
    operationId: "userProfileInformation",
    pathParams: [],
    queryParams: [],
    url: "/user/profile-information",
  },
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
  'export const useUpdateBookJourneyUsingPostRequest = ({journeyId,journeyType}:{\n        \'journeyId\': string;\n\'journeyType\': string;\n      }, mutationConfig?: SWRMutationConfig<UpdateBookJourneyUsingPostRequest, AxiosResponse<{[key:string]:any}>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdateBookJourneyUsingPostRequest, AxiosResponse<{[key:string]:any}>, ResponseError>({\n        url: `/book-journey/${journeyId}/${journeyType}`,\n        method: "post",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  "export const useDeleteAttachmentUsingDeleteRequest = ({id,authorities,userId,userName}:{\n        'authorities': string;\n'id': string;\n'userId': string;\n'userName': string;\n      }, mutationConfig?: SWRMutationConfig<undefined, AxiosResponse<undefined>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<undefined, AxiosResponse<undefined>, ResponseError>({\n        url: `/${id}`,\n        method: \"delete\",headers: { \"Authorities\": authorities, \"User-Id\": userId, \"User-Name\": userName, },\n        mutationConfig,\n        axiosConfig});",
  'export const useDownloadUsingGetRequest = ({id,accept}:{\n        \'accept\': string;\n\'id\': string;\n      }, SWRConfig?: SWRConfig<Resource, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<Resource, ResponseError>({\n        url: `/${id}`,\n        method: "get",headers: { "Accept": accept, },responseType: "blob",\n        ...axiosConfig}, SWRConfig);',
  "export const useFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: SWRConfig<BookDetailVo, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<BookDetailVo, ResponseError>({\n        url: `/book/${id}`,\n        method: \"get\",headers: { },\n        ...axiosConfig}, SWRConfig);",
  "export const useGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: FromFrom;\n      }, SWRConfig?: SWRConfig<DocumentVo, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<DocumentVo, ResponseError>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",headers: { },\n        params: {\n    from\n    },...axiosConfig}, SWRConfig);",
  "export const useGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId,fruit}:{\n        'fruit': Fruit;\n'roleId'?: string;\n'scheduleDate': number;\n      }, SWRConfig?: SWRConfig<ScheduleVo[], ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useGetRequest<ScheduleVo[], ResponseError>({\n        url: `/schedules`,\n        method: \"get\",headers: { },\n        params: {\n    scheduleDate,\nroleId,\nfruit\n    },...axiosConfig}, SWRConfig);",
  'export const useUpdateBookByIdUsingPutRequest = ({id}:{\n        \'id\': string;\n      }, mutationConfig?: SWRMutationConfig<UpdateBookByIdUsingPutRequest, AxiosResponse<undefined>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdateBookByIdUsingPutRequest, AxiosResponse<undefined>, ResponseError>({\n        url: `/book/${id}`,\n        method: "put",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUpdatePetsRequest = (mutationConfig?: SWRMutationConfig<UpdatePetsRequest, AxiosResponse<undefined>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UpdatePetsRequest, AxiosResponse<undefined>, ResponseError>({\n        url: `/pets`,\n        method: "patch",headers: { "Content-Type": "application/json"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUploadAttachmentUsingPostRequest = ({authorities,userId,userName}:{\n        \'authorities\': string;\n\'userId\': string;\n\'userName\': string;\n      }, mutationConfig?: SWRMutationConfig<UploadAttachmentUsingPostRequest, AxiosResponse<AttachmentBo>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UploadAttachmentUsingPostRequest, AxiosResponse<AttachmentBo>, ResponseError>({\n        url: `/`,\n        method: "post",headers: { "Authorities": authorities, "User-Id": userId, "User-Name": userName, "Content-Type": "multipart/form-data"},\n        mutationConfig,\n        axiosConfig});',
  'export const useUploadDocumentUsingPostRequest = (mutationConfig?: SWRMutationConfig<UploadDocumentUsingPostRequest, AxiosResponse<undefined>, ResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useMutationRequest<UploadDocumentUsingPostRequest, AxiosResponse<undefined>, ResponseError>({\n        url: `/documents`,\n        method: "post",headers: { "Content-Type": "multipart/form-data"},\n        mutationConfig,\n        axiosConfig});',
  `export const useUserProfileInformationRequest = (SWRConfig?: SWRConfig<{data?:AuthenticationData[],others?:string}, ResponseError>, axiosConfig?: AxiosRequestConfig) => 
        useGetRequest<{data?:AuthenticationData[],others?:string}, ResponseError>({
        url: \`/user/profile-information\`,
        method: "get",headers: { },
        ...axiosConfig}, SWRConfig);`,
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
