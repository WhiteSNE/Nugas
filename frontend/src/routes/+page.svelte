<script lang="ts">
  // Impor komponen-komponen section
  import Navbar from '$lib/components/Navbar.svelte';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import RegistrationSection from '$lib/components/RegistrationSection.svelte';
  import ChangelogSection from '$lib/components/ChangelogSection.svelte';
  import MediaSection from '$lib/components/MediaSection.svelte';

  // Terima data dari +page.ts
  export let data;
</script>

<header class="fixed top-0 left-0 w-full z-20 flex items-center justify-between p-4 md:p-5">
  <Navbar />
  <div class="hidden md:flex items-center space-x-4 font-mono">
    <span class="text-slate-400 font-semibold text-lg">PV</span>
    <a href="/pv/001" class="text-white hover:text-blue-400 transition-colors font-bold text-lg">001</a>
    <a href="/pv/002" class="text-white hover:text-blue-400 transition-colors font-bold text-lg">002</a>
    <a href="/pv/003" class="text-white hover:text-blue-400 transition-colors font-bold text-lg">003</a>
    <a href="/pv/004" class="text-white hover:text-blue-400 transition-colors font-bold text-lg">004</a>
  </div>
</header>

<div class="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth text-white bg-black">
  <HeroSection />
  
  <RegistrationSection initialRegistrationCount={data.registrationCount} />

  <ChangelogSection initialChangelogs={data.changelogs} />
  
  <MediaSection media={data.media} />
</div>