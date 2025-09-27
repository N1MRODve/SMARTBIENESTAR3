<template>
  <div 
    :class="[
      'bg-white rounded-lg shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow duration-200',
      borderColorClass
    ]"
  >
    <div class="flex items-start">
      <!-- Icon -->
      <div 
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4',
          backgroundColorClass
        ]"
      >
        <span class="text-2xl">{{ insight.icon }}</span>
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h3 :class="['text-lg font-semibold', textColorClass]">
            {{ insight.title }}
          </h3>
          <div v-if="insight.score" class="flex items-center">
            <span :class="['text-sm font-bold', textColorClass]">
              {{ insight.score.toFixed(1) }}/10
            </span>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm leading-relaxed mb-3">
          {{ insight.description }}
        </p>
        
        <!-- Action Suggestions -->
        <div v-if="actionSuggestion" class="mt-4">
          <div class="flex items-start">
            <Lightbulb class="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <p class="text-xs text-gray-500 italic">
              {{ actionSuggestion }}
            </p>
          </div>
        </div>
        
        <!-- Progress Bar for Scores -->
        <div v-if="insight.score && showProgressBar" class="mt-4">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Puntuación</span>
            <span>{{ insight.score.toFixed(1) }}/10</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              :class="['h-2 rounded-full transition-all duration-1000 ease-out', progressColorClass]"
              :style="{ width: `${(insight.score / 10) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Lightbulb } from 'lucide-vue-next';

const props = defineProps({
  insight: {
    type: Object,
    required: true,
    validator: (insight) => {
      return insight && 
             typeof insight.title === 'string' && 
             typeof insight.description === 'string' &&
             ['strength', 'weakness'].includes(insight.type);
    }
  },
  showProgressBar: {
    type: Boolean,
    default: true
  }
});

// Computed properties for styling based on insight type
const isStrength = computed(() => props.insight.type === 'strength');

const borderColorClass = computed(() => 
  isStrength.value ? 'border-green-500' : 'border-orange-500'
);

const backgroundColorClass = computed(() => 
  isStrength.value ? 'bg-green-100' : 'bg-orange-100'
);

const textColorClass = computed(() => 
  isStrength.value ? 'text-green-800' : 'text-orange-800'
);

const progressColorClass = computed(() => 
  isStrength.value ? 'bg-green-500' : 'bg-orange-500'
);

// Action suggestions based on insight type and score
const actionSuggestion = computed(() => {
  if (isStrength.value) {
    return 'Mantener y potenciar estas buenas prácticas como ejemplo para otras áreas.';
  } else {
    if (props.insight.score && props.insight.score < 5) {
      return 'Requiere atención inmediata. Considerar implementar acciones correctivas.';
    } else {
      return 'Oportunidad de mejora. Evaluar posibles intervenciones y servicios de bienestar.';
    }
  }
});
</script>

<style scoped>
/* Ensure consistent card heights */
.min-w-0 {
  min-width: 0;
}
</style>