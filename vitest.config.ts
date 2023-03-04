/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      branches: 90,
      lines: 90,
      functions: 90,
      statements: 90,
      reporter: ["text", "html", "clover", "json", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: ["src/constants.ts", "src/**/__tests__/**"],
    },
    include: ["src/**/__tests__/*.test.ts"],
  },
});
