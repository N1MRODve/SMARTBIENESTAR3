<template>
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    <span class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Cargando...'
  }
});
</script>