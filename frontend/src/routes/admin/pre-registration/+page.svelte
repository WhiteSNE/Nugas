<script lang="ts">
    import { onMount } from 'svelte';
  
    let emails: string[] = [];
    let message = '';
    let registrations: { email: string; created_at: string }[] = [];
  
    const fetchData = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registrations`, {
    credentials: 'include'
  });

  const result = await res.json();
  registrations = result.data.map((r: { email: string; created_at: string }) => ({
    email: r.email,
    created_at: new Date(r.created_at).toLocaleString()
  }));
  };
  
    const handleConvert = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/convert-pre-registrations`, {
        method: 'POST',
        credentials: 'include'
      });
  
      const result = await res.json();
      message = result.message || 'Berhasil dikonversi.';
      fetchData();
    };
  
    onMount(fetchData);
  </script>
  
  <h1 class="text-2xl font-bold text-white mb-4">Pra-Registrasi</h1>
  
  {#if message}
  <div class="text-green-400 mb-2">{message}</div>
{/if}

<div class="mb-4">
  <button on:click={handleConvert} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Konversi ke User
  </button>
</div>

<table class="table-auto w-full border text-sm">
  <thead class="bg-gray-800 text-white">
    <tr>
      <th class="p-2 border">#</th>
      <th class="p-2 border">Email</th>
      <th class="p-2 border">Tanggal Registrasi</th>
    </tr>
  </thead>
  <tbody>
    {#each registrations as r, i}
      <tr class="border hover:bg-gray-100 dark:hover:bg-gray-700">
        <td class="p-2 border text-center">{i + 1}</td>
        <td class="p-2 border">{r.email}</td>
        <td class="p-2 border">{r.created_at}</td>
      </tr>
    {/each}
  </tbody>
</table>