// File: src/routes/admin/changelogs/+page.server.js
import { error, fail } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw error(response.status, 'Gagal memuat data changelogs dari server.');
        }
        const changelogs = await response.json();
        return { changelogs };
    } catch (e) {
        if (e && typeof e === 'object' && 'status' in e) throw e;
        throw error(500, 'Tidak bisa terhubung ke server backend.');
    }
}

// REVISI: Tambahkan object 'actions' di bawah fungsi 'load'
/** @type {import('./$types').Actions} */
export const actions = {
    // Ini adalah 'named action' yang akan dipanggil oleh form action="?/delete"
    delete: async ({ request, cookies, fetch }) => {
        const token = cookies.get('token');
        if (!token) {
            return fail(401, { message: 'Anda tidak diautentikasi.' });
        }
        
        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { message: 'ID changelog tidak ditemukan.' });
        }

        const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs/${id}`;

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Mengembalikan pesan error agar bisa ditampilkan jika perlu
                return fail(response.status, { message: errorData.message || 'Gagal menghapus changelog.' });
            }

            // Tidak perlu mengembalikan data, halaman akan otomatis refresh oleh SvelteKit
            return { success: true };

        } catch (e) {
            return fail(500, { message: 'Tidak bisa terhubung ke server backend.' });
        }
    }
};