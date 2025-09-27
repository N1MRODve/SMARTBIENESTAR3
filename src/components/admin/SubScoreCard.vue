<script setup>
import { computed } from 'vue';

const props = defineProps({
  titulo: {
    type: String,
    required: true,
  },
  puntuacion: {
    type: Number,
    required: true,
  },
});

// Lógica para determinar el color de la barra de progreso
const progressBarColorClass = computed(() => {
  if (props.puntuacion >= 8) {
    return 'bg-green-500'; // Verde para puntuaciones altas
  } else if (props.puntuacion >= 5) {
    return 'bg-yellow-500'; // Amarillo para puntuaciones medias
  } else {
    return 'bg-red-500'; // Rojo para puntuaciones bajas
  }
});

// Calcula el ancho de la barra de progreso en porcentaje
const progressWidth = computed(() => {
  return `${props.puntuacion * 10}%`; // Puntuación sobre 10
});
</script>

<template>
  <div class="p-4 bg-background rounded-lg border border-surface-variant">
    <div class="flex justify-between items-baseline">
      <p class="font-semibold text-on-background">{{ titulo }}</p>
      <p class="text-2xl font-bold text-secondary-dark">{{ puntuacion }}</p>
    </div>
    <div class="w-full bg-surface-variant rounded-full h-2 mt-2">
      <div 
        class="h-2 rounded-full" 
        :class="progressBarColorClass" 
        :style="{ width: progressWidth }"
      ></div>
    </div>
  </div>
</template>