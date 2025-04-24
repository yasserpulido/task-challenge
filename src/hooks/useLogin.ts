import { useAuthStore } from "../store/useAuthStore";

export const useLogin = () => {
  return useAuthStore((state) => state.login);
};
