<script lang="ts">
  import type { PageData } from './$types';
  import { PUBLIC_BACKEND_URL } from '$env/static/public';
  import Navbar from '$lib/components/Navbar.svelte';

  import ContentRenderer from '$lib/components/ContentRenderer.svelte';

  export let data: PageData;

  function formatDateForHeader(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `Updated ${year}.${month}.${day}`;
  }
  function formatDate(dateString: string): string {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
  }
</script>

<div class="min-h-screen bg-gray-900 text-white font-sans">
  <header class="fixed top-0 left-0 w-full z-20 flex">
      <Navbar />
  </header>

  <main class="pt-24 pb-10 px-4">
      {#if data.changelog}
          <article class="max-w-4xl mx-auto">
              <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 md:p-10">
                  <div class="mb-8">
                    <div class="flex justify-between items-center p-4">
                        <div class="flex items-baseline space-x-4">
                            <span class="font-bold text-lg text-cyan-400">{data.changelog.category.toUpperCase()}</span>
                            <h1 class="text-lg font-semibold text-white">
                                {data.changelog.title}
                            </h1>
                        </div>
                
                        <div class="text-right">
                            <p class="text-sm font-semibold text-slate-300">{data.changelog.User?.name || 'Operation Team'}</p>
                            <p class="text-xs text-slate-400">{formatDateForHeader(data.changelog.created_at)}</p>
                        </div>
                    </div>
                </div>
                <div class="my-8">
                  <div class="flex h-1 w-full rounded-full overflow-hidden">
                      <div class="w-[8%] bg-slate-200"></div>
                      <div class="w-[92%] bg-slate-700"></div>
                  </div>
                </div>
                  {#if data.changelog.bannerImageUrl}
                      <div class="mb-8">
                          <img
                              src="{PUBLIC_BACKEND_URL}/{data.changelog.bannerImageUrl}"
                              alt="Banner for {data.changelog.title}"
                              class="rounded-lg w-full max-h-[450px] object-cover border border-slate-700"
                          />
                      </div>
                  {/if}
                  <ContentRenderer jsonContent={data.changelog.content} />
              </div>
          </article>
      {:else}
          <p class="text-center text-slate-400">Changelog tidak ditemukan.</p>
      {/if}
  </main>
</div>
