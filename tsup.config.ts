import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  splitting: false,
  target: "node16",
  clean: true,
  minify: true,
});
