import { error, fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const id = params.id;
    const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs/${id}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw error(response.status, 'Gagal mengambil data changelog.');
        }
        const changelog = await response.json();
        
        // REVISI: Parsing konten JSON dilakukan di sini, di sisi server.
        try {
            changelog.jsonContent = JSON.parse(changelog.content);
        } catch(e) {
            // Fallback jika konten dari DB bukan JSON yang valid
            changelog.jsonContent = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: changelog.content }] }] };
        }

        return { changelog };

    } catch (e) {
        if (e && typeof e === 'object' && 'status' in e) throw e;
        throw error(500, 'Tidak bisa terhubung ke server untuk memuat data.');
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, cookies, params }) => {
        const token = cookies.get('token');
        if (!token) {
            return fail(401, { message: 'Anda tidak diautentikasi.' });
        }
        
        const id = params.id;
        const formData = await request.formData();
        const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs/${id}`;

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { message: errorData.message || 'Gagal memperbarui changelog.' });
            }

        } catch (e) {
            return fail(500, { message: 'Tidak bisa terhubung ke server backend.' });
        }

        throw redirect(303, '/admin/changelogs');
    }
};