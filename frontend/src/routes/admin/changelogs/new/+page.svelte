<script lang="ts">
	import TipTapEditor from '$lib/components/TiptapEditor.svelte';
	import type { ActionData } from './$types';
	
    export let form: ActionData;
	let jsonContent: any = {};

    // --- REVISI: Tambahkan variabel untuk URL pratinjau ---
    let bannerPreviewUrl: string | null = null;

    // --- REVISI: Tambahkan fungsi untuk menangani pemilihan file ---
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            // Buat URL objek lokal untuk pratinjau instan
            bannerPreviewUrl = URL.createObjectURL(file);
        } else {
            // Hapus pratinjau jika tidak ada file yang dipilih
            bannerPreviewUrl = null;
        }
    }
</script>

<h1 class="text-2xl font-bold mb-6">Create New Changelog</h1>

<form method="POST" enctype="multipart/form-data" class="space-y-4 p-6 bg-gray-800 rounded-lg">
    
    {#if form?.message}
        <div class="p-3 rounded-md mb-4 {form.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}">
            {form.message}
        </div>
    {/if}

    <div>
        <label for="title" class="block mb-2 text-sm font-medium">Judul</label>
        <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="Judul Changelog" 
            required 
            class="w-full p-2 rounded bg-gray-700 border-gray-600" 
        />
    </div>

    <div>
        <label for="bannerImage" class="block mb-2 text-sm font-medium">Banner Image (Opsional)</label>
        
        {#if bannerPreviewUrl}
            <div class="my-2">
                <p class="text-xs text-gray-400 mb-2">Pratinjau Banner:</p>
                <img src={bannerPreviewUrl} alt="Banner preview" class="max-h-40 rounded-md">
            </div>
        {/if}

        <input 
            type="file" 
            id="bannerImage" 
            name="bannerImage" 
            accept="image/*" 
            class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            on:change={handleFileSelect}
        />
    </div>

	<div>
        <label for="category" class="block mb-2 text-sm font-medium">Kategori</label>
        <select id="category" name="category" required class="w-full p-2 rounded bg-gray-700 border-gray-600">
            <option value="" disabled selected>Pilih Kategori</option>
            <option value="update">Update</option>
            <option value="bugfix">Bug Fix</option>
            <option value="maintenance">Maintenance</option>
            <option value="announcement">Announcement</option>
        </select>
    </div>

    <div>
        <label class="block mb-2 text-sm font-medium">Konten</label>
        <TipTapEditor bind:value={jsonContent} placeholder="Tulis isi changelog di sini..." />
    </div>

	<input type="hidden" name="content" value={JSON.stringify(jsonContent)} />
	
    <button type="submit" class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors">
        Upload Changelog
    </button>
</form>
