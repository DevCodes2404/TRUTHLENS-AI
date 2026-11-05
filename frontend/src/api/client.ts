import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse, HealthCheckResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: unknown) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const message =
      error?.response?.data?.detail ?? error?.message ?? 'An unknown error occurred';
    return Promise.reject(new Error(message));
  },
);

// ── API Functions ────────────────────────────

export async function getHealthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
  try {
    const { data } = await apiClient.get<HealthCheckResponse>('/api/v1/health');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed',
    };
  }
}
