import { DefinitionsResolver } from "../DefinitionsResolver";
import openAPI from "./mock-data/openAPI.json";

describe("DefinitionsResolver", () => {
  it("should generate correct definitions", () => {
    expect(DefinitionsResolver.of((openAPI as any).components).scanDefinitions().resolvedDefinitions).toEqual(
      expectedDefinitions,
    );
  });

  it("should generate correct declarations", () => {
    expect(
      DefinitionsResolver.of((openAPI as any).components)
        .scanDefinitions()
        .toDeclarations(),
    ).toEqual(expectedDeclarations);
  });
});

const expectedDefinitions = {
  AttachmentBO: {
    "authorName?": "string",
    "createdDate?": "number",
    "fileName?": "string",
    "id?": "string",
    "mimeType?": "string",
    "path?": "string",
  },
  BookDetailVo: {
    "attachment?": "IScheduleVo",
    "authorName?": "string",
    "createdDate?": "number",
    "fileName?": "string",
    "id?": "string",
    "mimeType?": "string",
    "path?": "string",
    "type?": "BookDetailVoType#EnumTypeSuffix",
  },
  "BookDetailVoType#EnumTypeSuffix": ["INTERVENTION_RUN", "CASE_CREATION_DATE"],
  BookVO: {
    "address?": "string | null",
    "price?": "string",
  },
  BookingResponse: {
    data: "IDocumentVo",
    "errors?": "IErrorInfo[]",
  },
  DocumentVO: {
    "attachment?": "IBookDetailVo",
    "authorName?": "string",
    "createdDate?": "number",
    "id?": "string",
    "note?": "string",
    "title?": "string",
  },
  ErrorInfo: {
    "errorMessage?": "string",
  },
  File: {
    "absolute?": "boolean",
    "absoluteFile?": "IFile",
    "absolutePath?": "string",
    "canonicalFile?": "IFile",
    "canonicalPath?": "string",
    "directory?": "boolean",
    "executable?": "boolean",
    "file?": "boolean",
    "freeSpace?": "number",
    "hidden?": "boolean",
    "lastModified?": "number",
    "name?": "string",
    "parent?": "string",
    "parentFile?": "IFile",
    "path?": "string",
    "readable?": "boolean",
    "totalSpace?": "number",
    "usableSpace?": "number",
    "writable?": "boolean",
  },
  FileUploadReq: {
    file: "FormData",
  },
  InputStream: "object",
  Resource: {
    "description?": "string",
    "file?": "IFile",
    "filename?": "string",
    "inputStream?": "IInputStream",
    "open?": "boolean",
    "readable?": "boolean",
    "uri?": "IUri",
    "url?": "IUrl",
  },
  ScheduleVO: {
    "schedules?": "IBookVo[][] | null",
    "shiftId?": "string",
    "team?": "string",
  },
  StatusFormData: {},
  URI: {
    "absolute?": "boolean",
    "authority?": "string",
    "fragment?": "string",
    "host?": "string",
    "opaque?": "boolean",
    "path?": "string",
    "port?": "number",
    "query?": "string",
    "rawAuthority?": "string",
    "rawFragment?": "string",
    "rawPath?": "string",
    "rawQuery?": "string",
    "rawSchemeSpecificPart?": "string",
    "rawUserInfo?": "string",
    "scheme?": "string",
    "schemeSpecificPart?": "string",
    "userInfo?": "string",
  },
  URL: {
    "authority?": "string",
    "content?": "{[key:string]:any}",
    "defaultPort?": "number",
    "deserializedFields?": "IUrlStreamHandler",
    "file?": "string",
    "host?": "string",
    "path?": "string",
    "port?": "number",
    "protocol?": "string",
    "query?": "string",
    "ref?": "string",
    "serializedHashCode?": "number",
    "userInfo?": "string",
  },
  URLStreamHandler: "object",
  UpdateBookRequest: {
    "birthCountry?": "string",
    "citizenship?": "string",
    "dateOfBirth?": "number",
    "employmentStatus?": "string",
    "ethnicity?": "string",
    "gender?": "string",
    "idNumber?": "string",
    "idType?": "string",
    "roleId?": "string",
    "spokenLanguage?": "string[]",
  },
};

const expectedDeclarations = [
  "export interface IAttachmentBo {\n        'authorName'?: string;\n'createdDate'?: number;\n'fileName'?: string;\n'id'?: string;\n'mimeType'?: string;\n'path'?: string;\n      }",
  "export interface IBookDetailVo {\n        'attachment'?: IScheduleVo;\n'authorName'?: string;\n'createdDate'?: number;\n'fileName'?: string;\n'id'?: string;\n'mimeType'?: string;\n'path'?: string;\n'type'?: BookDetailVoType;\n      }",
  'export enum BookDetailVoType {"INTERVENTION_RUN"="INTERVENTION_RUN","CASE_CREATION_DATE"="CASE_CREATION_DATE"}',
  "export interface IBookVo {\n        'address'?: string | null;\n'price'?: string;\n      }",
  "export interface IBookingResponse {\n        'data': IDocumentVo;\n'errors'?: IErrorInfo[];\n      }",
  "export interface IDocumentVo {\n        'attachment'?: IBookDetailVo;\n'authorName'?: string;\n'createdDate'?: number;\n'id'?: string;\n'note'?: string;\n'title'?: string;\n      }",
  "export interface IErrorInfo {\n        'errorMessage'?: string;\n      }",
  "export interface IFile {\n        'absolute'?: boolean;\n'absoluteFile'?: IFile;\n'absolutePath'?: string;\n'canonicalFile'?: IFile;\n'canonicalPath'?: string;\n'directory'?: boolean;\n'executable'?: boolean;\n'file'?: boolean;\n'freeSpace'?: number;\n'hidden'?: boolean;\n'lastModified'?: number;\n'name'?: string;\n'parent'?: string;\n'parentFile'?: IFile;\n'path'?: string;\n'readable'?: boolean;\n'totalSpace'?: number;\n'usableSpace'?: number;\n'writable'?: boolean;\n      }",
  "export interface IFileUploadReq {\n        'file': FormData;\n      }",
  "export interface IInputStream {[key:string]:any}",
  "export interface IResource {\n        'description'?: string;\n'file'?: IFile;\n'filename'?: string;\n'inputStream'?: IInputStream;\n'open'?: boolean;\n'readable'?: boolean;\n'uri'?: IUri;\n'url'?: IUrl;\n      }",
  "export interface IScheduleVo {\n        'schedules'?: IBookVo[][] | null;\n'shiftId'?: string;\n'team'?: string;\n      }",
  "export interface IStatusFormData {[key:string]:any}",
  "export interface IUri {\n        'absolute'?: boolean;\n'authority'?: string;\n'fragment'?: string;\n'host'?: string;\n'opaque'?: boolean;\n'path'?: string;\n'port'?: number;\n'query'?: string;\n'rawAuthority'?: string;\n'rawFragment'?: string;\n'rawPath'?: string;\n'rawQuery'?: string;\n'rawSchemeSpecificPart'?: string;\n'rawUserInfo'?: string;\n'scheme'?: string;\n'schemeSpecificPart'?: string;\n'userInfo'?: string;\n      }",
  "export interface IUrl {\n        'authority'?: string;\n'content'?: {[key:string]:any};\n'defaultPort'?: number;\n'deserializedFields'?: IUrlStreamHandler;\n'file'?: string;\n'host'?: string;\n'path'?: string;\n'port'?: number;\n'protocol'?: string;\n'query'?: string;\n'ref'?: string;\n'serializedHashCode'?: number;\n'userInfo'?: string;\n      }",
  "export interface IUrlStreamHandler {[key:string]:any}",
  "export interface IUpdateBookRequest {\n        'birthCountry'?: string;\n'citizenship'?: string;\n'dateOfBirth'?: number;\n'employmentStatus'?: string;\n'ethnicity'?: string;\n'gender'?: string;\n'idNumber'?: string;\n'idType'?: string;\n'roleId'?: string;\n'spokenLanguage'?: string[];\n      }",
];
