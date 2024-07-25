import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/helpers/**/*"],
  format: ["cjs", "esm"],
  outDir: "dist",
  splitting: false,
  clean: true,
  dts: true,
});
