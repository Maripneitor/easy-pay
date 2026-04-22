module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
            "react-native-worklets": "./src/worklets-shim",
            "moti": "./src/moti-shim"
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
