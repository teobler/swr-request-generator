import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  splitting: false,
  target: "node18",
  clean: true,
  minify: true,
});
