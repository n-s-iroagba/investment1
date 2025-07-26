import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

// Determine base URL based on environment
export const baseURL: string = (() => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || "development"
  switch (env) {
    case "production":
      return process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "https://investment1.fly.dev/api"
    default:
      return process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:5000/api"
  }
})()

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  
  if (typeof window !== 'undefined') {
    authToken = sessionStorage.getItem('authToken');
  }
  return authToken;
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Keep for cookie fallback
});

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      clearAuthToken();
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Generic response wrapper
type ApiResponse<T> = Promise<T>

/**
 * Generic GET request
 * @param path API endpoint path
 */
export async function get<T>(path: string, config?: AxiosRequestConfig): ApiResponse<T> {
  const response: AxiosResponse<T> = await apiClient.get(path, config)
  return response.data
}

/**
 * Generic POST request
 * @param path API endpoint path
 * @param data Request payload
 */
export async function post<Req, Res>(path: string, data: Req, config?: AxiosRequestConfig): ApiResponse<Res> {
  const response: AxiosResponse<Res> = await apiClient.post(path, data, config)
  return response.data
}

/**
 * Generic PATCH request
 * @param path API endpoint path
 * @param data Request payload
 */
export async function patch<Req, Res>(path: string, data: Req, config?: AxiosRequestConfig): ApiResponse<Res> {
  const response: AxiosResponse<Res> = await apiClient.patch(path, data, config)
  return response.data
}

/**
 * Generic DELETE request
 * @param path API endpoint path
 */
export async function remove<Res>(path: string, config?: AxiosRequestConfig): ApiResponse<Res> {
  const response: AxiosResponse<Res> = await apiClient.delete(path, config)
  return response.data
}

export default apiClient