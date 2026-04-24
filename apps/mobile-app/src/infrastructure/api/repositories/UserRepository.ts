import { httpClient } from '../http-client';
import { NETWORK_CONFIG } from '../network.config';

class UserRepository {
    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/change-password`, {
            old_password: oldPassword,
            new_password: newPassword
        });
    }

    async toggleTwoFactor(enabled: boolean): Promise<{ qr_code?: string; secret?: string }> {
        const response = await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/2fa/toggle`, {
            enabled
        });
        return response.data;
    }

    async verifyTwoFactor(code: string): Promise<void> {
        await httpClient.post(`${NETWORK_CONFIG.ENDPOINTS.USER}/2fa/verify`, {
            code
        });
    }
}

export const userRepository = new UserRepository();
