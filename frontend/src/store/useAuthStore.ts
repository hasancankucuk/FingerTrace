import type { AuthState } from "@/models/Authstate";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => {
        if (token) localStorage.setItem("access_token", token);
        else localStorage.removeItem("access_token");
        set({ token });
      },
      logout: () => {
        localStorage.removeItem("access_token");
        set({ token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        token: state.token,
        setToken: state.setToken,
        logout: state.logout,
      }),
    }
  )
);
