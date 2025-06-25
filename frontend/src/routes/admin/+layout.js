import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {

  if (browser) {
    try {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/api/auth/profile`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw redirect(307, '/login');
      }

      const user = await response.json();

      if (user.role !== 'admin') {
        throw redirect(307, '/');
      }
      return { user };
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) {
        throw error;
      }
      console.error("Gagal memvalidasi sesi:", error);
      throw redirect(307, '/login');
    }
  }
  return {
    user: null
  };
}