import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe } from '../services/auth.service';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('lifeline_access_token', accessToken);
        localStorage.setItem('lifeline_refresh_token', refreshToken);
        set({ accessToken, refreshToken });
      },

      setUser: (user) => set({ user }),

      loginSuccess: (user, accessToken, refreshToken) => {
        localStorage.setItem('lifeline_access_token', accessToken);
        localStorage.setItem('lifeline_refresh_token', refreshToken);
        set({ user, accessToken, refreshToken, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('lifeline_access_token');
        localStorage.removeItem('lifeline_refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
      },

      initialize: async () => {
        const token = localStorage.getItem('lifeline_access_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }
        try {
          const { data } = await getMe();
          set({ user: data.user, accessToken: token, isLoading: false });
        } catch {
          localStorage.removeItem('lifeline_access_token');
          localStorage.removeItem('lifeline_refresh_token');
          set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
        }
      },

      isAuthenticated: () => !!get().user,
      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: 'lifeline-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
);

export default useAuthStore;
