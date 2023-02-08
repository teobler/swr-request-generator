/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      "src/**/__tests__/*.test.ts",
      "!src/__types__/**",
      "!src/__tests__/**",
      "!src/index.ts",
      "!src/request/**",
    ],
  },
});
