import { create } from "zustand";

interface Store {
  accessToken: string | undefined;
  setAccessToken: (token: string) => void;
}

export const useToken = create<Store>((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => set({ accessToken: token }),
}));
