<script lang="ts"> // Menambahkan lang="ts" adalah praktik yang baik
    // Menerima data dari load function
    export let data;
  
    // Fungsi helper untuk memformat tanggal dengan tipe data yang benar
    function formatDate(dateString: string) {
      // Definisikan tipe untuk objek options
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    }
  </script>
  
  <div class="bg-gray-900 min-h-screen p-4 md:p-8 text-white">
    </div>
  
  <div class="bg-gray-900 min-h-screen p-4 md:p-8 text-white">
    <div class="max-w-4xl mx-auto">
      
      <h1 class="text-4xl md:text-5xl font-bold border-b-2 border-slate-700 pb-4 mb-8">
        Changelogs & News
      </h1>
  
      {#if data.error}
        <p class="text-center text-red-400">{data.error}</p>
      {:else if data.changelogs.length === 0}
        <p class="text-center text-slate-400">Belum ada berita atau changelog yang dipublikasikan.</p>
      {/if}
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.changelogs as changelog (changelog.id)}
          <a href="/changelogs/{changelog.id}" class="group block bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
            
            <div class="h-40 bg-cover bg-center" style="background-image: url({changelog.image_url || '/placeholder-news.jpg'})">
            </div>
  
            <div class="p-4">
              <h2 class="text-lg font-bold truncate group-hover:text-blue-400 transition-colors">
                {changelog.title}
              </h2>
  
              <p class="text-xs text-slate-400 mt-2">
                Dipublikasikan pada {formatDate(changelog.published_at)}
              </p>
  
              </div>
          </a>
        {/each}
      </div>
    </div>
  </div>