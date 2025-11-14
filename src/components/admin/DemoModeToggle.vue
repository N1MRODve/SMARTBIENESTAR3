<template>
  <div class="fixed bottom-6 right-6 z-[1000]">
    <button
      @click="toggleDemoMode"
      :class="[
        'flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-300 shadow-lg',
        isDemoMode
          ? 'bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 hover:shadow-2xl hover:scale-105 animate-pulse-slow'
          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:shadow-xl hover:-translate-y-1'
      ]"
    >
      <Presentation v-if="isDemoMode" class="w-5 h-5" />
      <Eye v-else class="w-5 h-5" />
      <span>{{ isDemoMode ? 'Modo Demo ACTIVO' : 'Activar Modo Demo' }}</span>
    </button>

    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isDemoMode"
        class="absolute bottom-full right-0 mb-4 w-[340px] bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 rounded-2xl shadow-2xl p-5"
      >
        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0">
            <Sparkles class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <strong class="block text-white text-[15px] font-bold mb-1.5">Datos de demostración activos</strong>
            <p class="text-white/90 text-[13px] leading-relaxed m-0">Empresa: SportLife Performance (Sector Deportivo)</p>
          </div>
          <button
            @click="copyDemoInfo"
            class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/30 hover:scale-110 flex-shrink-0"
            title="Copiar información"
          >
            <Copy v-if="!copied" class="w-[18px] h-[18px] text-white" />
            <Check v-else class="w-[18px] h-[18px] text-green-400" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Presentation, Eye, Sparkles, Copy, Check } from 'lucide-vue-next';
import { DEMO_MODE, enableDemoMode, disableDemoMode } from '@/utils/demoData';

const isDemoMode = ref(DEMO_MODE.enabled);
const copied = ref(false);

// Watch for changes in DEMO_MODE
watch(() => DEMO_MODE.enabled, (newVal) => {
  isDemoMode.value = newVal;
});

const toggleDemoMode = () => {
  if (isDemoMode.value) {
    disableDemoMode();
  } else {
    enableDemoMode();
  }

  location.reload();
};

const copyDemoInfo = async () => {
  const info = `
SportLife Performance - Datos Demo
Sector: Deportes y Fitness
Empleados: 120
Departamentos: 6
- Entrenamiento Personal
- Nutrición Deportiva
- Fisioterapia
- Recepción y Atención
- Clases Grupales
- Dirección
  `.trim();

  try {
    await navigator.clipboard.writeText(info);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
