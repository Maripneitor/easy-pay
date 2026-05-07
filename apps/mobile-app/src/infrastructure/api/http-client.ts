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
        // No enviar token en peticiones de login o registro
        const isAuthPath = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        
        if (!isAuthPath) {
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        if (error.response?.status === 401) {
            await TokenStorage.clear();
            await AsyncStorage.removeItem('user_data');
        }

        return Promise.reject(error);
    }
);
