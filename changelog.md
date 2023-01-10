# changelog

## 1.1.0
- add support for yaml file
- add generate default request hook and default request client options
- add warning when input swagger file does not have operation id for a uniq request

## 1.0.0

### **Breaking changes**
- support `useSWRMutation` for mutation request
  - previous: use `axios.request` for mutation request
  - now: use `useSWRMutation` hook as a wrapper, use `axios` as request client
- rename `useSWR` wrapper from  `useRequest` to `useGetRequest`
- support oneOf/anyOf/allOf in openAPI spec

### Other changes
- add new wrapper function demo `useMutationRequest` in `example/src/request/useMutationRequest`
- fix wrong rewrite behavior for request/response
  - previous version will rewrite all the key in request and response to camelCase, this version fixed this wrong behavior, all the variables will follow backend definition
- clean up `any` types in source code
- rewrite example folder as a independent project, can be easily understand how to use this lib

## 0.7.4

- upgrade all dependencies

## 0.7.3

- (new feature) support nullable schema
- (minor change) remove useless `keyof typeof` keyword for enum type
  - previous: `{ someField: keyof typeof EnumType }`
  - now: `{ someField: EnumType }`
- (bug fix) fix cannot generate enum type in definition issue
