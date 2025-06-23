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
</script>

<div class="bg-gray-900 min-h-screen text-white font-sans">
  <!-- Fixed Navbar -->
  <header class="fixed top-0 left-0 w-full z-20 flex">
    <Navbar />
  </header>

  <!-- Banner Section -->
  <div
    class="w-full pt-32 pb-20 bg-cover bg-center bg-no-repeat text-white text-center"
    style="background-image: url('/images/banner.jpg');"
  >
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl md:text-5xl font-bold drop-shadow-lg">
        Fan Kit & Media
      </h1>
    </div>
  </div>

  <!-- Main Content Section -->
  <main class="max-w-6xl mx-auto px-4 md:px-8 pb-16">
    {#if paginatedMedia.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each paginatedMedia as item (item.id)}
          <div class="rounded overflow-hidden bg-white shadow-lg">
            <div class="h-64 overflow-hidden bg-gray-200">
              <img 
                src={`${PUBLIC_BACKEND_URL}/${item.path}`} 
                alt={item.title}
                class="w-full h-full object-cover"
              />
            </div>
            <div class="bg-black text-white text-base font-semibold px-4 py-3 truncate">
              {item.title}
            </div>
          </div>
        {/each}
      </div>
    {:else if data.error}
      <p class="text-center text-red-400 mt-8">{data.error}</p>
    {:else}
      <div class="text-center py-20">
        <p class="text-slate-400 text-lg">Belum ada media yang diunggah.</p>
      </div>
    {/if}

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex justify-center items-center gap-2 mt-12 flex-wrap">
        <button
          on:click={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          class="px-4 py-2 bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
        >
          &larr;
        </button>

        {#each Array(totalPages) as _, i}
          {@const page = i + 1}
          <button
            on:click={() => handlePageChange(page)}
            class="px-4 py-2 w-10 h-10 rounded-md transition-colors"
            class:bg-blue-600={currentPage === page}
            class:text-white={currentPage === page}
            class:bg-slate-800={currentPage !== page}
            class:hover:bg-slate-700={currentPage !== page}
          >
            {page}
          </button>
        {/each}

        <button
          on:click={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="px-4 py-2 bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
        >
          Next &rarr;
        </button>
      </div>
    {/if}
  </main>
</div>
