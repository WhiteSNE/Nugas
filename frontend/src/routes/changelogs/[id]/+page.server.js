import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const id = params.id;

  const res = await fetch(`http://localhost:3000/api/changelogs/${id}`);

  if (!res.ok) {
    throw error(res.status, 'Gagal memuat changelog');
  }

  const changelog = await res.json();

  return { changelog };
}
