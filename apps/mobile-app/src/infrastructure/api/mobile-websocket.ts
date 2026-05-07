import { getApiBaseUrl } from './network.config';

class MobileWebSocketClient {
    private ws: WebSocket | null = null;
    private baseURL: string;

    constructor() {
        let apiBase = getApiBaseUrl();
        // Limpieza profunda para evitar duplicados /api/api
        if (apiBase.endsWith('/api')) {
            apiBase = apiBase.slice(0, -4);
        }
        this.baseURL = apiBase.replace(/^http/, 'ws');
    }

    connect(groupId: string, token: string) {
        if (this.ws) this.disconnect();

        // Aseguramos que la ruta final sea exactamente /api/ws/groups
        const wsUrl = `${this.baseURL}/api/ws/groups/${groupId}?token=${token}`;
        console.info(`[WS-Mobile] Conectando a: ${wsUrl}`);
        
        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log(`[WS] Conectado al grupo: ${groupId}`);
            };

            this.ws.onerror = (e) => {
                console.error(`[WS] Error en conexión:`, e);
            };

            this.ws.onclose = () => {
                console.log(`[WS] Desconectado del grupo: ${groupId}`);
            };
        } catch (e) {
            console.error("[WS] Error al crear WebSocket:", e);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.ws) return;
        this.ws.addEventListener('message', (messageEvent) => {
            try {
                const data = JSON.parse(messageEvent.data as string);
                // El backend envía un objeto con { event: string, payload: any }
                if (data.event === event) {
                    callback(data.payload);
                } else if (!data.event) {
                    // Fallback para mensajes que son directamente el objeto Grupo
                    callback(data);
                }
            } catch (err) {
                console.error("[WS] Error parseando mensaje", err);
            }
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const wsClient = new MobileWebSocketClient();
