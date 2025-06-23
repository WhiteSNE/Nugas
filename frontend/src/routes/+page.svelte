<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import { PUBLIC_BACKEND_URL } from '$env/static/public';
  export let data;

  const milestones = [
    { target: 1000000, name: 'Dorra', amount: '+ 10000', image: '/rewards/dorra.jpg' },
    { target: 2000000, name: 'Stellanite Dust', amount: '+ 200', image: '/rewards/stellanite.jpg' },
    { target: 3000000, name: 'Disc: Tranquil Retreat', amount: '+ 1', image: '/rewards/disc.jpg' },
    { target: 4000000, name: 'Stellanite Dust', amount: '+ 600', image: '/rewards/stellanite.jpg' },
    { target: 6000000, name: 'Trekker: Ann', amount: '+ 1', image: '/rewards/ann.jpg' },
    { target: 8000000, name: 'Cerulean Ticket', amount: '+ 10', image: '/rewards/ticket.jpg' }
  ];
  const finalTarget = 8000000;

  $: currentRegistrations = data.registrationCount || 0;
  $: progressPercentage = Math.min((currentRegistrations / finalTarget) * 100, 100);
  $: formattedCount = currentRegistrations.toLocaleString('en-US');

  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  let email = '';
  let isSubmitting = false;
  let message = '';
  let messageType: 'success' | 'error' | '' = '';

  async function handlePreRegister() {
    isSubmitting = true;
    message = '';
    messageType = '';

    try {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok) {
        currentRegistrations = result.total;
        message = 'Thank you for pre-registering!';
        messageType = 'success';
        email = '';
      } else {
        message = result.error || 'An error occurred. Please try again.';
        messageType = 'error';
      }
    } catch {
      message = 'Network error. Please check your connection.';
      messageType = 'error';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<!-- Global scroll snap wrapper -->
<div class="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth text-white bg-black">

  <!-- HERO -->
  <section class="snap-start h-screen relative">
    <div class="absolute top-0 left-0 right-0 z-20">
      <Navbar />
    </div>
    <div class="absolute inset-0 bg-cover bg-center opacity-80" style="background-image: url('/Hero.png');"></div>
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="relative z-10 h-full flex flex-col justify-center items-center p-4 pt-32 text-center">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Welcome to the Pre-Register Page</h1>
        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <button class="bg-white text-black font-bold py-2 px-6 rounded hover:bg-slate-200">App Store</button>
          <button class="bg-white text-black font-bold py-2 px-6 rounded hover:bg-slate-200">Google Play</button>
          <button class="bg-white text-black font-bold py-2 px-6 rounded hover:bg-slate-200">Windows PC</button>
        </div>
      </div>
    </div>
  </section>

  <!-- PRE-REGISTER -->
  <section class="snap-start h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-5xl bg-slate-700/50 p-6 rounded-lg border border-slate-600">
      <div class="bg-slate-900 border-2 border-blue-400 rounded-lg p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="text-blue-400 text-2xl">📍</span>
            <span class="text-white text-4xl font-bold tracking-wider">{formattedCount}</span>
          </div>
          <form on:submit|preventDefault={handlePreRegister} class="w-full md:w-auto">
            <div class="flex flex-col sm:flex-row gap-2">
              <input type="email" bind:value={email} required placeholder="Enter your email"
                class="bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting} />
              <button type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Pre-Register'}
              </button>
            </div>
            {#if message}
              <div class={`mt-2 text-center text-sm font-medium p-2 rounded-lg ${
                messageType === 'success' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
              }`}>
                {message}
              </div>
            {/if}
          </form>
        </div>
        <!-- Progress bar -->
        <div class="relative w-full h-4 bg-slate-900 rounded-full mt-6 border-2 border-slate-600">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000" style="width: {progressPercentage}%"></div>
          <div class="absolute -top-4 transition-all duration-1000" style="left: calc({progressPercentage}% - 16px);">
            <span class="text-3xl">🚐</span>
          </div>
        </div>
        <!-- Milestones -->
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
          {#each milestones as milestone}
            {@const achieved = currentRegistrations >= milestone.target}
            <div class="flex flex-col items-center text-center">
              <div class="relative bg-slate-800 border-2 border-slate-600 rounded-full p-2 w-24 h-24 flex items-center justify-center overflow-hidden">
                <img src={milestone.image} alt={milestone.name}
                  class="w-full h-full object-cover rounded-full {achieved ? 'grayscale-0' : 'grayscale'}" />
                {#if achieved}
                  <div class="absolute -top-2 -left-2 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full rotate-[-15deg] shadow-lg">GET</div>
                {/if}
              </div>
              <div class="mt-2 text-white text-sm h-12">
                <p>{milestone.name}</p>
                <p class="font-bold">{milestone.amount}</p>
              </div>
              <div class="mt-2 relative">
                <div class="w-4 h-4 rounded-full border-2 border-cyan-400 {achieved ? 'bg-cyan-400' : 'bg-slate-800'}"></div>
                <p class="text-slate-400 text-xs mt-1">{milestone.target.toLocaleString('en-US')}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- CHANGELOG -->
  <section class="snap-start h-screen bg-gray-900 px-4 py-6 overflow-y-auto">
    <div class="max-w-6xl mx-auto w-full">
      <h1 class="text-3xl font-bold border-b-2 border-slate-700 pb-4 mb-6">
        Changelogs & News
      </h1>
  
      {#if data.error && !data.changelogs}
        <p class="text-center text-red-400">{data.error}</p>
      {:else if !data.changelogs || data.changelogs.length === 0}
        <p class="text-center text-slate-400">Belum ada berita atau changelog yang dipublikasikan.</p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each data.changelogs as changelog, i (changelog.id)}
            <a href="/changelogs/{changelog.id}"
               class={`block border border-slate-600 bg-slate-800 text-white p-3 
                       ${i === 0 ? 'col-span-full lg:col-span-2 row-span-2' : ''}`}>
              <!-- Placeholder thumbnail -->
              <div class="h-24 bg-slate-700 mb-2 rounded-sm"></div>
  
              <!-- Date -->
              <div class="text-xs text-right text-slate-400 mb-1">
                {formatDate(changelog.published_at)}
              </div>
  
              <!-- Category -->
              <div class="text-xs uppercase text-cyan-400 font-semibold mb-1">
                {changelog.category}
              </div>
  
              <!-- Title -->
              <h2 class="text-sm font-bold leading-tight line-clamp-2">
                {changelog.title}
              </h2>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>
  
  <!-- GALLERY -->
  <section class="snap-start h-screen bg-gray-900 p-6 overflow-y-auto">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold border-b-2 border-slate-700 pb-4 mb-8">Media Gallery</h1>
      {#if data.error && !data.media}
        <p class="text-center text-red-400">{data.error}</p>
      {:else if !data.media || data.media.length === 0}
        <p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
      {:else}
        <div class="columns-2 md:columns-3 lg:columns-4 gap-4">
          {#each data.media as item (item.id)}
            <div class="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
              <img src="{PUBLIC_BACKEND_URL}/{item.path}" alt={item.title} class="w-full h-auto transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 class="text-white font-bold text-lg drop-shadow-md">{item.title}</h3>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      <div class="text-center mt-12 pt-8 border-t border-slate-700">
        <a href="/login" class="text-sm text-slate-400 hover:text-white transition-colors">Admin Login</a>
      </div>
    </div>
  </section>
</div>

<style>
  html {
    scroll-behavior: smooth;
  }
</style>
