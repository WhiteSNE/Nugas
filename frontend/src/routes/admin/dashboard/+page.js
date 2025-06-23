// File: src/routes/admin/dashboard/+page.js

import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  try {
    // PENTING: Gunakan path relatif agar bisa di-intercept oleh Vite Proxy
    const response = await fetch('/api/admin/stats');

    if (!response.ok) {
      throw error(response.status, 'Gagal memuat statistik dari server.');
    }

    const stats = await response.json();

    return {
      stats
    };

  } catch (err) {
    console.error('Gagal fetch statistik dashboard:', err);
    throw error(503, 'Tidak dapat terhubung ke layanan statistik.');
  }
}