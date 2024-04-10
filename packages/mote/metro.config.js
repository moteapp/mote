const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const extraNodeModules = {
    'modules': path.resolve(path.join(__dirname, '../../node_modules'))
};

const watchFolders = [
    path.resolve(path.join(__dirname, '../../node_modules'))
];

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: false,
          },
        }),
    },
    resolver: {
        extraNodeModules,
        nodeModulesPaths
    },
    watchFolders
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
