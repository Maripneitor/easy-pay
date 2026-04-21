import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TokenStorage } from '../security/TokenStorage';

const getAuthToken = async (): Promise<string | null> => {
    return await TokenStorage.getToken();
};


// URL de la API — En mobile usamos la IP detectada por el contenedor o localhost por defecto
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; 

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
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await TokenStorage.clear();
            // TODO: Navigate to Auth screen via dynamic dispatch if possible
        }

        return Promise.reject(error);
    }
);
