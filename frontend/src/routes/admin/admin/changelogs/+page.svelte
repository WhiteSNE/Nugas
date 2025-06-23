<script lang="ts">
  let title = '';
  let category = 'announcement';
  let content = '';
  let isSubmitting = false;
  let message = '';
</script>

<form
  on:submit|preventDefault={async () => {
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
        // Reset form atau fetch ulang data
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
  }}
  class="mb-8 bg-slate-800 p-4 rounded-lg border border-slate-600"
>
  <h2 class="text-xl font-bold mb-4 text-white">Tambah Changelog</h2>

  <input type="text" bind:value={title} placeholder="Judul"
    class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white" required />

  <select bind:value={category}
    class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white">
    <option value="announcement">Announcement</option>
    <option value="update">Update</option>
    <option value="bugfix">Bugfix</option>
    <option value="maintenance">Maintenance</option>
  </select>

  <textarea bind:value={content} placeholder="Isi changelog..." rows="5"
    class="w-full p-2 mb-3 rounded bg-slate-900 border border-slate-600 text-white" required></textarea>

  <button type="submit"
    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
    disabled={isSubmitting}>
    {isSubmitting ? 'Menyimpan...' : 'Simpan Changelog'}
  </button>

  {#if message}
    <p class="mt-3 text-sm text-slate-300">{message}</p>
  {/if}
</form>
