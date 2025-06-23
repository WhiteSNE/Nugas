<script lang="ts">
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    export let data;
  </script>
  
  <div class="bg-gray-900 min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
  
      <h1 class="text-4xl md:text-5xl font-bold border-b-2 border-slate-700 pb-4 mb-8 text-white">
        Media Gallery
      </h1>
  
      {#if data.error}
        <p class="text-center text-red-400">{data.error}</p>
      {:else if !data.media || data.media.length === 0}
        <p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
      {:else}
        <div class="columns-2 md:columns-3 lg:columns-4 gap-4">
          {#each data.media as item (item.id)}
            <div class="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
              <img 
                src="{PUBLIC_BACKEND_URL}/{item.path}" 
                alt={item.title}
                class="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              >
              
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 class="text-white font-bold text-lg drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </div>
          {/each}
        </div>
      {/if}
  
      <div class="text-center mt-12">
        <button class="text-slate-300 hover:text-white font-semibold flex items-center gap-2 mx-auto">
          See More
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
      </div>
  
    </div>
  </div>