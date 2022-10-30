# SWR request generator

This tool can generate [SWR](https://swr.vercel.app/) request and related request params and response interface from swagger.

it will generate all GET request via SWR and others will be [axios](https://www.axios.com/).

# Dependencies

if you want to use this tool, your project should be:

1. your back end API should use swagger and OpenAPI 3.0 standard
2. your front end client should be axios
3. use SWR as data fetching lib for your front end web app

# How to use
## install

```bash
npm install -D @openapi-integration/swr-request-generator
```

or

```bash
yarn add -D @openapi-integration/swr-request-generator
```

## Configuration
### script

add a npm script to your package.json file:

```json
{
  "scripts": {
    "codegen": "ts-codegen"
  }
}
```

### config file

create a new json file named `ts-codegen.config.json` in your project root directory like this

```json
{
  "output": "src/request",
  "fileHeaders": [
    "/* eslint-disable @typescript-eslint/explicit-module-boundary-types */",
    "/* eslint-disable @typescript-eslint/no-explicit-any */",
    "import { ISWRConfig, useGetRequest } from './useGetRequest';",
    "import { IResponseError } from \"../../constants/error\";",
    "import { client } from \"./client\";"
  ],
  "clients": ["https://app.swaggerhub.com/apiproxy/registry/teobler/integration-example/1.0.0"],
  "fileName": "api",
  "data": ["./examples/openAPI.json"]
}
```

fields meaning:
 - output(string): output file dir
 - fileName(string): output filename
 - fileHeaders(string[]): strings in this array will be placed in output file beginning
 - clients(string[]): your swagger urls
 - data(string[]): your local swagger json file dirs

### Run it!

1. Find an address where you can get your back-end API swagger json file (either online or local), it should be an url can get swagger json response
2. Fill this address into the `clients array` of the above configuration file. If you have multiple addresses, fill in multiple string addresses.
3. If you can only download the swagger json file, that's fine, just put the json file into your project and fill in your file path in the data field of the config file.
4. Run `npm run codegen` then you can find output file in your output dir

> if your swagger url need basic auth, just run `npm run codegen -- -a "Basic #basicAuthHeader"`

## example

all the details can be found in example folder.

clone this repo

run `npm i` to install all dependency

then run `bin/ts-codegen.js` can generate api file in `example/request/api.ts`

how to use this file can be found in page.tsx 

## changelog
[changelog](changelog.md)
