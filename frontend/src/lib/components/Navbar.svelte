<script>
  import { slide } from 'svelte/transition';

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<nav class="sticky top-0 z-50">
  <div class="flex items-center justify-between h-16 px-4">

    <div class="flex items-center">
      <button 
        on:click={toggleMenu} 
        class="w-16 h-16 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
      >
        <span class="sr-only">Buka Menu</span>
        {#if !isOpen}
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
        {:else}
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        {/if}
      </button>
    </div>
    
    <div class="hidden">...</div>
    <div class="hidden">...</div>
  </div>

  {#if isOpen}
    <div 
      transition:slide={{ duration: 200 }} 
      class="absolute left-0 top-full w-64 bg-slate-800 border-r border-b border-slate-700 rounded-br-lg shadow-lg"
    >
      <div class="flex flex-col p-2">
        <a href="/#home" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Home</a>
        <a href="/#changelogs" class="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Changelogs</a>
        <a href="/#media" class="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Media</a>
        <div class="border-t border-slate-700 mt-2 pt-2">
            <a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition-colors block text-center">
                Login
            </a>
        </div>
      </div>
    </div>
  {/if}
</nav>