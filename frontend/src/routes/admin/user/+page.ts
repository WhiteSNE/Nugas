// src/routes/admin/user/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
    credentials: 'include'
  });

  const users = await res.json();

  return { users };
};
