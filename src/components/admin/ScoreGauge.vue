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
          class="transition-all duration-2000 ease-out"
          :stroke-dasharray="progressDashArray"
          :stroke-dashoffset="progressDashOffset"
        />
      </svg>
      
      <!-- Center Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-4xl font-bold" :style="{ color: scoreColor.color }">
          {{ animatedScore.toFixed(1) }}
        </div>
        <div class="text-sm text-gray-500 font-medium">/ 10</div>
        <div class="text-xs text-gray-400 mt-1">{{ scoreColor.label }}</div>
      </div>
    </div>

    <!-- Title and Description -->
    <div class="text-center max-w-xs">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600 leading-relaxed mb-3">{{ description }}</p>
      
      <!-- Trend Indicator -->
      <div v-if="trend !== null" class="flex items-center justify-center">
        <div 
          :class="[
            'flex items-center px-3 py-1 rounded-full text-sm font-medium',
            trend > 0 ? 'bg-green-100 text-green-800' :
            trend < 0 ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          ]"
        >
          <TrendingUp v-if="trend > 0" class="h-4 w-4 mr-1" />
          <TrendingDown v-else-if="trend < 0" class="h-4 w-4 mr-1" />
          <Minus v-else class="h-4 w-4 mr-1" />
          <span>
            {{ trend > 0 ? '+' : '' }}{{ trend.toFixed(1) }} vs. anterior
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';

// Helper function to get score color and label
const getScoreColor = (score) => {
  if (score >= 8) return { color: '#10b981', label: 'Excelente' };
  if (score >= 6) return { color: '#f59e0b', label: 'Bueno' };
  if (score >= 4) return { color: '#f97316', label: 'Regular' };
  return { color: '#ef4444', label: 'Crítico' };
};

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
  }
});

// Reactive state
const animatedScore = ref(0);
const strokeWidth = 8;
const radius = 40;
const circumference = 2 * Math.PI * radius;

// Computed properties
const scoreColor = computed(() => getScoreColor(props.score));

const backgroundPath = computed(() => {
  const startAngle = 0;
  const endAngle = Math.PI; // 180 degrees for semicircle
  
  const x1 = 50 + radius * Math.cos(startAngle);
  const y1 = 50 + radius * Math.sin(startAngle);
  const x2 = 50 + radius * Math.cos(endAngle);
  const y2 = 50 + radius * Math.sin(endAngle);
  
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
});

const progressPath = computed(() => {
  const startAngle = 0;
  const scorePercentage = animatedScore.value / 10;
  const endAngle = startAngle + (Math.PI * scorePercentage);
  
  const x1 = 50 + radius * Math.cos(startAngle);
  const y1 = 50 + radius * Math.sin(startAngle);
  const x2 = 50 + radius * Math.cos(endAngle);
  const y2 = 50 + radius * Math.sin(endAngle);
  
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
  
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
});

const progressDashArray = computed(() => {
  const arcLength = Math.PI * radius; // Half circumference for semicircle
  return `${arcLength} ${arcLength}`;
});

const progressDashOffset = computed(() => {
  const arcLength = Math.PI * radius;
  const scorePercentage = animatedScore.value / 10;
  return arcLength * (1 - scorePercentage);
});

// Animation function
const animateScore = () => {
  const duration = 2000; // 2 seconds
  const startTime = Date.now();
  const startValue = animatedScore.value;
  const endValue = props.score;
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    animatedScore.value = startValue + (endValue - startValue) * easeOut;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Lifecycle
onMounted(() => {
  // Start animation after component is mounted
  setTimeout(() => {
    animateScore();
  }, 100);
});

// Watch for score changes
watch(() => props.score, () => {
  animateScore();
});
</script>

<style scoped>
/* Ensure smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-2000 {
  transition-duration: 2000ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
</style>