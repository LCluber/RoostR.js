module.exports = api => {
  api.cache(true);
  return {
    presets: [
      [
        "@babel/env",
        {
          debug: true,
          targets: {
            ie: 9,
            browsers: "cover 99.5%",
            esmodules: false
          },
          loose: true
        }
      ]
    ],
    plugins: [
      // "@babel/plugin-external-helpers"
    ]
  };
};
