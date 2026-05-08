const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/utils/metro');

// Usamos CommonJS (.cjs) para evitar que el cargador ESM de Windows se confunda con las rutas 'C:'
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
