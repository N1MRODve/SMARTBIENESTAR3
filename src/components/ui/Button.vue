<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, outline, text
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const baseClasses = 'px-4 py-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-secondary text-on-secondary hover:bg-secondary-dark focus:ring-secondary';
    case 'outline':
      return 'border border-outline text-primary hover:bg-primary/10 focus:ring-primary';
    case 'text':
      return 'text-primary hover:bg-primary/10 focus:ring-primary';
    case 'primary':
    default:
      return 'bg-primary text-on-primary hover:bg-primary-dark focus:ring-primary';
  }
});

const disabledClasses = 'disabled:bg-surface-variant disabled:text-on-surface-variant disabled:cursor-not-allowed';

</script>

<template>
  <button :class="[baseClasses, variantClasses, disabledClasses]" :disabled="props.disabled">
    <slot />
  </button>
</template>