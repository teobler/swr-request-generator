/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      branches: 85,
      lines: 85,
      functions: 85,
      statements: 85,
    },
    reporters: ["text", "html", "clover", "json", "json-summary"],
    include: [
      "src/**/__tests__/*.test.ts",
      "!src/__types__/**",
      "!src/__tests__/**",
      "!src/index.ts",
      "!src/request/**",
    ],
  },
});
