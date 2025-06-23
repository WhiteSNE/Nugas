<script>
  import { invalidate } from '$app/navigation';
  export let form;
</script>

<h1 class="text-2xl font-bold mb-4">Upload Changelog</h1>

{#if form?.message}
  <div class="mb-4 p-3 rounded text-white" class:bg-red-500={!form.success} class:bg-green-500={form.success}>
    {form.message}
  </div>
{/if}

<form method="POST" class="space-y-4">
  <div>
    <label for="title" class="block font-semibold mb-1">Judul</label>
    <input type="text" id="title" name="title" class="w-full border px-3 py-2 rounded" required />
  </div>

  <div>
    <label for="category" class="block font-semibold mb-1">Kategori</label>
    <select id="category" name="category" class="w-full border px-3 py-2 rounded" required>
      <option value="update">Update</option>
      <option value="event">Event</option>
      <option value="maintenance">Maintenance</option>
    </select>
  </div>

  <div>
    <label for="content" class="block font-semibold mb-1">Konten</label>
    <textarea id="content" name="content" class="w-full border px-3 py-2 rounded h-40" required></textarea>
  </div>

  <button type="submit" class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
    Upload
  </button>
</form>
