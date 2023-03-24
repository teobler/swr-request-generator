<div align="center">

<h1 align="center">SWR Request Generator</h1>

<a href="https://github.com/teobler/swr-request-generator/actions">![build](https://img.shields.io/github/actions/workflow/status/teobler/swr-request-generator/build.yaml)</a>
<a href="https://github.com/teobler/swr-request-generator/actions">![cov](https://teobler.github.io/swr-request-generator/badges/coverage.svg)</a>
<a href="https://github.com/teobler/swr-request-generator/blob/main/LICENSE">![license](https://img.shields.io/github/license/teobler/swr-request-generator)</a>

</div>

This tool can generate [SWR](https://swr.vercel.app/) request and related request params and response interface from swagger.

Because SWR will support mutation request like POST/UPDATE... since [version 2.x](https://github.com/vercel/swr/discussions/1919).

Then SWR request generator will generate these requests through SWR as well since version 1.0.

You can get more info about the change between 0.x and 1.0 via [changelog](changelog.md).

## ❗ Dependencies

if you want to use this tool, your project should be:

1. your back end API should use swagger and OpenAPI 3.0 standard
2. your front end client should be [axios](https://github.com/axios/axios)
3. use SWR as data fetching lib for your front end web app

## ❓ You Are Using SWR Already, Why Still With Axios?

Personally I think axios is a good request client library which can provide better development experience.

Just like you can easily add your own interceptor, etc.

And SWR mutation request need a `fetcher` to be request client, I think axios could be a good choice.

But on the other side, axios do increase the size of the packaged code, this could be a cons for using axios.

If many requirements in the future for a `fetch` version, maybe I can extend it with any client.

And if anyone want to make it happen, it should be super cool 🥳

## 🧰 How to Use
### 🛠 Install

```bash
pnpm install -D @openapi-integration/swr-request-generator
```

or

```bash
yarn add -D @openapi-integration/swr-request-generator
```

or

```bash
npm install -D @openapi-integration/swr-request-generator
```

### 🔧 Configuration
#### ☄️ Script

add a npm script to your package.json file:

```json
{
  "scripts": {
    "codegen": "ts-codegen"
  }
}
```

#### 📁 Config File

create a new json file named `ts-codegen.config.json` in your project root directory like this

```json
{
  "output": "src/request",
  "fileHeaders": [
    "/* eslint-disable @typescript-eslint/explicit-module-boundary-types */",
    "/* eslint-disable @typescript-eslint/no-explicit-any */",
    "import { SWRConfig, useGetRequest } from \"./useGetRequest\"",
    "import { ResponseError } from \"../types\"",
    "import { AxiosRequestConfig, AxiosResponse } from \"axios\"",
    "import { SWRMutationConfig, useMutationRequest } from \"src/request/useMutationRequest\";"
  ],
  "clients": ["https://app.swaggerhub.com/apiproxy/registry/teobler/integration-example/1.0.0"],
  "fileName": "api",
  "data": ["./examples/openAPI.json"],
  "needRequestHook": true,
  "needClient": true
}
```

fields meaning:
 - output(string): output file dir
 - fileName(string): output filename
 - fileHeaders(string[]): strings in this array will be placed in output file beginning
 - clients(string[]): your swagger urls
 - data(string[]): your local swagger json/yaml file path
 - needRequestHook(boolean): if need to generate default request hook(useGetRequest and useMutationRequest)
 - needClient(boolean): if need to generate default request axios client

#### 🤩 Run It!

1. Find an address where you can get your back-end API swagger json file (either online or local), it should be an url can get swagger json response
2. Fill this address into the `clients array` of the above configuration file. If you have multiple addresses, fill in multiple string addresses.
3. If you can only download the swagger json file, that's fine, just put the json file into your project and fill in your file path in the data field of the config file.
4. Run `npm run codegen` then you can find output file in your output dir

> if your swagger url need basic auth, just run `npm run codegen -- -a "Basic #basicAuthHeader"`

### 👀 Example

all the details can be found in example folder.

clone this repo.

```bash
cd example && pnpm install
```

after installing all dependencies you can run

```bash
pnpm run codegen
```

then swr request generator will generate api file in `src/request/api.ts`.

and it's source is `swagger/opanAPI.json`, you can find more info in `ts-codegen.config.json` file.

how to use this file can be found in `src/APP.tsx`.

### 💁‍ Tip
Wrapper functions in example folder like `useGetRequest` and `useMutationRequest` just one of the implementation.

You can use your own wrapper functions and error types as well, just ensure your function name and error type are aligned with demo, since generated function will use these names.

## 💻 Local Development

Clone this repo, run `pnpm install` to install all dependencies.

Copy this config file to your root dir:
```json
{
  "output": "example/src/request",
  "fileHeaders": [
    "/* eslint-disable @typescript-eslint/explicit-module-boundary-types */",
    "/* eslint-disable @typescript-eslint/no-explicit-any */",
    "import { SWRConfig, useGetRequest } from \"./useGetRequest\"",
    "import { ResponseError } from \"../types\"",
    "import { AxiosRequestConfig, AxiosResponse } from \"axios\"",
    "import { SWRMutationConfig, useMutationRequest } from \"src/request/useMutationRequest\";"
  ],
  "clients": [],
  "data": ["./example/swagger/openAPI.yaml"],
  "fileName": "api",
  "needRequestHook": true,
  "needClient": true
}
```

Then run `pnpm run start` to generate request file to example folder, modify code you want and see the results.

And there are some test cases in `__tests__` folder, you can run `pnpm run test` to see the results and help you modify the code.

## 🗂 Changelog
[changelog](changelog.md)

## 🤗 Appreciation

I would be very grateful if you could give this project a star!
