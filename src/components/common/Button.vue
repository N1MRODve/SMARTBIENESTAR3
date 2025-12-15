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
    validator: (value) => ['primary', 'secondary', 'outline', 'destructive', 'ghost', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
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
  primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 shadow-sm',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-white',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 shadow-sm'
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};
</script>