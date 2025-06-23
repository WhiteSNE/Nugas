<script lang="ts">
	import { goto } from '$app/navigation';

	// Terima data spesifik dari +page.js
	export let data;

	// Salin data ke variabel formData agar bisa diubah di form
	// Asumsi `data.changelog` berisi objek seperti { id, title, category, content }
	let formData = { ...data.changelog };

	let isSubmitting = false;
	let message = '';

	async function handleUpdate() {
		isSubmitting = true;
		message = '';
		try {
			// Kirim request PUT untuk memperbarui data
			const res = await fetch(`/api/changelogs/${formData.id}`, { // Perhatikan penggunaan ID di URL
				method: 'PUT', // atau PATCH
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (res.ok) {
				alert('✅ Changelog berhasil diperbarui!');
				// Jika berhasil, kembalikan pengguna ke halaman utama changelog
				goto('/admin/changelogs');
			} else {
				const result = await res.json();
				message = `Gagal memperbarui: ${result.error || 'Terjadi kesalahan server.'}`;
			}
		} catch (e) {
			message = 'Terjadi kesalahan koneksi.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="bg-slate-800 p-4 rounded-lg border border-slate-600">
	<h2 class="text-xl font-bold mb-4 text-white">Edit Changelog</h2>

	<form on:submit|preventDefault={handleUpdate}>
		<input
			type="text"
			bind:value={formData.title}
			placeholder="Judul"
			class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white"
			required
		/>

		<select bind:value={formData.category} class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white">
			<option value="announcement">Announcement</option>
			<option value="update">Update</option>
			<option value="bugfix">Bugfix</option>
			<option value="maintenance">Maintenance</option>
		</select>

		<textarea
			bind:value={formData.content}
			placeholder="Isi changelog..."
			rows="5"
			class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white"
			required
		></textarea>

		<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50" disabled={isSubmitting}>
			{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
		</button>
	</form>
    
    {#if message}
		<p class="mt-3 text-sm text-red-400">{message}</p>
	{/if}
</div>