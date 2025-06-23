import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Gagal memuat changelogs');
    }
    const changelogs = await response.json();
    return { changelogs };
  } catch (error) {
    console.error(error);
    return { changelogs: [], error: 'Tidak dapat memuat data.' };
  }
}