<script setup>
import { defineProps } from 'vue';
import Button from '@/components/ui/Button.vue';

defineProps({
  icon: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionText: {
    type: String,
    default: null
  },
  actionIcon: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <component :is="icon" class="h-10 w-10 text-gray-400" />
    </div>

    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <p class="text-gray-600 text-center max-w-md mb-6">
      {{ description }}
    </p>

    <Button v-if="actionText" @click="emit('action')" class="mt-2">
      <component v-if="actionIcon" :is="actionIcon" class="h-4 w-4 mr-2" />
      {{ actionText }}
    </Button>
  </div>
</template>
