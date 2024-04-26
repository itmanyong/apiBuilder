import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: {
      index: "src/index.ts",
    },
    clean: true,
    shims: true,
    treeshake: true,
    sourcemap: true,
    splitting: false,
    minify: !options.watch,
    format: ["iife", "cjs", "esm"],
  };
});
