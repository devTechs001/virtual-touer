import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
