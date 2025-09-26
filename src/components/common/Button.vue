<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      loading ? 'opacity-80 cursor-not-allowed' : '',
      className
    ]"
    :disabled="loading || disabled"
    v-bind="$attrs"
  >
    <template v-if="loading">
      <Loader2 class="w-4 h-4 mr-2 animate-spin" />
      <span>Cargando...</span>
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
});

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};
</script>