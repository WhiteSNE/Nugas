import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '1';

  const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
    credentials: 'include',
    headers: {
      cookie: cookies.get('token') ? `token=${cookies.get('token')}` : ''
    }
  });

  if (!profileRes.ok) throw redirect(302, '/login');
  const user = await profileRes.json();
  if (user.role !== 'admin') throw redirect(302, '/unauthorized');

  const userRes = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users?search=${search}&page=${page}&limit=10`,
    {
      credentials: 'include',
      headers: {
        cookie: cookies.get('token') ? `token=${cookies.get('token')}` : ''
      }
    }
  );

  const users = await userRes.json();

  return { user, users, search, page: Number(page) };
};
