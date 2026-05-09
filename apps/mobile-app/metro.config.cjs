const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Usamos CommonJS (.cjs) para evitar que el cargador ESM de Windows se confunda con las rutas 'C:'
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Ver todas las carpetas del monorepo
config.watchFolders = [workspaceRoot];

// 2. Forzar a Metro a buscar módulos en el orden correcto (raíz primero para unificar)
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  'react-native-safe-area-context': path.resolve(workspaceRoot, 'node_modules/react-native-safe-area-context'),
  'react-native-screens': path.resolve(workspaceRoot, 'node_modules/react-native-screens'),
  'react-native-reanimated': path.resolve(workspaceRoot, 'node_modules/react-native-reanimated'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
};

// Evitar que Metro encuentre duplicados en carpetas anidadas
config.resolver.blockList = [
  /.*\/apps\/mobile-app\/node_modules\/.*/,
];

// 3. Configuración para NativeWind 4
module.exports = withNativeWind(config, { input: './global.css' });
