import { getDefaultConfig } from 'expo/metro-config';
import { withNativeWind } from 'nativewind/utils/metro';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Obtener la ruta del archivo actual de forma compatible con ESM y Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 2. Configurar WatchFolders para el monorepo
config.watchFolders = [workspaceRoot];

// 3. Resolución de node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = true;

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// 4. Exportar con NativeWind v4 usando export default (ESM)
export default withNativeWind(config, { input: './global.css' });
