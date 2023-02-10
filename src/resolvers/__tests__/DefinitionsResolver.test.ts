import { DefinitionsResolver } from "../DefinitionsResolver";
import openAPI from "./mock-data/openAPI.json";
import { OasObject } from "@ts-stack/openapi-spec";

describe("DefinitionsResolver", () => {
  it("should generate correct definitions", () => {
    expect(
      DefinitionsResolver.of((openAPI as unknown as OasObject).components).scanDefinitions().resolvedDefinitions,
    ).toEqual(expectedDefinitions);
  });

  it("should generate correct declarations", () => {
    expect(
      DefinitionsResolver.of((openAPI as unknown as OasObject).components)
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
    "CreatedDate?": "number",
    "attachment?": "ScheduleVo",
    "author_name?": "string",
    "filename?": "string",
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
    data: "DocumentVo",
    "errors?": "ErrorInfo[]",
  },
  Cat: {
    "age?": "number",
    "hunts?": "boolean",
  },
  DocumentVO: {
    "attachment?": "BookDetailVo",
    "authorName?": "string",
    "createdDate?": "number",
    "id?": "string",
    "note?": "string",
    "title?": "string",
  },
  Dog: {
    "bark?": "boolean",
    "breed?": "DogBreed#EnumTypeSuffix",
  },
  "DogBreed#EnumTypeSuffix": ["Dingo", "Husky", "Retriever", "Shepherd"],
  ErrorInfo: {
    "errorMessage?": "string",
  },
  File: {
    "absolute?": "boolean",
    "absoluteFile?": "File",
    "absolutePath?": "string",
    "canonicalFile?": "File",
    "canonicalPath?": "string",
    "directory?": "boolean",
    "executable?": "boolean",
    "file?": "boolean",
    "freeSpace?": "number",
    "hidden?": "boolean",
    "lastModified?": "number",
    "name?": "string",
    "parent?": "string",
    "parentFile?": "File",
    "path?": "string",
    "readable?": "boolean",
    "totalSpace?": "number",
    "usableSpace?": "number",
    "writable?": "boolean",
  },
  FileUploadReq: {
    file: "FormData",
  },
  "Fruit#EnumTypeSuffix": ["Apple", "Orange", "Pear"],
  InputStream: "object",
  Resource: {
    "description?": "string",
    "file?": "File",
    "filename?": "string",
    "inputStream?": "InputStream",
    "open?": "boolean",
    "readable?": "boolean",
    "uri?": "Uri",
    "url?": "Url",
  },
  ScheduleVO: {
    "schedules?": "BookVo[][] | null",
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
    "deserializedFields?": "UrlStreamHandler",
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
  "export interface AttachmentBo {\n        'authorName'?: string;\n'createdDate'?: number;\n'fileName'?: string;\n'id'?: string;\n'mimeType'?: string;\n'path'?: string;\n      }",
  "export interface BookDetailVo {\n        'CreatedDate'?: number;\n'attachment'?: ScheduleVo;\n'author_name'?: string;\n'filename'?: string;\n'id'?: string;\n'mimeType'?: string;\n'path'?: string;\n'type'?: BookDetailVoType;\n      }",
  'export enum BookDetailVoType {"INTERVENTION_RUN"="INTERVENTION_RUN","CASE_CREATION_DATE"="CASE_CREATION_DATE"}',
  "export interface BookVo {\n        'address'?: string | null;\n'price'?: string;\n      }",
  "export interface BookingResponse {\n        'data': DocumentVo;\n'errors'?: ErrorInfo[];\n      }",
  "export interface Cat {\n        'age'?: number;\n'hunts'?: boolean;\n      }",
  "export interface DocumentVo {\n        'attachment'?: BookDetailVo;\n'authorName'?: string;\n'createdDate'?: number;\n'id'?: string;\n'note'?: string;\n'title'?: string;\n      }",
  "export interface Dog {\n        'bark'?: boolean;\n'breed'?: DogBreed;\n      }",
  'export enum DogBreed {"Dingo"="Dingo","Husky"="Husky","Retriever"="Retriever","Shepherd"="Shepherd"}',
  "export interface ErrorInfo {\n        'errorMessage'?: string;\n      }",
  "export interface File {\n        'absolute'?: boolean;\n'absoluteFile'?: File;\n'absolutePath'?: string;\n'canonicalFile'?: File;\n'canonicalPath'?: string;\n'directory'?: boolean;\n'executable'?: boolean;\n'file'?: boolean;\n'freeSpace'?: number;\n'hidden'?: boolean;\n'lastModified'?: number;\n'name'?: string;\n'parent'?: string;\n'parentFile'?: File;\n'path'?: string;\n'readable'?: boolean;\n'totalSpace'?: number;\n'usableSpace'?: number;\n'writable'?: boolean;\n      }",
  "export interface FileUploadReq {\n        'file': FormData;\n      }",
  'export enum Fruit {"Apple"="Apple","Orange"="Orange","Pear"="Pear"}',
  "export interface InputStream {[key:string]:any}",
  "export interface Resource {\n        'description'?: string;\n'file'?: File;\n'filename'?: string;\n'inputStream'?: InputStream;\n'open'?: boolean;\n'readable'?: boolean;\n'uri'?: Uri;\n'url'?: Url;\n      }",
  "export interface ScheduleVo {\n        'schedules'?: BookVo[][] | null;\n'shiftId'?: string;\n'team'?: string;\n      }",
  "export interface StatusFormData {[key:string]:any}",
  "export interface Uri {\n        'absolute'?: boolean;\n'authority'?: string;\n'fragment'?: string;\n'host'?: string;\n'opaque'?: boolean;\n'path'?: string;\n'port'?: number;\n'query'?: string;\n'rawAuthority'?: string;\n'rawFragment'?: string;\n'rawPath'?: string;\n'rawQuery'?: string;\n'rawSchemeSpecificPart'?: string;\n'rawUserInfo'?: string;\n'scheme'?: string;\n'schemeSpecificPart'?: string;\n'userInfo'?: string;\n      }",
  "export interface Url {\n        'authority'?: string;\n'content'?: {[key:string]:any};\n'defaultPort'?: number;\n'deserializedFields'?: UrlStreamHandler;\n'file'?: string;\n'host'?: string;\n'path'?: string;\n'port'?: number;\n'protocol'?: string;\n'query'?: string;\n'ref'?: string;\n'serializedHashCode'?: number;\n'userInfo'?: string;\n      }",
  "export interface UrlStreamHandler {[key:string]:any}",
  "export interface UpdateBookRequest {\n        'birthCountry'?: string;\n'citizenship'?: string;\n'dateOfBirth'?: number;\n'employmentStatus'?: string;\n'ethnicity'?: string;\n'gender'?: string;\n'idNumber'?: string;\n'idType'?: string;\n'roleId'?: string;\n'spokenLanguage'?: string[];\n      }",
];
