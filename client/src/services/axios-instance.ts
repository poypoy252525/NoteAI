import { useAuth } from "@/stores/auth";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;
    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post<{
          accessToken: string;
          user: { email: string; userId: string };
        }>("/auth/refresh", {}, { withCredentials: true });

        const newAccessToken = data.accessToken;

        const setAuth = useAuth.getState().setAuth;
        setAuth(newAccessToken, data.user);

        if (originalRequest)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        console.error(error);
      }
    }

    return Promise.reject(error);
  }
);
