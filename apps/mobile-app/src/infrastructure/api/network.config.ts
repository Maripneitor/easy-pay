import Constants from 'expo-constants';

export function getApiBaseUrl() {
    // 1. Producción o variable explícita (.env)
    if (process.env.EXPO_PUBLIC_API_URL) {
        const url = process.env.EXPO_PUBLIC_API_URL;
        return url.endsWith('/api') ? url : `${url}/api`;
    }
    
    // 2. Detección automática en LAN (Dispositivos físicos vía Expo)
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:8001/api`;
    }
    
    // 3. Fallback para Simulador iOS o localhost
    return 'http://localhost:8001/api';
}

export const NETWORK_CONFIG = {
  get BASE_URL() {
    return getApiBaseUrl();
  },
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: '/auth',
    USER: '/auth', 
    GROUPS: '/groups',
    STATS: '/stats',
  }
};
