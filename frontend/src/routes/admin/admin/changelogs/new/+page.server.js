import { redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get('token');
    const formData = await request.formData();

    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      content: formData.get('content')
    };
    
    const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Jika ada error dari backend, kita bisa menampilkannya
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Gagal mempublikasikan.' };
      }

    } catch (error) {
        return { success: false, message: 'Tidak bisa terhubung ke server.' };
    }
    
    // Jika berhasil, redirect ke halaman daftar changelog
    throw redirect(303, '/admin/changelogs');
  }
};