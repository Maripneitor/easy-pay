import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'ep_auth_token';

export const setAuthToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};

const getAuthToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// URL de la API — En mobile usualmente usamos la IP de la máquina si es local
const API_BASE_URL = 'http://localhost:8000'; 

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
            await clearAuthToken();
            // TODO: Navigate to Auth screen via dynamic dispatch if possible
        }
        return Promise.reject(error);
    }
);
