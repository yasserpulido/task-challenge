import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        if (email && password) {
          set({ user: { email } });
        } else {
          throw new Error("Invalid credentials");
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-store",
    }
  )
);
