# changelog

## 1.2.1
### fixes
- generate nested response type error #14

### example
- add full example #13

### chore
- add toc for readme

## 1.2.0

### **Breaking changes**
- remove useless prefix 'I' for generated interface [#10](https://github.com/teobler/swr-request-generator/issues/10)

### Feature & Fix
- fix creating excess definitions for top-level enum
  schemas [#9](https://github.com/teobler/swr-request-generator/issues/9) [@lorissikora](https://github.com/lorissikora)
- make console warning and error more focusable [#5](https://github.com/teobler/swr-request-generator/issues/5)
- support `default` fields for response schema, and support `application/json; charset=UTF-8.schema` media query for it [#7](https://github.com/teobler/swr-request-generator/issues/7)

### Source Code
- add [GitHub actions](https://github.com/teobler/swr-request-generator/actions) for CI
- migrate [jest](https://jestjs.io/) to [vitest](https://vitest.dev/)
- remove [rollup](https://rollupjs.org/) and use [tsup](https://tsup.egoist.dev/) for building [#11](https://github.com/teobler/swr-request-generator/issues/11)
- add [eslint](https://eslint.org/)
- upgrade all dependencies to latest

Thanks for [@lorissikora](https://github.com/lorissikora) help! 

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
