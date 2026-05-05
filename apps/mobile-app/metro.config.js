const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Monitorear toda la carpeta del monorepo
config.watchFolders = [workspaceRoot];

// 2. Rutas de resolución de módulos - Priorizar la raíz
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, "node_modules"),
  path.resolve(projectRoot, "node_modules"),
];

// 3. Soporte para symlinks (vital para npm workspaces)
config.resolver.unstable_enableSymlinks = true;

// 4. Mapeo de paquetes locales y FORZADO de instancia única de React
const extraNodeModules = {
  "@easy-pay/domain": path.resolve(workspaceRoot, "packages/domain"),
  "@easy-pay/ui": path.resolve(workspaceRoot, "packages/ui"),
  "react": path.resolve(workspaceRoot, "node_modules/react"),
  "react-dom": path.resolve(workspaceRoot, "node_modules/react-dom"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
  "@types/react": path.resolve(workspaceRoot, "node_modules/@types/react"),
  "react-native-reanimated": path.resolve(workspaceRoot, "node_modules/react-native-reanimated"),
};

config.resolver.extraNodeModules = extraNodeModules;
config.resolver.blockList = [
  /apps\/mobile-app\/node_modules\/react\/.*/,
  /apps\/mobile-app\/node_modules\/react-dom\/.*/,
  /apps\/mobile-app\/node_modules\/react-native\/.*/,
];

// 5. Verificación de versiones (Debug en consola de Metro)
console.log("⚛️ Metro Config: Forzando React desde:", extraNodeModules.react);

module.exports = withNativeWind(config, { input: "./global.css" });
