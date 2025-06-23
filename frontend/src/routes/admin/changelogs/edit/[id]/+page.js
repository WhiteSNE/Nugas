import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const id = params.id;

	try {
		const response = await fetch(`/api/changelogs/${id}`);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Gagal mengambil data dari server' }));
			throw error(response.status, errorData.message || 'Gagal mengambil data');
		}

		const changelog = await response.json();

		return {
			changelog
		};
	} catch (e) {
		// INI ADALAH BLOK CATCH YANG PALING AMAN DAN SUDAH DIPERBAIKI
		if (
			e &&
			typeof e === 'object' &&
			'status' in e &&
			typeof e.status === 'number' && // <-- Memastikan tipe status adalah angka
			'body' in e &&
			e.body &&
			typeof e.body === 'object' &&
			'message' in e.body &&
			typeof e.body.message === 'string' // <-- Memastikan tipe message adalah string
		) {
			// Setelah semua pemeriksaan ini, TypeScript sekarang 100% yakin dengan bentuk 'e'
			throw error(e.status, e.body.message);
		}

		// Fallback untuk error JavaScript standar
		if (e instanceof Error) {
			throw error(500, `Terjadi kesalahan internal: ${e.message}`);
		}

		// Fallback terakhir untuk semua hal lain
		throw error(500, 'Gagal memuat data karena kesalahan tidak diketahui.');
	}
}