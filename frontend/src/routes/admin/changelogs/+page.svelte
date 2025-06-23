<script lang="ts">
import type { PageData } from './$types';
import { goto } from '$app/navigation';


// 1. Terima data dari +page.js DENGAN TIPE YANG JELAS
export let data: PageData;
  // --- PERBAIKAN SELESAI ---

// Buat variabel lokal yang reaktif untuk daftar changelog
// TypeScript sekarang tahu tipe `changelogs` karena `data` sudah diketik
let changelogs = data.changelogs || [];

// Variabel untuk form tambah
let title = '';
let category = 'announcement';
let content = '';
let isSubmitting = false;
let message = '';

// 2. Modifikasi fungsi submit agar langsung mengupdate daftar di UI
async function handleSubmit() {
  isSubmitting = true;
  message = '';
  try {
    const res = await fetch('/api/changelogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, content })
    });
    const result = await res.json();

    if (res.ok) {
      message = '✅ Changelog berhasil ditambahkan!';
      changelogs = [result.data || result.changelog || result, ...changelogs];
      // Reset form
      title = '';
      content = '';
      category = 'announcement';
    } else {
      message = result.error || 'Gagal menambahkan changelog';
    }
  } catch (e) {
    message = 'Terjadi kesalahan koneksi.';
  } finally {
    isSubmitting = false;
  }
}

// 3. FUNGSI BARU: Menangani penghapusan item
async function handleDelete(id: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
    return;
  }
  try {
    const res = await fetch(`/api/changelogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      // Error tidak akan muncul lagi di sini
      changelogs = changelogs.filter((item) => item.id !== id);
      alert('Changelog berhasil dihapus.');
    } else {
      const result = await res.json();
      alert(`Gagal menghapus: ${result.error}`);
    }
  } catch (e) {
    alert('Terjadi kesalahan koneksi.');
  }
}
</script>

<form on:submit|preventDefault={handleSubmit} class="mb-8 bg-slate-800 p-4 rounded-lg border border-slate-600">
	<h2 class="text-xl font-bold mb-4 text-white">Tambah Changelog</h2>

	<input type="text" bind:value={title} placeholder="Judul" class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white" required />

	<select bind:value={category} class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white">
		<option value="announcement">Announcement</option>
		<option value="update">Update</option>
		<option value="bugfix">Bugfix</option>
		<option value="maintenance">Maintenance</option>
	</select>

	<textarea bind:value={content} placeholder="Isi changelog..." rows="5" class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white" required></textarea>

	<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50" disabled={isSubmitting}>
		{isSubmitting ? 'Menyimpan...' : 'Simpan Changelog'}
	</button>

	{#if message}
		<p class="mt-3 text-sm text-slate-300">{message}</p>
	{/if}
</form>

<div class="bg-slate-800 p-4 rounded-lg border border-slate-600">
	<h2 class="text-xl font-bold mb-4 text-white">Daftar Changelog</h2>
	<div class="overflow-x-auto">
		<table class="min-w-full text-sm text-left text-slate-300">
			<thead class="text-xs text-slate-400 uppercase bg-slate-700">
				<tr>
					<th scope="col" class="py-3 px-6">Judul</th>
					<th scope="col" class="py-3 px-6">Kategori</th>
					<th scope="col" class="py-3 px-6">Tanggal</th>
					<th scope="col" class="py-3 px-6 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each changelogs as item (item.id)}
					<tr class="bg-slate-800 border-b border-slate-700">
						<td class="py-4 px-6 font-medium text-white">{item.title}</td>
						<td class="py-4 px-6">{item.category}</td>
						<td class="py-4 px-6">{new Date(item.createdAt || item.date).toLocaleDateString('id-ID')}</td>
						<td class="py-4 px-6 text-center">
							<a href={`/admin/changelogs/edit/${item.id}`} class="font-medium text-blue-500 hover:underline mr-4">Edit</a>
							<button on:click={() => handleDelete(item.id)} class="font-medium text-red-500 hover:underline">
								Hapus
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="text-center py-4">Belum ada changelog.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>