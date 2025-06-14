<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRight } from 'lucide-vue-next';

// Este componente es más genérico. Acepta todo lo que necesita para dibujarse.
defineProps({
  title: String,
  value: [String, Number],
  icon: Object, // Aceptará el componente del ícono directamente
  colorClass: String, // para el color del ícono (ej. 'text-blue-600')
  bgColorClass: String, // para el fondo del ícono (ej. 'bg-blue-100')
  actionText: String,
  actionTo: String,
});
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
    <div>
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
            <div :class="['p-3 rounded-full', bgColorClass]">
                <component :is="icon" :class="['h-6 w-6', colorClass]" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">{{ title }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
            </div>
        </div>
      </div>
    </div>
    <div v-if="actionText && actionTo" class="mt-4">
      <router-link :to="actionTo" class="text-sm font-medium text-primary hover:text-primary-dark flex items-center group">
        {{ actionText }}
        <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </router-link>
    </div>
  </div>
</template>