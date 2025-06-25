<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import type { PageData } from './$types';


  interface Changelog {
    id: number;
    title: string;
    category: string;
    created_at: string;
  }

  export let data: { changelogs: Changelog[] };

  const FILTERS = ['LATEST', 'ANNOUNCEMENT', 'UPDATE', 'BUGFIX', 'MAINTENANCE'];
  
  let activeFilter: string = 'LATEST';

  let currentPage: number = 1;
  const itemsPerPage: number = 9;

  $: filteredChangelogs = data.changelogs.filter(changelog => {
    if (activeFilter === 'LATEST') {
      return true;
}

    return changelog.category.toUpperCase() === activeFilter;
  });

  $: paginatedChangelogs = filteredChangelogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredChangelogs.length / itemsPerPage);

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-CA').replace(/-/g, '.');
  }

  function handleFilterClick(filter: string) {
    activeFilter = filter;
    currentPage = 1;
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="bg-gray-900 min-h-screen p-4 md:p-8 text-white font-sans">
  <header class="fixed top-0 left-0 w-full z-20 flex">
       <Navbar></Navbar>
    </header>
  <div class="max-w-6xl mx-auto">
    
    <div class="flex flex-col md:flex-row justify-between items-center border-b-2 border-slate-700 pb-4 mb-8 gap-4">
      <h1 class="text-3xl md:text-4xl font-bold">
        Changelogs & News
      </h1>
      <div class="flex items-center gap-2 flex-wrap justify-center">
        {#each FILTERS as filter}
          <button
            on:click={() => handleFilterClick(filter)}
            class="text-sm font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            class:bg-blue-600={activeFilter === filter}
            class:text-white={activeFilter === filter}
            class:bg-slate-800={activeFilter !== filter}
            class:text-slate-400={activeFilter !== filter}
            class:hover:bg-slate-700={activeFilter !== filter}
          >
            {filter}
          </button>
        {/each}
      </div>
    </div>

    {#if paginatedChangelogs.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each paginatedChangelogs as changelog (changelog.id)}
          <div class="bg-slate-800 border border-slate-700 rounded-md flex flex-col p-5 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20">
            <div class="flex justify-between items-center text-xs mb-3">
              <span class="font-mono text-slate-400">{formatDate(changelog.created_at)}</span>
              <span class="font-bold text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded-full">{changelog.category.toUpperCase()}</span>
            </div>
            <div class="w-8 h-0.5 bg-blue-500 mb-4"></div>
            <div class="flex-grow">
              <h2 class="text-lg font-bold text-slate-100 leading-tight line-clamp-3">
                {changelog.title}
              </h2>
            </div>
            <div class="mt-4">
              <a href="/changelogs/{changelog.id}" class="text-blue-400 font-semibold text-sm hover:underline">
                READ MORE +
              </a>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-20">
        <p class="text-slate-400">Tidak ada item yang cocok dengan filter ini.</p>
      </div>
    {/if}

    {#if totalPages > 1}
      <div class="flex justify-center items-center gap-2 mt-12">
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
            {page.toString().padStart(2, '0')}
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

  </div>
</div>