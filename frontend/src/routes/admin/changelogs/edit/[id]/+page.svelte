<script lang="ts">
	import TipTapEditor from '$lib/components/TiptapEditor.svelte';
	import type { PageData, ActionData } from './$types';
	// REVISI: Impor variabel lingkungan dengan cara SvelteKit yang benar
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	
    export let data: PageData;
    export let form: ActionData;

    // REVISI: Logika parsing JSON telah dipindahkan ke server,
    // jadi kode di sini menjadi lebih bersih dan sederhana.
    // Kita langsung gunakan data.changelog.jsonContent yang sudah di-parse.
    let jsonContent: object = data.changelog.jsonContent;
</script>

<h1 class="text-2xl font-bold mb-6">Edit Changelog</h1>

<form method="POST" enctype="multipart/form-data" class="space-y-4 p-6 bg-gray-800 rounded-lg">
    
    {#if form?.message}
        <div class="p-3 rounded-md mb-4 text-red-300 bg-red-500/20">
            {form.message}
        </div>
    {/if}

    <!-- Input Judul, diisi dengan data awal -->
	<div>
        <label for="title" class="block mb-2 text-sm font-medium">Judul</label>
        <input 
            type="text" 
            id="title" 
            name="title" 
            required 
            class="w-full p-2 rounded bg-gray-700 border-gray-600"
            value={data.changelog.title}
        />
    </div>

    <!-- Input untuk MENGGANTI Banner Image -->
    <div>
        <label for="bannerImage" class="block mb-2 text-sm font-medium">Ganti Banner Image (Opsional)</label>
        {#if data.changelog.bannerImageUrl}
            <!-- REVISI: Menggunakan variabel PUBLIC_BACKEND_URL yang sudah diimpor -->
            <img src="{PUBLIC_BACKEND_URL}/{data.changelog.bannerImageUrl}" alt="Current Banner" class="max-h-40 rounded-md mb-2">
            <p class="text-xs text-gray-400 mb-2">Mengupload gambar baru akan menggantikan gambar di atas.</p>
        {/if}
        <input 
            type="file" 
            id="bannerImage" 
            name="bannerImage" 
            accept="image/*" 
            class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
        />
    </div>

	<!-- Pilihan Kategori, diisi dengan data awal -->
	<div>
        <label for="category" class="block mb-2 text-sm font-medium">Kategori</label>
        <select id="category" name="category" required class="w-full p-2 rounded bg-gray-700 border-gray-600">
            <option value="update" selected={data.changelog.category === 'update'}>Update</option>
            <option value="bugfix" selected={data.changelog.category === 'bugfix'}>Bug Fix</option>
            <option value="maintenance" selected={data.changelog.category === 'maintenance'}>Maintenance</option>
            <option value="announcement" selected={data.changelog.category === 'announcement'}>Announcement</option>
        </select>
    </div>

    <!-- Editor Tiptap -->
	<div>
        <label class="block mb-2 text-sm font-medium">Konten</label>
        <TipTapEditor bind:value={jsonContent} placeholder="Tulis isi changelog di sini..." />
    </div>

	<!-- Input tersembunyi untuk mengirim data Tiptap -->
	<input type="hidden" name="content" value={JSON.stringify(jsonContent)} />
	
    <button type="submit" class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors">
        Simpan Perubahan
    </button>
</form>