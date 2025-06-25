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
	upload: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const formData = await request.formData();

		const titleValue = formData.get('title');
		const imageFile = formData.get('image');

		if (
			!titleValue ||
			typeof titleValue !== 'string' ||
			!(imageFile instanceof File) ||
			imageFile.size === 0
		) {
			return fail(400, { success: false, message: 'Judul dan file gambar tidak boleh kosong.' });
		}

		const body = new FormData();
		body.append('title', titleValue);
		body.append('image', imageFile);

		const endpoint = `${PUBLIC_BACKEND_URL}/api/media/upload`;

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: body
			});

			// Ambil data JSON dari respons, baik untuk sukses maupun error
			const responseData = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					success: false,
					message: responseData.message || 'Gagal mengunggah file.'
				});
			}

			// --- REVISI KUNCI ADA DI SINI ---
			// Kembalikan data media yang baru dibuat bersama dengan pesan sukses
			// agar bisa ditangkap oleh callback use:enhance di frontend.
			return {
				success: true,
				message: 'Gambar berhasil diunggah!',
				newMedia: responseData
			};
		} catch (error) {
			return fail(500, { success: false, message: 'Tidak bisa terhubung ke server backend.' });
		}
	},

	delete: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { success: false, message: 'ID media tidak ditemukan.' });
		}

		const endpoint = `${PUBLIC_BACKEND_URL}/api/media/${id}`;

		try {
			const response = await fetch(endpoint, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					success: false,
					message: errorData.message || 'Gagal menghapus file.'
				});
			}

			return { success: true, message: 'Gambar berhasil dihapus.' };
		} catch (error) {
			return fail(500, { success: false, message: 'Tidak bisa terhubung ke server backend.' });
		}
	}
};