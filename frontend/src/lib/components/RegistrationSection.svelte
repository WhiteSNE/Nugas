<script lang="ts">
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import ProgressBar from '$lib/components/ProgressBar.svelte';
    import MilestoneCard from '$lib/components/MilestoneCard.svelte';
  
    export let initialRegistrationCount: number;
  
    let currentRegistrations = initialRegistrationCount || 0;
  
    const milestones = [
      { target: 1000000, name: 'Dorra', amount: '+ 10000', image: '/rewards/dorra.jpg' },
      { target: 2000000, name: 'Stellanite Dust', amount: '+ 200', image: '/rewards/stellanite.jpg' },
      { target: 3000000, name: 'Disc: Tranquil Retreat', amount: '+ 1', image: '/rewards/disc.jpg' },
      { target: 4000000, name: 'Stellanite Dust', amount: '+ 600', image: '/rewards/stellanite.jpg' },
      { target: 6000000, name: 'Trekker: Ann', amount: '+ 1', image: '/rewards/ann.jpg' },
      { target: 8000000, name: 'Cerulean Ticket', amount: '+ 10', image: '/rewards/ticket.jpg' }
    ];
    const finalTarget = 8000000;
  
    $: progressPercentage = Math.min((currentRegistrations / finalTarget) * 100, 100);
    $: formattedCount = currentRegistrations.toLocaleString('en-US');
  
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
          message = result.error || 'An error occurred.';
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
  
  <section id="register" class="snap-start h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-5xl bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
      <div class="bg-slate-900 border-2 border-blue-400 rounded-lg p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="text-blue-400 text-2xl">📍</span>
            <span class="text-white text-4xl font-bold tracking-wider">{formattedCount}</span>
          </div>
          <form on:submit|preventDefault={handlePreRegister} class="w-full md:w-auto">
            <div class="flex flex-col sm:flex-row gap-2">
              <input type="email" bind:value={email} required placeholder="Enter your email" class="bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 whitespace-nowrap flex-shrink-0" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Pre-Register'}
              </button>
            </div>
            {#if message}
              <div class={`mt-2 text-center text-sm font-medium p-2 rounded-lg ${ messageType === 'success' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400' }`}>
                {message}
              </div>
            {/if}
          </form>
        </div>
        <ProgressBar progress={progressPercentage} />
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
          {#each milestones as milestone}
            {@const achieved = currentRegistrations >= milestone.target}
            <MilestoneCard {milestone} {achieved} />
          {/each}
        </div>
      </div>
    </div>
  </section>