// Mengimpor 'error' helper dari SvelteKit untuk penanganan error HTTP yang lebih baik
import { error } from '@sveltejs/kit';
// Tetap menggunakan environment variable untuk URL backend, ini sudah benar
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;

  try {
    const response = await fetch(endpoint);

    // Menggunakan 'error' helper untuk memberikan response error yang sesuai
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data changelogs' }));
      throw error(response.status, errorData.message);
    }

    const changelogs = await response.json();
    return { changelogs };
  } catch (e) {
    // Mengadopsi blok 'catch' yang lebih aman dan detail dari file +page.js Anda
    if (
        e &&
        typeof e === 'object' &&
        'status' in e &&
        typeof e.status === 'number' &&
        'body' in e &&
        e.body &&
        typeof e.body === 'object' &&
        'message' in e.body &&
        typeof e.body.message === 'string'
    ) {
        throw error(e.status, e.body.message);
    }

    if (e instanceof Error) {
        throw error(500, `Gagal memuat data: ${e.message}`);
    }
    
    throw error(500, 'Gagal memuat data karena kesalahan tidak diketahui.');
  }
}