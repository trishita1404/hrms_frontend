import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}

// --- PRODUCTION READY BASE URL ---
// This looks for VITE_API_URL in your .env or Vercel settings.
// It defaults to localhost for your local work.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach token to every outgoing request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 2. Response Interceptor: Handle 401 errors and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      isRefreshing = false;
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      // Notice we use the defaults.baseURL which now correctly points to Render in production
      axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
        .then((res) => {
          const accessToken = res.data.accessToken || 
                              res.data.data?.accessToken || 
                              res.data.user?.accessToken; 
          
          if (!accessToken) {
            throw new Error("No access token returned from server");
          }

          localStorage.setItem('accessToken', accessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          processQueue(null, accessToken);
          resolve(axiosInstance(originalRequest));
        })
        .catch((err: AxiosError) => {
          processQueue(err, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

export default axiosInstance;