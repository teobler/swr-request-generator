import { PathResolver } from "../PathResolver";
import openAPI from "./mock-data/openAPI.json";

describe("PathResolver", () => {
  it("should get resolved paths by openAPI schema", () => {
    expect(PathResolver.of((openAPI as any).paths).resolve().resolvedPaths).toEqual(expectedPathResolvedData);
  });

  it("should get correct action creator by resolved paths", () => {
    expect(
      PathResolver.of((openAPI as any).paths)
        .resolve()
        .toRequest(),
    ).toEqual(expectedRequest);
  });
});

const expectedPathResolvedData = [
  {
    TReq: {
      uploadAttachmentUsingPOSTRequest: {
        attachment: "string",
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
    TReq: {
      documentId: "string",
      "from?": "keyof typeof FromFrom#EnumTypeSuffix",
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
  "export const deleteAttachmentUsingDeleteRequest = ({id}:{\n        'id': string;\n      }) => \n        client.request<undefined>({\n        url: `/${id}`,\n        method: \"delete\",\n        });",
  "export const useDownloadUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: ISWRConfig<IResource, IResponseError>) => \n        useRequest<IResource, IResponseError>({\n        url: `/${id}`,\n        method: \"get\",\n        }, SWRConfig);",
  "export const useFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }, SWRConfig?: ISWRConfig<IBookDetailVo, IResponseError>) => \n        useRequest<IBookDetailVo, IResponseError>({\n        url: `/book/${id}`,\n        method: \"get\",\n        }, SWRConfig);",
  "export const useGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: keyof typeof FromFrom;\n      }, SWRConfig?: ISWRConfig<IDocumentVo, IResponseError>) => \n        useRequest<IDocumentVo, IResponseError>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",\n        params: {\n    from\n    },}, SWRConfig);",
  "export const useGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId}:{\n        'roleId'?: string;\n'scheduleDate': number;\n      }, SWRConfig?: ISWRConfig<IScheduleVo[], IResponseError>) => \n        useRequest<IScheduleVo[], IResponseError>({\n        url: `/schedules`,\n        method: \"get\",\n        params: {\n    scheduleDate,\nroleId\n    },}, SWRConfig);",
  "export const updateBookByIdUsingPutRequest = ({id,updateBookByIdUsingPutRequest}:{\n        'id': string;\n'updateBookByIdUsingPutRequest': IUpdateBookRequest;\n      }) => \n        client.request<undefined>({\n        url: `/book/${id}`,\n        method: \"put\",\n        data: updateBookByIdUsingPutRequest,headers: {'Content-Type': \"multipart/form-data\"}});",
  "export const uploadAttachmentUsingPostRequest = ({uploadAttachmentUsingPostRequest}:{\n        'uploadAttachmentUsingPostRequest': {attachment:string};\n      }) => \n        client.request<IAttachmentBo>({\n        url: `/`,\n        method: \"post\",\n        data: uploadAttachmentUsingPostRequest,headers: {'Content-Type': \"multipart/form-data\"}});",
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];
