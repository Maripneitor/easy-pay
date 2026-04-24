
export const NETWORK_CONFIG = {
  // Configuración de IP detectada automáticamente
  BASE_IP: '192.168.1.10',
  PORT: '8000',
  PROTO: 'http',
  
  // URL Completa
  get BASE_URL() {
    return `${this.PROTO}://${this.BASE_IP}:${this.PORT}`;
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
