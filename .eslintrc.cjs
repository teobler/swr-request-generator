module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "esnext",
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    indent: "off",
    "prettier/prettier": ["error"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/camelcase": "off",
  },
  plugins: ["@typescript-eslint", "prettier"],
};
