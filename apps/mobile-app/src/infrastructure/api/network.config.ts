
export const NETWORK_CONFIG = {
  // Configuración de IP detectada automáticamente (Entorno UNACH/Local)
  LOCAL_IP: '10.33.26.208',
  PORT: '8000',
  PROTO: 'http',
  
  // URL Completa
  get BASE_URL() {
    return 'http://10.33.26.208:8000';
  },

  // Tiempo de espera para peticiones
  TIMEOUT: 15000,
  
  // Endpoints específicos
  ENDPOINTS: {
    AUTH: '/api/auth',
    USER: '/api/auth', // Sincronizado con el backend unified
    GROUPS: '/api/groups',
    STATS: '/api/stats',
  }
};
