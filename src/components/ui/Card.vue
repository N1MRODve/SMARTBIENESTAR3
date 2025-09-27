<script setup>
// Este componente es puramente visual, por lo que no necesita lógica de script compleja.
</script>

<template>
  <div class="bg-surface rounded-xl shadow-sm border border-surface-variant flex flex-col">
    <header v-if="$slots.header" class="p-4 border-b border-surface-variant">
      <slot name="header" />
    </header>

    <main class="p-6 flex-grow">
      <slot />
    </main>

    <footer v-if="$slots.footer" class="bg-surface-variant/30 p-4 border-t border-surface-variant">
      <slot name="footer" />
    </footer>
  </div>
</template>