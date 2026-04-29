import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TokenStorage } from '../security/TokenStorage';

import { NETWORK_CONFIG } from './network.config';

const getAuthToken = async (): Promise<string | null> => {
    return await TokenStorage.getToken();
};


// URL de la API — Usando la configuración de red centralizada
const API_BASE_URL = NETWORK_CONFIG.BASE_URL;

export const httpClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // --- MOCK MODE LOGIC ---
        if (process.env.EXPO_PUBLIC_USE_MOCKS === 'true') {
            console.log(`🛠️ [MOCK MODE] Intercepting request to: ${config.url}`);
            
            // Simulation of different endpoints
            if (config.url?.includes('/api/groups/user/')) {
                const mockGroups = require('../../../assets/mocks/groups.json');
                return Promise.reject({
                    config,
                    response: { data: mockGroups, status: 200, statusText: 'OK', headers: {}, config }
                });
            }
            if (config.url?.includes('/balances')) {
                const mockBalances = require('../../../assets/mocks/balances.json');
                return Promise.reject({
                    config,
                    response: { data: mockBalances, status: 200, statusText: 'OK', headers: {}, config }
                });
            }
            if (config.url?.includes('/items')) {
                const mockItems = require('../../../assets/mocks/items.json');
                return Promise.reject({
                    config,
                    response: { data: mockItems, status: 200, statusText: 'OK', headers: {}, config }
                });
            }
            // Add more mock handlers as needed
        }

        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        // Handle mock responses that were rejected in the request interceptor
        if (error.response && error.response.status === 200) {
            return error.response;
        }

        if (error.response?.status === 401) {
            await TokenStorage.clear();
        }

        return Promise.reject(error);
    }
);
