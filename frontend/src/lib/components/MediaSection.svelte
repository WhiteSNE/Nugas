<script lang="ts">
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
  
    export let media;
  
    interface MediaItem {
      id: number | string;
      path: string;
      title: string;
    }
  
    let isLightboxOpen = false;
    let selectedMedia: MediaItem | null = null;
  
    function openLightbox(mediaItem: MediaItem) {
      selectedMedia = mediaItem;
      isLightboxOpen = true;
    }
  
    function closeLightbox() {
      isLightboxOpen = false;
      selectedMedia = null;
    }
  </script>
  
  <section id="media" class="snap-start bg-gray-900 px-4 py-16 md:py-24">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-white border-b-2 border-slate-700 pb-4 mb-8">Media Gallery</h1>
      {#if media && media.length > 0}
        <div class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {#each media as item (item.id)}
            <div role="button" tabindex="0" on:click={() => openLightbox(item)} on:keydown={(e) => e.key === 'Enter' && openLightbox(item)} class="break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer">
              <img src="{PUBLIC_BACKEND_URL}/{item.path}" alt={item.title} class="w-full h-auto transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 class="text-white font-bold text-lg drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
      {/if}
      <div class="text-center mt-12">
        <a href="/media" class="inline-flex items-center justify-center gap-2 border border-slate-600 text-white font-semibold px-6 py-2 rounded hover:bg-slate-700 transition-all text-sm">
          <span>SEE MORE</span>
          <span class="text-base">→</span>
        </a>
      </div>
      <div class="text-center mt-12 pt-8 border-t border-slate-700">
        <a href="/login" class="text-sm text-slate-400 hover:text-white transition-colors">Admin Login</a>
      </div>
    </div>
  </section>
  
  {#if isLightboxOpen}
  <div 
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click={closeLightbox}
    on:keydown={(e) => e.key === 'Escape' && closeLightbox()}
  >
  {#if selectedMedia}
  <div class="relative max-w-4xl max-h-[90vh]" on:click|stopPropagation role="document">
    <img 
      src="{PUBLIC_BACKEND_URL}/{selectedMedia.path}" 
      alt={selectedMedia.title} 
      class="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
    />
    <button 
      on:click={closeLightbox}
      class="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-gray-200"
      aria-label="Close"
    >&times;</button>
  </div>
{/if}
  </div> {/if}