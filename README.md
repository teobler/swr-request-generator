# Redux Action Generator

[![Build Status](https://img.shields.io/travis/reeli/ts-codegen.svg?style=flat-square&branch=master)](https://travis-ci.org/reeli/ts-codegen)
[![codecov](https://codecov.io/gh/reeli/ts-codegen/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/reeli/ts-codegen)
[![License](https://img.shields.io/npm/l/@ts-tool/ts-codegen.svg?style=flat-square)](https://npmjs.org/package/@ts-tool/ts-codegen)

This tool can generate redux request actions and related interface from swagger.

it can avoid duplicate of template code for redux request actions.

# Configuration
create a new json file named `ts-codegen.config.json` in your project root directory

```json
{
  // your output directory
  "output": ".output",
  // import your own requestActionCreator
  "actionCreatorImport": "import { createRequestAction } from 'examples/requestActionCreators';\n\n",
  // your project swagger online address
  "clients": ["https://app.swaggerhub.com/apiproxy/registry/teobler/integration-example/1.0.0"],
  // swagger offline file path
  "data": ["./examples/swagger.json"]
}
```

# Start
1. `npm install`
2. Configure your own ts-codegen.config.json
3. Run cli `ts-codegen`
