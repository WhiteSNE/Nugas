<script lang="ts">
    // Impor yang diperlukan
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import { enhance } from '$app/forms';
    
    // Impor Tipe Data dari file $types yang dibuat SvelteKit
    import type { PageData, ActionData } from './$types';
  
    // Terapkan tipe data pada props 'data' dan 'form'
    export let data: PageData;
    export let form: ActionData;
  </script>
  
  <h1 class="text-3xl font-bold mb-6">Manage Media</h1>
  
  <form method="POST" enctype="multipart/form-data" use:enhance class="bg-gray-800 p-6 rounded-lg mb-8">
    <h2 class="text-xl font-semibold mb-4">Upload New Image</h2>
    
    {#if form?.message}
      <div class="p-3 rounded-md mb-4 {form.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}">
        {form.message}
      </div>
    {/if}
  
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <label for="title" class="block mb-2 text-sm font-medium text-slate-300">Image Title</label>
        <input type="text" id="title" name="title" required class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label for="image" class="block mb-2 text-sm font-medium text-slate-300">Image File</label>
        <input type="file" id="image" name="image" required accept="image/*" class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700">
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors">
        Upload
      </button>
    </div>
  </form>
  
  <h2 class="text-xl font-semibold mb-4 mt-8 pt-4 border-t border-gray-700">Existing Gallery</h2>
  {#if data.error}
    <p class="text-center text-red-400">{data.error}</p>
  {:else if !data.media || data.media.length === 0}
    <p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
  {:else}
    <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
      {#each data.media as item (item.id)}
        <div class="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
          <img 
            src="{PUBLIC_BACKEND_URL}/{item.path}" 
            alt={item.title}
            class="w-full h-auto"
          >
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 class="text-white font-bold text-sm truncate">
              {item.title}
            </h3>
            </div>
        </div>
      {/each}
    </div>
  {/if}