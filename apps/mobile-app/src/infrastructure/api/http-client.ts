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
        if (error.response?.status === 401) {
            await TokenStorage.clear();
        }

        return Promise.reject(error);
    }
);
