<script setup>
import { Loader2 } from 'lucide-vue-next';

defineProps({
  text: {
    type: String,
    default: 'Cargando...'
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
    <Loader2 class="h-8 w-8 text-primary animate-spin" />
    <p class="mt-4 text-lg font-medium text-gray-700">{{ text }}</p>
    <p class="mt-1 text-sm text-gray-500">Por favor, espera un momento.</p>
  </div>
</template>

<style scoped>
/* No necesitamos estilos adicionales por ahora, TailwindCSS hace el trabajo. */
</style>