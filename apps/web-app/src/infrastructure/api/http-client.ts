import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ─── Token helpers ────────────────────────────────────────────────────────────
const AUTH_TOKEN_KEY = 'ep_auth_token';

export const setAuthToken = (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

const getAuthToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

// ─── Axios instance ───────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

if (!import.meta.env.VITE_API_URL) {
    console.warn('[http-client] VITE_API_URL is not defined — falling back to http://localhost:8000');
}

export const httpClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json',
    },
});

// ─── Request interceptor — inject Authorization header ────────────────────────
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// ─── Response interceptor — normalize errors ──────────────────────────────────
httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear and redirect to auth
            clearAuthToken();
            window.location.href = '/auth';
        }

        // Normalize error message for UI consumption
        const message =
            (error.response?.data as Record<string, string>)?.detail ??
            (error.response?.data as Record<string, string>)?.message ??
            error.message ??
            'Error desconocido';

        return Promise.reject(new Error(message));
    }
);
