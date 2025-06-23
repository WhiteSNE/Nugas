// src/routes/+page.ts
import { error } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const category = url.searchParams.get('category');

  let endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs`;
  if (category && category !== 'latest') {
    endpoint += `?category=${category}`;
  }

  console.log('Memanggil endpoint', endpoint);

  const [respRegs, respChangelogs, respMedia] = await Promise.all([
    fetch(`${PUBLIC_BACKEND_URL}/api/registrations/total`),
    fetch(endpoint),
    fetch(`${PUBLIC_BACKEND_URL}/api/media`)
  ]);

  if (!respChangelogs.ok) {
    throw error(502, 'Gagal ambil changelogs');
  }

  const [regs, changelogs, media] = await Promise.all([
    respRegs.json(),
    respChangelogs.json(),
    respMedia.json(),
  ]);

  return {
    registrationCount: regs.total ?? 0,
    changelogs,
    media
  };
};
