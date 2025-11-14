<template>
  <div class="demo-mode-toggle" :class="{ 'demo-active': isDemoMode }">
    <div class="toggle-container">
      <button @click="toggleDemoMode" class="toggle-button">
        <Presentation v-if="isDemoMode" class="icon" />
        <Eye v-else class="icon" />
        <span>{{ isDemoMode ? 'Modo Demo ACTIVO' : 'Activar Modo Demo' }}</span>
      </button>

      <div v-if="isDemoMode" class="demo-banner">
        <div class="banner-content">
          <div class="banner-icon-wrapper">
            <Sparkles class="banner-icon" />
          </div>
          <div class="banner-text">
            <strong>Datos de demostración activos</strong>
            <p>Empresa: SportLife Performance (Sector Deportivo)</p>
          </div>
          <button @click="copyDemoInfo" class="copy-button" title="Copiar información">
            <Copy v-if="!copied" class="copy-icon" />
            <Check v-else class="copy-icon check-icon" />
          </button>
        </div>
      </div>
    </div>
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
.demo-mode-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.toggle-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.toggle-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.demo-active .toggle-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.demo-active .toggle-button:hover {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
}

.icon {
  width: 20px;
  height: 20px;
}

.demo-banner {
  position: absolute;
  bottom: calc(100% + 16px);
  right: 0;
  width: 340px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.3);
  animation: slideUp 0.3s ease;
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.banner-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.banner-text {
  flex: 1;
}

.banner-text strong {
  display: block;
  color: white;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.banner-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.5;
}

.copy-button {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.copy-icon {
  width: 18px;
  height: 18px;
  color: white;
}

.check-icon {
  color: #10b981;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4), 0 0 0 0 rgba(245, 87, 108, 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4), 0 0 0 12px rgba(245, 87, 108, 0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
