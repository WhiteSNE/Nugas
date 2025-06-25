<script lang="ts">
    let email = '';
    let newPassword = '';
    let message = '';
    let error = '';
  
    const handleReset = async () => {
      message = '';
      error = '';
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword })
      });
  
      const result = await res.json();
  
      if (res.ok) {
        message = result.message;
        email = '';
        newPassword = '';
      } else {
        error = result.message || 'Terjadi kesalahan.';
      }
    };
  </script>
  
  <h1 class="text-2xl font-bold text-white mb-4">Reset Password Manual</h1>
  
  <div class="space-y-4 max-w-md">
    <input class="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white" bind:value={email} placeholder="Email user..." />
    <input class="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white" bind:value={newPassword} placeholder="Password baru..." type="password" />
    
    <button on:click={handleReset} class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold">
      Reset Password
    </button>
  
    {#if message}
      <p class="text-green-400">{message}</p>
    {/if}
    {#if error}
      <p class="text-red-400">{error}</p>
    {/if}
  </div>
  