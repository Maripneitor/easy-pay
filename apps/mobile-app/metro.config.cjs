const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/utils/metro');
const path = require('path');

// Encontrar la raíz del proyecto y del monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Configurar WatchFolders para ver todo el monorepo (especialmente packages/)
config.watchFolders = [workspaceRoot];

// 2. Forzar la resolución de node_modules tanto en la app como en la raíz
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Asegurar que Metro priorice las dependencias del monorepo
config.resolver.disableHierarchicalLookup = true;

// 4. Configurar transformadores adicionales si fuera necesario (opcional para SDK 54)
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Exportar con NativeWind v4
module.exports = withNativeWind(config, { input: './global.css' });
