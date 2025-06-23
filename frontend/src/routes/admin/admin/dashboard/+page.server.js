// File: src/routes/(admin)/dashboard/+page.server.js

import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/admin/stats`);

    if (!response.ok) {
      // Jika backend mengembalikan error (misal: 500), lempar error ke SvelteKit
      throw error(response.status, 'Gagal memuat statistik dari server.');
    }

    const stats = await response.json();

    return {
      stats // Kembalikan data statistik agar bisa digunakan di halaman .svelte
    };

  } catch (err) {
    // Tangani jika ada error koneksi
    console.error('Gagal koneksi saat fetch statistik:', err);
    throw error(503, 'Tidak dapat terhubung ke layanan statistik.');
  }
}