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
const getDynamicApiUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL;
    
    // Si no está definido o es localhost en Docker, usar el host actual
    if (!url || url.includes('localhost')) {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        url = isLocal ? 'http://localhost:5173' : `${window.location.protocol}//${window.location.hostname}:5173`;
    }
    
    // Asegurar que siempre termine en /api para los repositorios
    const base = url.replace(/\/api\/?$/, '');
    return `${base}/api`;
};

export const httpClient: AxiosInstance = axios.create({
    baseURL: getDynamicApiUrl(),
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
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/register');
        
        if (error.response?.status === 401 && !isAuthEndpoint) {
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
