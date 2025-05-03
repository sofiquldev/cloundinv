import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updatePassword: (newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            login: async (username: string, password: string) => {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                
                if (response.ok) {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },
            logout: () => {
                set({ isAuthenticated: false });
            },
            updatePassword: async (newPassword: string) => {
                const response = await fetch('/api/auth/update-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword }),
                });
                return response.ok;
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);