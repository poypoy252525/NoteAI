import { create } from "zustand";

interface Store {
  accessToken: string | undefined;
  user: { email: string; userId: string } | undefined;
  setAuth: (
    accessToken: string,
    user: { email: string; userId: string }
  ) => void;
  clearAuth: () => void;
}

export const useAuth = create<Store>((set) => ({
  accessToken: undefined,
  user: undefined,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: undefined, user: undefined }),
}));
