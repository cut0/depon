import { type BuildOptions, build } from "esbuild";

// core's common options
const coreOptions: BuildOptions = {
  entryPoints: ["./src/core/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "node",
  target: "esnext",
} as const;

// cli's common options
const cliOptions: BuildOptions = {
  entryPoints: ["./src/cli/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "node",
  target: "esnext",
} as const;

Promise.all([
  build({
    ...coreOptions,
    format: "esm",
    outfile: "./dist/core/index.mjs",
  }),
  build({
    ...coreOptions,
    format: "cjs",
    outfile: "./dist/core/index.js",
  }),
  build({
    ...cliOptions,
    format: "esm",
    outfile: "./dist/cli/index.mjs",
  }),
]).catch(() => process.exit(1));
