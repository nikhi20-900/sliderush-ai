import { create } from "zustand";

type AuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

