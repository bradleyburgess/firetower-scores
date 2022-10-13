import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/lhc.js",
    output: {
      file: "./dist/lhc.min.js",
      format: "iife",
      sourcemap: false,
      plugins: [terser()],
    },
  },
  {
    input: "./src/fts.js",
    output: {
      file: "./dist/fts.min.js",
      format: "iife",
      sourcemap: false,
      plugins: [terser()],
    },
  },
];
