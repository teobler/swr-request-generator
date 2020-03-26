# Redux Action Generator

This tool can generate redux request actions and related interface from swagger.

it can avoid duplicate of template code for redux request actions.

# Configuration
create a new json file named `ts-codegen.config.json` in your project root directory

```json
{
  "output": ".output",
  "actionCreatorImport": "import { createRequestAction } from 'examples/requestActionCreators';\n\n",
  "clients": ["https://app.swaggerhub.com/apiproxy/registry/teobler/integration-example/1.0.0"],
  "data": ["./examples/openAPI.json"]
}
```

- output: your output directory
- actionCreatorImport: import your own requestActionCreator
- clients: your project swagger online address
- data: swagger offline file path

# Start
1. `npm install`
2. Configure your own ts-codegen.config.json
3. Run cli `ts-codegen`

# Note
1. This repo is forked from [ts-codegen](https://github.com/reeli/ts-codegen) by [@reeli](https://github.com/reeli)
2. This tool only for swagger v3 now
