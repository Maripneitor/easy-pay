const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  projectRoot,
  path.resolve(projectRoot, 'packages/domain'),
  path.resolve(projectRoot, 'packages/ui'),
];

config.resolver.extraNodeModules = {
  '@easy-pay/domain': path.resolve(projectRoot, 'packages/domain'),
  '@easy-pay/ui': path.resolve(projectRoot, 'packages/ui'),
};

module.exports = withNativeWind(config, {
  input: path.resolve(projectRoot, 'global.css'),
  projectRoot,
});
