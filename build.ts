import { type BuildOptions, build } from "esbuild";

// 共通のオプション
const commonOptions: BuildOptions = {
  entryPoints: ["./src/core/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "node",
  target: "esnext",
} as const;

Promise.all([
  build({
    ...commonOptions,
    format: "esm",
    outfile: "./dist/index.mjs",
  }),
  build({
    ...commonOptions,
    format: "cjs",
    outfile: "./dist/index.js",
  }),
]).catch(() => process.exit(1));
