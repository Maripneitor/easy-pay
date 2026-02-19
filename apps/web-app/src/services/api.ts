// src/services/api.ts
// El equipo de backend solo tendrá que venir a este archivo y reemplazar 
// estos "mocks" por su conexión real con FastAPI.

// src/services/api.ts

// Helper type for standard API response
export interface ApiResponse<T> {
    data: T | null;
    status: number;
    error?: string;
}

// Environment Check
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.warn("VITE_API_URL is not defined in .env");

// Helper to simulate network latency (1-2 seconds)
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const groupService = {
    getAllGroups: async (): Promise<ApiResponse<any[]>> => { // Currently any[] until we import shared types
        await delay(1500); // Simulate network

        // Mock successful response
        return {
            status: 200,
            data: [
                { id: 1, name: "Viaje a la playa", total: 1500 },
                { id: 2, name: "Cena de cumpleaños", total: 500 }
            ]
        };
    },

    createGroup: async (groupData: any): Promise<ApiResponse<{ success: boolean }>> => {
        await delay(2000); // Simulate network (slower for write ops)

        console.log(`[POST] ${API_URL}/groups`, groupData);

        // Mock success
        return {
            status: 201, // Created
            data: { success: true }
        };

        // Uncomment to test error handling:
        /*
        return {
            status: 500,
            data: null,
            error: "Error interno del servidor simulado"
        };
        */
    }
};
