<template>
  <div class="flex flex-col items-center">
    <!-- Gauge Container -->
    <div class="relative w-48 h-48 mb-4">
      <!-- Background Circle -->
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background Arc -->
        <path
          :d="backgroundPath"
          fill="none"
          stroke="#E5E7EB"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />
        <!-- Progress Arc -->
        <path
          :d="progressPath"
          fill="none"
          :stroke="scoreColor.color"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          class="transition-all duration-1000 ease-out"
          :style="{ strokeDasharray: `${progressLength} ${totalLength}` }"
        />
      </svg>
      
      <!-- Center Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-4xl font-bold" :style="{ color: scoreColor.color }">
          {{ displayScore }}
        </div>
        <div class="text-sm text-gray-500 mt-1">/ 10</div>
        <div class="text-xs font-medium mt-2 px-2 py-1 rounded-full" 
             :style="{ 
               backgroundColor: scoreColor.color + '20', 
               color: scoreColor.color 
             }">
          {{ scoreColor.label }}
        </div>
      </div>
    </div>

    <!-- Title and Description -->
    <div class="text-center">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-600">{{ description }}</p>
      
      <!-- Trend Indicator -->
      <div v-if="trend !== null" class="flex items-center justify-center mt-2">
        <TrendingUp v-if="trend > 0" class="h-4 w-4 text-green-600 mr-1" />
        <TrendingDown v-else-if="trend < 0" class="h-4 w-4 text-red-600 mr-1" />
        <Minus v-else class="h-4 w-4 text-gray-400 mr-1" />
        <span 
          :class="[
            'text-sm font-medium',
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'
          ]"
        >
          {{ trend > 0 ? '+' : '' }}{{ trend.toFixed(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';
import { getScoreColor } from '@/services/mock/analytics.service';

const props = defineProps({
  score: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 10
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  trend: {
    type: Number,
    default: null
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
});

// Animation state
const displayScore = ref(0);
const animationProgress = ref(0);

// Computed properties
const scoreColor = computed(() => getScoreColor(props.score));

const strokeWidth = computed(() => {
  const widths = { small: 8, medium: 6, large: 4 };
  return widths[props.size];
});

// SVG Path calculations for semicircle gauge
const radius = 45;
const circumference = Math.PI * radius; // Half circle
const totalLength = circumference;

const backgroundPath = computed(() => {
  return `M 10 50 A ${radius} ${radius} 0 0 1 90 50`;
});

const progressPath = computed(() => {
  return backgroundPath.value;
});

const progressLength = computed(() => {
  const percentage = (animationProgress.value / 10) * 100;
  return (percentage / 100) * totalLength;
});

// Animation
onMounted(() => {
  // Animate the score display
  const duration = 2000; // 2 seconds
  const steps = 60;
  const increment = props.score / steps;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  const timer = setInterval(() => {
    currentStep++;
    displayScore.value = Math.min(increment * currentStep, props.score);
    animationProgress.value = displayScore.value;
    
    if (currentStep >= steps) {
      clearInterval(timer);
      displayScore.value = props.score;
      animationProgress.value = props.score;
    }
  }, stepDuration);
});
</script>

<style scoped>
/* Ensure smooth animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>