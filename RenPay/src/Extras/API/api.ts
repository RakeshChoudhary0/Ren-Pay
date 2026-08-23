import axios from 'axios';
import { BASE_URL } from '../Constants/keys';
import { deleteToken, getToken, saveToken } from '../LocalStorage/keyStore';
import { clearUserStorage } from '../LocalStorage/UserStorage';

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Variables to handle multiple simultaneous 401 errors cleanly

let isRefreshing = false;

let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. REQUEST INTERCEPTOR: Always get the latest token dynamically
API.interceptors.request.use(
  async config => {
    try {
      const tokens = await getToken();
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    } catch (error) {
      console.error('Error attaching authorization token:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// 2. RESPONSE INTERCEPTOR: Handle Token Refreshing & Retry Queue
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle offline network scenarios
    if (!error.response) {
      console.log('Network unreachable. Falling back to offline cache.');
      error.isOffline = true;
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      // If the refresh endpoint itself returns 401, logout immediately
      if (originalRequest.url?.includes('/refresh-token')) {
        await deleteToken();
        clearUserStorage();
        return Promise.reject(error);
      }

      // Handle queued requests if refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await getToken();

        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request a new access token from backend
        const response = await axios.post(
          `${BASE_URL}auth/refresh-token`,
          { refreshToken: tokens.refreshToken },
          { timeout: 10000 },
        );

        const newAccessToken = response.data?.accessToken;

        if (newAccessToken) {
          // Store new access token alongside existing refresh token
          await saveToken(newAccessToken, tokens.refreshToken);

          // Update header and release queued requests
          API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return API(originalRequest);
        } else {
          throw new Error('Invalid refresh response structure');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await deleteToken();
        clearUserStorage();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
