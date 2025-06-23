import { redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, fetch }) {

  // 3. Jika ada token, minta backend untuk verifikasi
  const response = await fetch(`${PUBLIC_BACKEND_URL}/api/auth/profile`, {
     credentials: 'include'
  });

  // 4. Jika token tidak valid (backend mengembalikan error), hapus cookie & paksa ke login
  if (!response.ok) {
    cookies.delete('token', { path: '/' });
    throw redirect(307, '/login');
  }
  
  const user = await response.json();

  // 5. Otorisasi: Pastikan rolenya admin
  if (user.role !== 'admin') {
    // Jika bukan admin, lempar ke halaman utama (tidak boleh masuk area admin)
    throw redirect(307, '/');
  }

  // 6. Jika semua aman, izinkan masuk
  return { user };
}