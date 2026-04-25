
export const NETWORK_CONFIG = {
  // Configuración de IP detectada automáticamente (Entorno UNACH/Local)
  LOCAL_IP: '192.168.1.6',
  PORT: '8000',
  PROTO: 'http',
  
  // URL Completa
  get BASE_URL() {
    return `${this.PROTO}://${this.LOCAL_IP}:${this.PORT}`;
  },

  // Tiempo de espera para peticiones
  TIMEOUT: 15000,
  
  // Endpoints específicos
  ENDPOINTS: {
    AUTH: '/auth',
    USER: '/user',
    GROUPS: '/groups',
    STATS: '/stats',
  }
};
