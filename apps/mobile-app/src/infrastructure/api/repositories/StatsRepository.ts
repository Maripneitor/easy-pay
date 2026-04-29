import { httpClient } from '../http-client';
import { NETWORK_CONFIG } from '../network.config';

export interface UserStats {
    total_spent: number;
    categories: {
        name: string;
        amount: number;
        color: string;
    }[];
    monthly_activity: {
        month: string;
        amount: number;
    }[];
}

class StatsRepository {
    async getUserStats(userId: string): Promise<UserStats> {
        try {
            const response = await httpClient.get(`${NETWORK_CONFIG.ENDPOINTS.STATS}/user/${userId}/charts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            // Mock data for fallback
            return {
                total_spent: 1250.50,
                categories: [
                    { name: 'Alimentación', amount: 450, color: '#f87171' },
                    { name: 'Transporte', amount: 300, color: '#38bdf8' },
                    { name: 'Ocio', amount: 250, color: '#fbbf24' },
                    { name: 'Otros', amount: 250.50, color: '#a855f7' },
                ],
                monthly_activity: [
                    { month: 'Ene', amount: 100 },
                    { month: 'Feb', amount: 200 },
                    { month: 'Mar', amount: 150 },
                    { month: 'Abr', amount: 300 },
                ]
            };
        }
    }
}

export const statsRepository = new StatsRepository();
