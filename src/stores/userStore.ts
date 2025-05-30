import { create } from 'zustand';
import { Session } from 'next-auth';

interface UserState {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  session: null,
  isLoading: true,
  setSession: (session) => set({ session, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearSession: () => set({ session: null, isLoading: false }),
}));