import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get('token');
    if (!token) {
        return fail(401, { success: false, message: 'Anda tidak diautentikasi.' });
    }

    const formData = await request.formData();
    
    const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { success: false, message: errorData.message || 'Gagal membuat changelog.' });
      }

    } catch (error) {
        console.error("Error connecting to backend:", error);
        return fail(500, { success: false, message: 'Tidak bisa terhubung ke server backend.' });
    }
    
    // Jika berhasil, redirect ke halaman daftar changelogs
    throw redirect(303, '/admin/changelogs');
  }
};