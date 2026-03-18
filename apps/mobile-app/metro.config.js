const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Monitorear toda la carpeta del monorepo
config.watchFolders = [workspaceRoot];

// 2. Rutas de resolución de módulos
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Soporte para symlinks (vital para pnpm)
config.resolver.unstable_enableSymlinks = true;

// 4. Mapeo de paquetes locales (Mapping)
// Esto permite que el simulador use el código fuente (.ts) directamente
config.resolver.extraNodeModules = {
  "@easy-pay/domain": path.resolve(workspaceRoot, "packages/domain"),
  "@easy-pay/ui": path.resolve(workspaceRoot, "packages/ui"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
