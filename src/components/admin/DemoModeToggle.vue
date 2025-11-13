<template>
  <div class="demo-mode-toggle" :class="{ 'demo-active': isDemoMode }">
    <div class="toggle-container">
      <button @click="toggleDemoMode" class="toggle-button">
        <monitor-icon v-if="isDemoMode" class="icon" />
        <shield-icon v-else class="icon" />
        <span>{{ isDemoMode ? 'Modo Demo ACTIVO' : 'Activar Modo Demo' }}</span>
      </button>

      <div v-if="isDemoMode" class="demo-banner">
        <div class="banner-content">
          <span class="banner-icon">📸</span>
          <div class="banner-text">
            <strong>Datos de demostración activos</strong>
            <p>Empresa: SportLife Performance (Sector Deportivo)</p>
          </div>
          <button @click="copyDemoInfo" class="copy-button" title="Copiar información">
            <span v-if="!copied">📋</span>
            <span v-else>✓</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Monitor as MonitorIcon, Shield as ShieldIcon } from 'lucide-vue-next';
import { DEMO_MODE, enableDemoMode, disableDemoMode } from '@/utils/demoData';

const isDemoMode = ref(DEMO_MODE.enabled);
const copied = ref(false);

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
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.demo-active .toggle-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
  color: white;
  animation: pulse 2s infinite;
}

.icon {
  width: 18px;
  height: 18px;
}

.demo-banner {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  width: 320px;
  background: white;
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.banner-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text strong {
  display: block;
  color: #d97706;
  font-size: 14px;
  margin-bottom: 4px;
}

.banner-text p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.copy-button {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-button:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 8px rgba(245, 158, 11, 0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
