<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
  
    // Fungsi sederhana untuk logout yang menghapus cookie
    // dan mengarahkan ke halaman login.
    function logout() {
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
  </script>
  
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Sidebar -->
    <aside class="flex h-full w-64 flex-col overflow-y-auto border-r border-slate-700 bg-gray-800 px-5 py-8">
      <a href="/admin/dashboard" class="text-2xl font-bold text-blue-400">
        Project Nugas
      </a>
  
      <div class="mt-6 flex flex-1 flex-col justify-between">
        <nav class="-mx-3 space-y-2">
          <!-- Dashboard Link -->
          <a
            class="flex transform items-center rounded-lg px-3 py-2 text-slate-200 transition-colors duration-300 hover:bg-slate-700 hover:text-white"
            href="/admin/dashboard"
          >
            <span class="mx-2 text-sm font-medium">Dashboard</span>
          </a>
          
          <!-- Changelogs Link -->
          <a
            class="flex transform items-center rounded-lg px-3 py-2 text-slate-200 transition-colors duration-300 hover:bg-slate-700 hover:text-white"
            href="/admin/changelogs"
          >
            <span class="mx-2 text-sm font-medium">Changelogs</span>
          </a>
  
          <!-- Media Link -->
          <a
            class="flex transform items-center rounded-lg px-3 py-2 text-slate-200 transition-colors duration-300 hover:bg-slate-700 hover:text-white"
            href="/admin/media"
          >
            <span class="mx-2 text-sm font-medium">Media</span>
          </a>
          <!--User-->
          <a
            class="flex items-center rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-700"
            href="/admin/user"
          >
            <span class="mx-2 text-sm font-medium">User</span>
          </a>
          <a
            class="flex items-center rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-700"
            href="/admin/pre-registration"
          >
            <span class="mx-2 text-sm font-medium">Pre-Regist</span>
          </a>
          <a
            class="flex items-center rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-700"
            href="/admin/reset-password"
          >
            <span class="mx-2 text-sm font-medium">Reset Password</span>
          </a>

        </nav>
  
        <!-- User Profile & Logout -->
        <div class="mt-6">
          {#if data.user}
            <div class="flex items-center justify-between rounded-lg bg-slate-700 p-3">
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-white">{data.user.name}</span>
                <span class="text-xs text-slate-400">{data.user.role}</span>
              </div>
              
              <!-- svelte-ignore a11y_consider_explicit_label -->
              <button on:click={logout} class="text-slate-400 hover:text-red-400" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </aside>
  
    <!-- Main Content Area -->
    <main class="w-full flex-1 overflow-y-auto bg-gray-900">
      <!-- Slot akan merender konten halaman spesifik (dashboard, changelogs, dll.) -->
      <slot />
    </main>
  </div>
  