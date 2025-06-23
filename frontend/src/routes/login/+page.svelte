<script lang="ts">
    // Impor ActionData untuk mendapatkan tipe data dari form action
    import type { ActionData } from './$types';
  
    // `form` akan berisi data yang dikembalikan oleh action jika terjadi error
    export let form: ActionData;
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-slate-700">
      <h1 class="text-3xl font-bold text-center">Admin Panel Login</h1>
  
      <form method="POST" class="space-y-6">
        
        {#if form?.message}
          <div class="p-3 text-sm rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
            {form.message}
          </div>
        {/if}
  
        <div>
          <label for="email" class="block text-sm font-medium text-slate-300">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            required 
            value={form?.email || ''}
            class="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            required 
            class="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <button type="submit" class="w-full py-2 px-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors">
          Login
        </button>
      </form>
    </div>
  </div>