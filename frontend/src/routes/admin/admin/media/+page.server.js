import { fail } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const endpoint = `${PUBLIC_BACKEND_URL}/api/media`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      return { media: [], error: 'Gagal memuat galeri.' };
    }
    const media = await response.json();
    return { media };
  } catch (error) {
    return { media: [], error: 'Tidak dapat terhubung ke server.' };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get('token');
    const formData = await request.formData();

    const titleValue = formData.get('title');
    const imageFile = formData.get('image');

    // Pengecekan tipe data yang benar dan aman
    if (!titleValue || typeof titleValue !== 'string' || !(imageFile instanceof File) || imageFile.size === 0) {
      return fail(400, { success: false, message: 'Judul dan file gambar tidak boleh kosong.' });
    }
    
    // Setelah pengecekan, kita bisa aman menggunakan variabelnya
    const body = new FormData();
    body.append('title', titleValue); // Gunakan titleValue yang sudah pasti string
    body.append('image', imageFile);

    const endpoint = `${PUBLIC_BACKEND_URL}/api/media/upload`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: body
      });

      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { success: false, message: errorData.message || 'Gagal mengunggah file.' });
      }

      return { success: true, message: 'Gambar berhasil diunggah!' };

    } catch (error) {
      return fail(500, { success: false, message: 'Tidak bisa terhubung ke server backend.' });
    }
  }
};