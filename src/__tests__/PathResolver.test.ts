import { PathResolver } from "../PathResolver";
import openAPI from "./mock-data/openAPI.json";

describe("PathResolver", () => {
  it("should get resolved paths by openAPI schema", () => {
    expect(PathResolver.of((openAPI as any).paths, openAPI.servers).resolve().resolvedPaths).toEqual(
      expectedPathResolvedData,
    );
  });

  it("should get correct action creator by resolved paths", () => {
    expect(
      PathResolver.of((openAPI as any).paths, openAPI.servers)
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
    url: "/api/test",
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
    url: "/api/test/${id}",
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
    url: "/api/test/${id}",
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
    url: "/api/test/book/${id}",
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
    url: "/api/test/book/${id}",
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
    url: "/api/test/schedules",
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
    url: "/api/test/documents/${documentId}/doc",
  },
];

const expectedRequest = [
  "export const createDeleteAttachmentRequest = ({id}: {\n        'id': string;\n      }) => \n                createRequestHook<undefined>({\n                  url: `/api/test/${id}`,\n                  method: \"delete\",\n                  });",
  "export const createDownloadRequest = ({id}: {\n        'id': string;\n      }) => \n                createRequestHook<IResource>({\n                  url: `/api/test/${id}`,\n                  method: \"get\",\n                  });",
  "export const createFindBookByIdRequest = ({id}: {\n        'id': string;\n      }) => \n                createRequestHook<IBookDetailVo>({\n                  url: `/api/test/book/${id}`,\n                  method: \"get\",\n                  });",
  "export const createGetDocumentByIdRequest = ({documentId, from}: {\n        'documentId': string;\n'from'?: keyof typeof FromFrom;\n      }) => \n                createRequestHook<IDocumentVo>({\n                  url: `/api/test/documents/${documentId}/doc`,\n                  method: \"get\",\n                  params: {\n    from\n    },});",
  "export const createGetScheduleDetailsByDateRequest = ({scheduleDate, roleId}: {\n        'roleId'?: string;\n'scheduleDate': number;\n      }) => \n                createRequestHook<IScheduleVo[]>({\n                  url: `/api/test/schedules`,\n                  method: \"get\",\n                  params: {\n    scheduleDate,\nroleId\n    },});",
  "export const createUpdateBookByIdRequest = ({id, updateBookByIdUsingPUTRequest}: {\n        'id': string;\n'updateBookByIdUsingPUTRequest': IUpdateBookRequest;\n      }) => \n                createRequestHook<undefined>({\n                  url: `/api/test/book/${id}`,\n                  method: \"put\",\n                  data: updateBookByIdUsingPUTRequest,headers: {'Content-Type': \"multipart/form-data\"}});",
  'export const createUploadAttachmentRequest = ({uploadAttachmentUsingPOSTRequest}: {\n        \'uploadAttachmentUsingPOSTRequest\': {"attachment":"string"};\n      }) => \n                createRequestHook<IAttachmentBo>({\n                  url: `/api/test`,\n                  method: "post",\n                  data: uploadAttachmentUsingPOSTRequest,headers: {\'Content-Type\': "multipart/form-data"}});',
  'export enum FromFrom {"AAA"="AAA","BBB"="BBB"}',
];
