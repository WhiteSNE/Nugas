import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data changelog: ${response.statusText}`);
    }

    const changelogs = await response.json();

    // Kirim data changelogs ke komponen +page.svelte
    return {
      changelogs: changelogs
    };

  } catch (error) {
    console.error("Gagal menghubungi API changelogs:", error);
    // Kembalikan array kosong jika terjadi error
    return {
      changelogs: [],
      error: 'Tidak dapat memuat data changelogs.'
    };
  }
}