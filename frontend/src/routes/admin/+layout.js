// File baru: src/routes/admin/+layout.js

import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
  // 'fetch' di sini sekarang bisa berjalan di server (saat load pertama)
  // atau di browser (saat navigasi). Kita utamakan validasi di browser.

  // Hanya jalankan redirect di browser untuk menghindari kerumitan di server
  if (browser) {
    try {
      // PENTING: Panggil API dengan path relatif, BUKAN URL lengkap.
      // Ini akan membuat Vite Proxy bekerja.
      const response = await fetch('/api/auth/profile');

      if (!response.ok) {
        // Jika token tidak valid, lempar ke login
        throw redirect(307, '/login');
      }

      const user = await response.json();

      // Otorisasi: Pastikan rolenya admin
      if (user.role !== 'admin') {
        throw redirect(307, '/');
      }

      // Jika semua aman, kembalikan data user
      return { user };

    } catch (error) {
      // Jika terjadi redirect atau error lain, tangani dengan benar
      if (error instanceof Error && error.message.includes('redirect')) {
        throw error; // Lanjutkan proses redirect
      }
      console.error("Gagal memvalidasi sesi:", error);
      throw redirect(307, '/login'); // Jika ada error lain, paksa ke login
    }
  }

  // Untuk SSR (Server-Side Rendering) awal, kita bisa return object kosong
  // dan membiarkan validasi utama terjadi di sisi client saat halaman interaktif.
  return {
    user: null // atau memanggil API dengan cara yang sama jika Anda memerlukannya saat SSR
  };
}