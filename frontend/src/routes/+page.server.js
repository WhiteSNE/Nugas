
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  // Definisikan ketiga endpoint yang akan kita panggil
  const registrationsEndpoint = `${PUBLIC_BACKEND_URL}/api/registrations/total`;
  const changelogsEndpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;
  const mediaEndpoint = `${PUBLIC_BACKEND_URL}/api/media`;

  try {
    // DIUBAH: Tambahkan `mediaResponse` untuk menampung hasil fetch ketiga
    const [registrationsResponse, changelogsResponse, mediaResponse] = await Promise.all([
      fetch(registrationsEndpoint),
      fetch(changelogsEndpoint),
      fetch(mediaEndpoint)
    ]);

    // Sekarang kode di bawah ini akan berjalan tanpa error
    const registrationsData = registrationsResponse.ok ? await registrationsResponse.json() : { total: 0 };
    const changelogsData = changelogsResponse.ok ? await changelogsResponse.json() : [];
    const mediaData = mediaResponse.ok ? await mediaResponse.json() : [];

    // Kembalikan ketiga set data dalam satu objek
    return {
      registrationCount: registrationsData.total,
      changelogs: changelogsData,
      media: mediaData
    };

  } catch (error) {
    console.error("Gagal mengambil data untuk halaman utama:", error);
    // Kembalikan data default jika terjadi error koneksi
    return {
      registrationCount: 0,
      changelogs: [],
      media: [],
      error: 'Tidak dapat memuat data dari server.'
    };
  }
}