import { useToken } from "@/stores/token";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const accessToken = useToken.getState().accessToken;

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
        const { data } = await axios.post<{ accessToken: string }>(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;

        const setAccessToken = useToken.getState().setAccessToken;
        setAccessToken(newAccessToken);

        if (originalRequest)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        console.error(error);
      }
    }

    return Promise.reject(error);
  }
);
