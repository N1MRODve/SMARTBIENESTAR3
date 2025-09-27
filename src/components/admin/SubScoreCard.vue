<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          <span class="text-lg">{{ icono }}</span>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900">{{ titulo }}</h3>
          <p class="text-xs text-gray-500">{{ descripcion }}</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold" :style="{ color: scoreColor.color }">
          {{ puntuacion.toFixed(1) }}
        </div>
        <div class="text-xs text-gray-500">/ 10</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-3">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Puntuación</span>
        <span>{{ scoreColor.label }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-1000 ease-out"
          :style="{ 
            width: `${(puntuacion / 10) * 100}%`,
            backgroundColor: scoreColor.color
          }"
        ></div>
      </div>
    </div>

    <!-- Trend Indicator -->
    <div v-if="tendencia !== null" class="flex items-center justify-center">
      <div 
        :class="[
          'flex items-center px-2 py-1 rounded-full text-xs font-medium',
          tendencia > 0 ? 'bg-green-100 text-green-800' :
          tendencia < 0 ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        ]"
      >
        <TrendingUp v-if="tendencia > 0" class="h-3 w-3 mr-1" />
        <TrendingDown v-else-if="tendencia < 0" class="h-3 w-3 mr-1" />
        <Minus v-else class="h-3 w-3 mr-1" />
        <span>
          {{ tendencia > 0 ? '+' : '' }}{{ tendencia.toFixed(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';
import { getScoreColor } from '@/services/mock/analytics.service';

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  puntuacion: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 10
  },
  descripcion: {
    type: String,
    default: ''
  },
  icono: {
    type: String,
    default: '📊'
  },
  tendencia: {
    type: Number,
    default: null
  }
});

// Computed properties
const scoreColor = computed(() => getScoreColor(props.puntuacion));
</script>

<style scoped>
/* Ensure consistent card heights */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-1000 {
  transition-duration: 1000ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
</style>