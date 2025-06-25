import { error } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
  const id = params.id;
  const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs/${id}`;

  try {
    const res = await fetch(endpoint);

    if (!res.ok) {
        throw error(res.status, 'Gagal memuat changelog');
    }

    const changelog = await res.json();
    return { changelog };

  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e;
    throw error(500, 'Tidak dapat terhubung ke server.');
  }
}
