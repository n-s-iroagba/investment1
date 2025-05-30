import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

// Determine base URL based on environment
export const baseURL: string = (() => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || "development"
  switch (env) {
    case "production":
      return process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "https://investment1.fly.dev"
    default:
      return process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:5000/api"
  }
})()

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ This goes here
});

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
