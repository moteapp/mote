module.exports = {
  presets: [
    'module:@react-native/babel-preset',
  ],
  plugins: [
    
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['babel-plugin-parameter-decorator'],
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          root: ['.'],
          // This needs to be mirrored in tsconfig.json
          mote: "./src",
          "@mote/editor": "../mote-editor/src",
          "@mote/base": "../mote-base/src",
          "@mote/platform": "../mote-platform/src",
        },
      },
    ],
  ]
};
