import { httpClient } from '../http-client';

class UserRepository {
    async register(data: any): Promise<any> {
        const response = await httpClient.post(`/auth/register`, data);
        return response.data;
    }

    async login(data: any): Promise<any> {
        const response = await httpClient.post(`/auth/login`, data);
        return response.data;
    }

    async updateUser(userId: string, data: any): Promise<any> {
        const response = await httpClient.put(`/auth/update/${userId}`, data);
        return response.data;
    }

    async changePassword(userId: string, data: any): Promise<void> {
        await httpClient.post(`/auth/change-password/${userId}`, data);
    }

    async setupTwoFactor(userId: string): Promise<any> {
        const response = await httpClient.post(`/auth/2fa/setup/${userId}`);
        return response.data;
    }

    async verifyTwoFactor(userId: string, code: string): Promise<any> {
        const response = await httpClient.post(`/auth/2fa/verify/${userId}`, {
            code
        });
        return response.data;
    }

    async requestPasswordReset(email: string): Promise<any> {
        const response = await httpClient.post(`/auth/request-password-reset`, {
            email
        });
        return response.data;
    }
}

export const userRepository = new UserRepository();
