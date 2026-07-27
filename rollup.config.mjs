
const config =  {
  input: "build/es6/roostr.js",
  output: {
    name: "roostr",
    file: "build/roostr.js",
    format: "es"
  },
  external: [
    "@lcluber/type6js"
  ],
  plugins: []
};

export default config;
