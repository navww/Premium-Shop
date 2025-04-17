import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        set({ isAuthenticated: false });
        // Clear cart when logging out
        useCartStore.getState().clearCart();
      },
      hasHydrated: false,
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: (state) => {
        return () => {
          // @ts-expect-error Zustand store API is available here
          (state as any)?.setState?.({ hasHydrated: true });
        };
      },
    }
  )
);
