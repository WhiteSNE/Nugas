<script lang="ts">
  import "../app.css";

  import { authStore } from "$lib/stores/authStore";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $: {
      if (data.auth) {
          if (data.auth.token !== $authStore.token) {
              $authStore = data.auth;
          }
      }
  }
</script>

<div class="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
  <main class="flex-1">
      <slot />
  </main>
</div>