import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const config =  {
  input: "build/es6/roostr.js",
  output: {
    name: "Roostr",
    file: "build/roostr.iife.js",
    format: "iife"
  },
  external: [], // <-- bundle @lcluber/type6js into the standalone build
  plugins: [
    resolve(),
    // commonjs(),
    babel({
      // exclude: "node_modules/**" // only transpile our source code
    })
  ]
};

export default config;
