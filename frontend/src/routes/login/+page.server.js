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
      console.error('[FATAL LOGIN ERROR]', err);
      return fail(500, { message: 'Tidak dapat terhubung ke server autentikasi.' });
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return fail(response.status, { email: String(email), message: errorData.message || 'Kredensial tidak valid.' });
    }
    throw redirect(303, '/admin/dashboard');
  }
};