import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const endpoint = `${PUBLIC_BACKEND_URL}/api/media`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data media: ${response.statusText}`);
    }

    const media = await response.json();

    return {
      media: media
    };

  } catch (error) {
    console.error("Gagal menghubungi API media:", error);
    return {
      media: [],
      error: 'Tidak dapat memuat data media.'
    };
  }
}