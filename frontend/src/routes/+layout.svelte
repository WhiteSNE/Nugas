<script>
  // 1. Import your global stylesheet so it applies to every page
  import "../app.css";
</script>
<div class="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
  <main class="flex-1">
    <slot />
  </main>
</div>
