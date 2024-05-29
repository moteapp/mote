const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const moteBundlePath = path.resolve(path.join(__dirname, './dist/createMoteEditor.bundle'));

const localPackages = {
    '@mote/editor': path.resolve(path.join(__dirname, '../mote-editor')),
    '@mote/base': path.resolve(path.join(__dirname, '../mote-base')),
    '@mote/platform': path.resolve(path.join(__dirname, '../mote-platform')),
    'vs': path.resolve(path.join(__dirname, '../vs')),
}

const extraNodeModules = {
    'modules': path.resolve(path.join(__dirname, '../../node_modules'))
};

const nodeModulesPaths = [
    path.resolve(path.join(__dirname, './node_modules')),
]

const watchFolders = [
    path.resolve(path.join(__dirname, '../../node_modules'))
];
for (const [, v] of Object.entries(localPackages)) {
	watchFolders.push(v);
}

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
        nodeModulesPaths,
        extraNodeModules
    },
    watchFolders
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
