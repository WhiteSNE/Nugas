<script lang="ts">
  import { PUBLIC_BACKEND_URL } from '$env/static/public';
  import Navbar from '$lib/components/Navbar.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let currentPage: number = 1;
  const itemsPerPage: number = 6;

  $: paginatedMedia = data.media.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(data.media.length / itemsPerPage);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  type MediaItem = typeof data.media[0];
  let selectedItem: MediaItem | null = null;

  function openModal(item: MediaItem) {
    selectedItem = item;
  }

  function closeModal() {
    selectedItem = null;
  }

  // Handle keyboard navigation for modal
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && selectedItem) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-gray-900 min-h-screen text-white font-sans">
  <header class="fixed top-0 left-0 w-full z-20 flex">
    <Navbar />
  </header>
  
  <div
    class="w-full pt-20 pb-20 bg-cover bg-center bg-no-repeat text-white text-center"
    style="background-image: url('/images/banner.jpg');"
  >
    <div class="max-w-5xl mx-auto px-4">
      <h1 class="text-3xl md:text-5xl font-bold drop-shadow-lg">
        Fan Kit & Media
      </h1>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-4 md:px-8 py-16">
    {#if data.media && paginatedMedia.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each paginatedMedia as item (item.id)}
          <div class="rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <button
              type="button"
              class="w-full h-64 overflow-hidden bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              on:click={() => openModal(item)}
            >
              <img 
                src={`${PUBLIC_BACKEND_URL}/${item.path}`} 
                alt={item.title} 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
            <div class="bg-black text-white text-base font-semibold px-4 py-3">
              <p class="truncate" title={item.title}>{item.title}</p>
            </div>
          </div>
        {/each}
      </div>

      {#if totalPages > 1}
        <nav class="flex justify-center items-center gap-2 mt-12 flex-wrap" aria-label="Pagination">
          <button
            type="button"
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class="px-4 py-2 bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            aria-label="Previous page"
          >
            &larr; Previous
          </button>

          {#each Array(totalPages) as _, i}
            {@const page = i + 1}
            <button
              type="button"
              on:click={() => handlePageChange(page)}
              class="px-4 py-2 w-12 h-10 rounded-md transition-colors"
              class:bg-blue-600={currentPage === page}
              class:text-white={currentPage === page}
              class:bg-slate-800={currentPage !== page}
              class:hover:bg-slate-700={currentPage !== page}
              aria-label="Page {page}"
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          {/each}

          <button
            type="button"
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="px-4 py-2 bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            aria-label="Next page"
          >
            Next &rarr;
          </button>
        </nav>
      {/if}
    {:else if data.error}
      <div class="text-center py-20">
        <p class="text-red-400 text-lg">{data.error}</p>
      </div>
    {:else}
      <div class="text-center py-20">
        <p class="text-slate-400 text-lg">Belum ada media yang diunggah.</p>
      </div>
    {/if}
  </main>

  <!-- Modal -->
  {#if selectedItem}
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      on:click={closeModal}
      on:keydown
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="bg-white text-black rounded-lg w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh] shadow-2xl"
        on:click|stopPropagation
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          on:click={closeModal}
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <div class="mb-6">
          <img 
            src={`${PUBLIC_BACKEND_URL}/${selectedItem.path}`} 
            alt={selectedItem.title}
            class="w-full h-auto max-h-[60vh] object-contain rounded-md shadow-sm"
          />
        </div>
        
        <h2 id="modal-title" class="text-2xl font-bold mb-4">{selectedItem.title}</h2>
        <p class="text-gray-600 mb-6">Klik tombol di bawah untuk mengunduh media ini.</p>
        
        <div class="flex gap-3">
          <a
            href={`${PUBLIC_BACKEND_URL}/${selectedItem.path}`}
            download
            class="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download
          </a>
          
          <button
            type="button"
            on:click={closeModal}
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>