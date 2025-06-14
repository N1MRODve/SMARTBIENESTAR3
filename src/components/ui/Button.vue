<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

// --- Explicación de las Props ---
// Estas son las "opciones" que nuestro botón aceptará.
// 'variant': Define el estilo visual (primary, outline, etc.).
// 'disabled' y 'loading': Controlan el estado del botón.
const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary', // Por defecto, será un botón primario
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

// --- Explicación de 'computed' ---
// Una propiedad computada es un valor que se calcula automáticamente
// a partir de otros datos (en este caso, las props).
// Aquí la usamos para construir dinámicamente la lista de clases CSS
// que nuestro botón necesitará, basándonos en su variante.
const buttonClass = computed(() => {
  const variantClasses = {
    primary: 'btn-primary', // Esta clase ya la tienes en main.css
    outline: 'btn-outline', // Y esta también
    secondary: 'btn-secondary' // Y esta también
  };
  return ['btn', variantClasses[props.variant] || 'btn-primary'];
});
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || loading">
    <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
    
    <slot />
  </button>
</template>

<style scoped>
/* Estilos que solo se aplican a este componente */
</style>