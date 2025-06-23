import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return fail(400, { email: String(email), message: 'Email dan password tidak boleh kosong.' });
    }

    let response;
    try {
      // HANYA bungkus bagian yang berpotensi gagal karena jaringan (yaitu fetch)
      response = await fetch(`${PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          email: String(email),
          password: String(password)
        })
      });

    } catch (err) {
      // Blok ini HANYA akan berjalan jika ada error koneksi (misal: backend mati)
      console.error('[FATAL LOGIN ERROR]', err);
      return fail(500, { message: 'Tidak dapat terhubung ke server autentikasi.' });
    }

    // Proses respons di luar blok try...catch
    if (!response.ok) {
      // Jika login gagal (misal: password salah), backend akan merespons dengan !response.ok
      const errorData = await response.json().catch(() => ({}));
      return fail(response.status, { email: String(email), message: errorData.message || 'Kredensial tidak valid.' });
    }

    // Jika kode sampai di sini, artinya response.ok adalah true (login sukses).
    // Lakukan redirect yang sekarang berada di luar jangkauan 'catch'.
    throw redirect(303, '/admin/dashboard');
  }
};