import { create } from "zustand";
import type { CurrentUser } from "@/features/authentication/types/auth.types";

interface UserState {
  readonly user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
