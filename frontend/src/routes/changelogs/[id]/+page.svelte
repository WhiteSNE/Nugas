<script lang="ts">
    export let data;
  </script>
  
  <!-- Full dark background page -->
  <div class="min-h-screen bg-gray-900 text-white pt-16 pb-10 px-4">
    <section class="max-w-4xl mx-auto">
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
          {data.changelog.title}
        </h1>
  
        <p class="text-sm text-slate-400 mb-6">
          Dipublikasikan pada {new Date(data.changelog.published_at).toLocaleDateString()}
        </p>
  
        <img
          src={data.changelog.image_url || '/placeholder-news.jpg'}
          alt={data.changelog.title}
          class="rounded-md w-full max-h-[400px] object-cover mb-6 border border-slate-700"
        />
  
        <article class="prose prose-invert max-w-none text-slate-200">
          {@html data.changelog.content}
        </article>
      </div>
    </section>
  </div>
  