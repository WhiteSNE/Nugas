<script>
    /** @type {import('./$types').PageData} */
    export let data;
  
    // data.user berasal dari (admin)/+layout.server.js
    // data.stats berasal dari dashboard/+page.server.js
  </script>
  
  <div class="p-8 space-y-6">
    <h1 class="text-3xl font-bold text-white">
      Dashboard
    </h1>
  
    {#if data.user}
    <p class="text-lg text-slate-300">
      Selamat datang kembali, <span class="font-semibold text-blue-400">{data.user.name}</span>!
    </p>
  {/if}
  
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div class="bg-gray-800 border border-slate-700 rounded-lg p-6">
        <h3 class="text-sm font-medium text-slate-400 uppercase">Total Pengguna</h3>
        <p class="mt-2 text-4xl font-bold text-white">
          {data.stats.users}
        </p>
      </div>
  
      <div class="bg-gray-800 border border-slate-700 rounded-lg p-6">
        <h3 class="text-sm font-medium text-slate-400 uppercase">Pra-Registrasi Pending</h3>
        <p class="mt-2 text-4xl font-bold text-white">
          {data.stats.registrations}
        </p>
      </div>
  
      </div>
  </div>