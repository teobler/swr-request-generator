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
    "TReq": {
      "uploadAttachmentUsingPOSTRequest": {
        "attachment": "string"
      }
    },
    "TResp": "IAttachmentBo",
    "bodyParams": [],
    "formDataParams": [],
    "method": "post",
    "operationId": "uploadAttachmentUsingPOST",
    "pathParams": [],
    "queryParams": [],
    "requestBody": "uploadAttachmentUsingPOSTRequest",
    "url": "/api/test"
  },
  {
    "TReq": {
      "id": "string"
    },
    "TResp": "IResource",
    "bodyParams": [],
    "formDataParams": [],
    "method": "get",
    "operationId": "downloadUsingGET",
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "url": "/api/test/${id}"
  },
  {
    "TReq": {
      "id": "string"
    },
    "TResp": "",
    "bodyParams": [],
    "formDataParams": [],
    "method": "delete",
    "operationId": "deleteAttachmentUsingDELETE",
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "url": "/api/test/${id}"
  },
  {
    "TReq": {
      "id": "string"
    },
    "TResp": "IBookDetailVo",
    "bodyParams": [],
    "formDataParams": [],
    "method": "get",
    "operationId": "findBookByIdUsingGET",
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "url": "/api/test/book/${id}"
  },
  {
    "TReq": {
      "id": "string",
      "updateBookByIdUsingPUTRequest": "IUpdateBookRequest"
    },
    "TResp": "",
    "bodyParams": [],
    "formDataParams": [],
    "method": "put",
    "operationId": "updateBookByIdUsingPUT",
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "requestBody": "updateBookByIdUsingPUTRequest",
    "url": "/api/test/book/${id}"
  },
  {
    "TReq": {
      "roleId?": "string",
      "scheduleDate": "number"
    },
    "TResp": "IScheduleVo[]",
    "bodyParams": [],
    "formDataParams": [],
    "method": "get",
    "operationId": "getScheduleDetailsByDateUsingGET",
    "pathParams": [],
    "queryParams": [
      "scheduleDate",
      "roleId"
    ],
    "url": "/api/test/schedules"
  },
  {
    "TReq": {
      "documentId": "string",
      "from?": "keyof typeof FromFrom#EnumTypeSuffix"
    },
    "TResp": "IDocumentVo",
    "bodyParams": [],
    "formDataParams": [],
    "method": "get",
    "operationId": "getDocumentByIdUsingGET",
    "pathParams": [
      "documentId"
    ],
    "queryParams": [
      "from"
    ],
    "url": "/api/test/documents/${documentId}/doc"
  }
];

const expectedRequest = [
  "export const deleteAttachmentUsingDELETE = createRequestAction<{\n        'id': string;\n      }, >('deleteAttachmentUsingDELETE', ({\n    id\n    }) => ({url: `/api/test/${id}`, method: \"delete\", }));",
  "export const downloadUsingGET = createRequestAction<{\n        'id': string;\n      }, IResource>('downloadUsingGET', ({\n    id\n    }) => ({url: `/api/test/${id}`, method: \"get\", }));",
  "export const findBookByIdUsingGET = createRequestAction<{\n        'id': string;\n      }, IBookDetailVo>('findBookByIdUsingGET', ({\n    id\n    }) => ({url: `/api/test/book/${id}`, method: \"get\", }));",
  "export const getDocumentByIdUsingGET = createRequestAction<{\n        'documentId': string;\n'from'?: keyof typeof FromFrom;\n      }, IDocumentVo>('getDocumentByIdUsingGET', ({\n    documentId,\nfrom\n    }) => ({url: `/api/test/documents/${documentId}/doc`, method: \"get\", params: {\n    from\n    },}));",
  "export const getScheduleDetailsByDateUsingGET = createRequestAction<{\n        'roleId'?: string;\n'scheduleDate': number;\n      }, IScheduleVo[]>('getScheduleDetailsByDateUsingGET', ({\n    scheduleDate,\nroleId\n    }) => ({url: `/api/test/schedules`, method: \"get\", params: {\n    scheduleDate,\nroleId\n    },}));",
  "export const updateBookByIdUsingPUT = createRequestAction<{\n        'id': string;\n'updateBookByIdUsingPUTRequest': IUpdateBookRequest;\n      }, >('updateBookByIdUsingPUT', ({\n    id,\nupdateBookByIdUsingPUTRequest\n    }) => ({url: `/api/test/book/${id}`, method: \"put\", data: updateBookByIdUsingPUTRequest,headers: {'Content-Type': \"multipart/form-data\"}}));",
  "export const uploadAttachmentUsingPOST = createRequestAction<{\n        'uploadAttachmentUsingPOSTRequest': {\"attachment\":\"string\"};\n      }, IAttachmentBo>('uploadAttachmentUsingPOST', ({\n    uploadAttachmentUsingPOSTRequest\n    }) => ({url: `/api/test`, method: \"post\", data: uploadAttachmentUsingPOSTRequest,headers: {'Content-Type': \"multipart/form-data\"}}));",
  "export enum FromFrom {\"AAA\"=\"AAA\",\"BBB\"=\"BBB\"}"
];
