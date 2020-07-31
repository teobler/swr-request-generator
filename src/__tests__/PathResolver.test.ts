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
  "export const createDeleteAttachmentUsingDeleteRequest = ({id}:{\n        'id': string;\n      }) => \n        createRequestHook<undefined>({\n        url: `/${id}`,\n        method: \"delete\",\n        });",
  "export const createDownloadUsingGetRequest = ({id}:{\n        'id': string;\n      }) => \n        createRequestHook<IResource>({\n        url: `/${id}`,\n        method: \"get\",\n        });",
  "export const createFindBookByIdUsingGetRequest = ({id}:{\n        'id': string;\n      }) => \n        createRequestHook<IBookDetailVo>({\n        url: `/book/${id}`,\n        method: \"get\",\n        });",
  "export const createGetDocumentByIdUsingGetRequest = ({documentId,from}:{\n        'documentId': string;\n'from'?: keyof typeof FromFrom;\n      }) => \n        createRequestHook<IDocumentVo>({\n        url: `/documents/${documentId}/doc`,\n        method: \"get\",\n        params: {\n    from\n    },});",
  "export const createGetScheduleDetailsByDateUsingGetRequest = ({scheduleDate,roleId}:{\n        'roleId'?: string;\n'scheduleDate': number;\n      }) => \n        createRequestHook<IScheduleVo[]>({\n        url: `/schedules`,\n        method: \"get\",\n        params: {\n    scheduleDate,\nroleId\n    },});",
  "export const createUpdateBookByIdUsingPutRequest = ({id,updateBookByIdUsingPUTRequest}:{\n        'id': string;\n'updateBookByIdUsingPUTRequest': IUpdateBookRequest;\n      }) => \n        createRequestHook<undefined>({\n        url: `/book/${id}`,\n        method: \"put\",\n        data: updateBookByIdUsingPUTRequest,headers: {'Content-Type': \"multipart/form-data\"}});",
  'export const createUploadAttachmentUsingPostRequest = ({uploadAttachmentUsingPOSTRequest}:{\n        \'uploadAttachmentUsingPOSTRequest\': {"attachment":"string"};\n      }) => \n        createRequestHook<IAttachmentBo>({\n        url: `/`,\n        method: "post",\n        data: uploadAttachmentUsingPOSTRequest,headers: {\'Content-Type\': "multipart/form-data"}});',
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];
