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
    TReq: {
      uploadAttachmentUsingPOSTRequest: {
        attachment: "FormData",
      },
    },
    TResp: "IAttachmentBo",
    bodyParams: [],
    formDataParams: [],
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
    TReq: {
      id: "string",
    },
    TResp: "IResource",
    bodyParams: [],
    formDataParams: [],
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
    TReq: {
      id: "string",
    },
    TResp: "",
    bodyParams: [],
    formDataParams: [],
    method: "delete",
    operationId: "deleteAttachmentUsingDELETE",
    pathParams: ["id"],
    queryParams: [],
    url: "/${id}",
  },
  {
    THeader: {},
    TReq: {
      UpdateBookJourneyUsingPOSTRequest: "IStatusFormData",
      journeyId: "string",
      journeyType: "string",
    },
    TResp: "{[key:string]:any}",
    bodyParams: [],
    formDataParams: [],
    method: "post",
    operationId: "UpdateBookJourneyUsingPOST",
    pathParams: ["journeyId", "journeyType"],
    queryParams: [],
    requestBody: "UpdateBookJourneyUsingPOSTRequest",
    url: "/book-journey/${journeyId}/${journeyType}",
  },
  {
    THeader: {},
    TReq: {
      id: "string",
    },
    TResp: "IBookDetailVo",
    bodyParams: [],
    formDataParams: [],
    method: "get",
    operationId: "findBookByIdUsingGET",
    pathParams: ["id"],
    queryParams: [],
    url: "/book/${id}",
  },
  {
    THeader: {},
    TReq: {
      id: "string",
      updateBookByIdUsingPUTRequest: "IUpdateBookRequest",
    },
    TResp: "",
    bodyParams: [],
    formDataParams: [],
    method: "put",
    operationId: "updateBookByIdUsingPUT",
    pathParams: ["id"],
    queryParams: [],
    requestBody: "updateBookByIdUsingPUTRequest",
    url: "/book/${id}",
  },
  {
    THeader: {},
    TReq: {
      "roleId?": "string",
      scheduleDate: "number",
    },
    TResp: "IScheduleVo[]",
    bodyParams: [],
    formDataParams: [],
    method: "get",
    operationId: "getScheduleDetailsByDateUsingGET",
    pathParams: [],
    queryParams: ["scheduleDate", "roleId"],
    url: "/schedules",
  },
  {
    THeader: {},
    TReq: {
      uploadDocumentUsingPOSTRequest: "IFileUploadReq",
    },
    TResp: "",
    bodyParams: [],
    formDataParams: [],
    method: "post",
    operationId: "uploadDocumentUsingPOST",
    pathParams: [],
    queryParams: [],
    requestBody: "uploadDocumentUsingPOSTRequest",
    url: "/documents",
  },
  {
    THeader: {},
    TReq: {
      documentId: "string",
      "from?": "FromFrom#EnumTypeSuffix",
    },
    TResp: "IDocumentVo",
    bodyParams: [],
    formDataParams: [],
    method: "get",
    operationId: "getDocumentByIdUsingGET",
    pathParams: ["documentId"],
    queryParams: ["from"],
    url: "/documents/${documentId}/doc",
  },
];

const expectedRequest = [
  "export const updateBookJourneyUsingPostRequest = ({journeyId,journeyType,updateBookJourneyUsingPostRequest}:{\n        'UpdateBookJourneyUsingPOSTRequest': IStatusFormData;\n'journeyId': string;\n'journeyType': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        client.request<{[key:string]:any}, AxiosResponse<{[key:string]:any}>>({\n        url: `/book-journey/${journeyId}/${journeyType}`,\n        method: \"post\",headers: { \"Content-Type\": \"application/json\"},\n        data: updateBookJourneyUsingPostRequest,...axiosConfig});",
  "export const deleteAttachmentUsingDeleteRequest = ({id,authorities,userId,userName}:{\n        'Authorities': string;\n'id': string;\n'userId': string;\n'userName': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        client.request<undefined, AxiosResponse<undefined>>({\n        url: `/${id}`,\n        method: \"delete\",headers: { \"Authorities\": authorities, \"User-Id\": userId, \"User-Name\": userName, },\n        ...axiosConfig});",
  'export const useDownloadUsingGetRequest = ({id,accept}:{\n        \'Accept\': string;\n\'id\': string;\n      }, SWRConfig?: ISWRConfig<IResource, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useRequest<IResource, IResponseError>({\n        url: `/${id}`,\n        method: "get",headers: { "Accept": accept, },responseType: "blob",\n        ...axiosConfig}, SWRConfig);',
  "export const useFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: ISWRConfig<IBookDetailVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useRequest<IBookDetailVo, IResponseError>({\n        url: `/book/${id}`,\n        method: \"get\",headers: { },\n        ...axiosConfig}, SWRConfig);",
  "export const useGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: FromFrom;\n      }, SWRConfig?: ISWRConfig<IDocumentVo, IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useRequest<IDocumentVo, IResponseError>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",headers: { },\n        params: {\n    from\n    },...axiosConfig}, SWRConfig);",
  "export const useGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId}:{\n        'roleId'?: string;\n'scheduleDate': number;\n      }, SWRConfig?: ISWRConfig<IScheduleVo[], IResponseError>, axiosConfig?: AxiosRequestConfig) => \n        useRequest<IScheduleVo[], IResponseError>({\n        url: `/schedules`,\n        method: \"get\",headers: { },\n        params: {\n    scheduleDate,\nroleId\n    },...axiosConfig}, SWRConfig);",
  'export const updateBookByIdUsingPutRequest = ({id,updateBookByIdUsingPutRequest}:{\n        \'id\': string;\n\'updateBookByIdUsingPUTRequest\': IUpdateBookRequest;\n      }, axiosConfig?: AxiosRequestConfig) => \n        client.request<undefined, AxiosResponse<undefined>>({\n        url: `/book/${id}`,\n        method: "put",headers: { "Content-Type": "application/json"},\n        data: updateBookByIdUsingPutRequest,...axiosConfig});',
  'export const uploadAttachmentUsingPostRequest = ({authorities,userId,userName,uploadAttachmentUsingPostRequest}:{\n        \'Authorities\': string;\n\'uploadAttachmentUsingPOSTRequest\': FormData\n\'userId\': string;\n\'userName\': string;\n      }, axiosConfig?: AxiosRequestConfig) => \n        client.request<IAttachmentBo, AxiosResponse<IAttachmentBo>>({\n        url: `/`,\n        method: "post",headers: { "Authorities": authorities, "User-Id": userId, "User-Name": userName, "Content-Type": "multipart/form-data"},\n        data: uploadAttachmentUsingPostRequest,...axiosConfig});',
  'export const uploadDocumentUsingPostRequest = ({uploadDocumentUsingPostRequest}:{\n        \'uploadDocumentUsingPOSTRequest\': IFileUploadReq;\n      }, axiosConfig?: AxiosRequestConfig) => \n        client.request<undefined, AxiosResponse<undefined>>({\n        url: `/documents`,\n        method: "post",headers: { "Content-Type": "multipart/form-data"},\n        data: uploadDocumentUsingPostRequest,...axiosConfig});',
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];

const expectedContentType = {
  UpdateBookJourneyUsingPOST: "application/json",
  updateBookByIdUsingPUT: "application/json",
  uploadAttachmentUsingPOST: "multipart/form-data",
  uploadDocumentUsingPOST: "multipart/form-data",
};
