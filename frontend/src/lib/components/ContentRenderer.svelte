<script lang="ts">
    import { onMount } from 'svelte';
    import { generateHTML } from '@tiptap/html';
    import StarterKit from '@tiptap/starter-kit';
    import Image from '@tiptap/extension-image';
    import Underline from '@tiptap/extension-underline';
    import TextAlign from '@tiptap/extension-text-align';
  
    export let jsonContent: object;
  
    let htmlContent = '';
  
    const extensions = [
      StarterKit,
      Image,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ];
  
    $: if (jsonContent) {
      try {
        const contentObject = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
        htmlContent = generateHTML(contentObject, extensions);
      } catch (e) {
        console.error("Gagal mem-parsing atau me-render konten:", e);
        htmlContent = '<p>Konten tidak dapat ditampilkan.</p>';
      }
    }
  </script>
  
  <article class="prose prose-invert max-w-none text-slate-300 prose-p:my-4 prose-h2:mt-6 prose-h2:mb-2">
      {@html htmlContent}
  </article>
    