import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export async function apiRequest<T = any>(
  url: string,
  method: AxiosRequestConfig["method"] = "GET",
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const response = await api.request<T>({
    url,
    method,
    data,
    ...config,
  });

  return response.data;
}

export default api;
