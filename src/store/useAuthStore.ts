import { create } from 'zustand';

interface MockUser {
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: MockUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1500));
    set({
      isLoading: false,
      user: {
        name: 'Alex Morgan',
        email: 'alex@example.com',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=alex',
      },
    });
  },
  logout: () => set({ user: null }),
}));
