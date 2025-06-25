import { writable } from 'svelte/store';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user?: { id: number; name: string; role: string };
}
export const authStore = writable<AuthState>({
  isAuthenticated: false,
  token: null,
  user: undefined
});