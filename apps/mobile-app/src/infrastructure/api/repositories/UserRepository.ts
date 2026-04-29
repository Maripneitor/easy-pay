import { httpClient } from '../http-client';
import { NETWORK_CONFIG } from '../network.config';

class UserRepository {
    async register(data: any): Promise<any> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/register`, data);
        return response.data;
    }

    async login(data: any): Promise<any> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/login`, data);
        return response.data;
    }

    async updateUser(userId: string, data: any): Promise<any> {
        const response = await httpClient.put(`${NETWORK_CONFIG.ENDPOINTS.USER}/update/${userId}`, data);
        return response.data;
    }

    async changePassword(userId: string, data: any): Promise<void> {
        await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/change-password/${userId}`, data);
    }

    async setupTwoFactor(userId: string): Promise<any> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/2fa/setup/${userId}`);
        return response.data;
    }

    async verifyTwoFactor(userId: string, code: string): Promise<any> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/2fa/verify/${userId}`, {
            code
        });
        return response.data;
    }

    async requestPasswordReset(email: string): Promise<any> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/request-password-reset`, {
            email
        });
        return response.data;
    }
}

export const userRepository = new UserRepository();
