<template>
  <Dialog 
    v-model:visible="isVisible" 
    modal 
    :header="recompensa ? 'Editar Recompensa' : 'Nueva Recompensa'"
    :style="{ width: '600px' }"
    :closable="!loading"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nombre -->
      <div class="form-group">
        <label for="nombre" class="form-label">
          Nombre de la Recompensa *
        </label>
        <input
          id="nombre"
          v-model="formData.nombre"
          type="text"
          class="input"
          placeholder="Ej: Día Libre Adicional"
          required
          :disabled="loading"
        />
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label for="descripcion" class="form-label">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          v-model="formData.descripcion"
          rows="3"
          class="input resize-none"
          placeholder="Describe brevemente la recompensa..."
          required
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Costo y Categoría -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="costo_puntos" class="form-label">
            Costo en Puntos *
          </label>
          <input
            id="costo_puntos"
            v-model="formData.costo_puntos"
            type="number"
            class="input"
            min="1"
            max="10000"
            step="5"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="categoria" class="form-label">
            Categoría *
          </label>
          <select
            id="categoria"
            v-model="formData.categoria"
            class="input"
            required
            :disabled="loading"
          >
            <option value="">Selecciona categoría</option>
            <option value="tiempo">Tiempo Libre</option>
            <option value="bienestar">Bienestar</option>
            <option value="gastronomia">Gastronomia</option>
            <option value="compras">Compras</option>
            <option value="entretenimiento">Entretenimiento</option>
            <option value="comodidad">Comodidad</option>
            <option value="salud">Salud</option>
          </select>
        </div>
      </div>

      <!-- Stock y Estado -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="stock" class="form-label">
            Stock disponible
          </label>
          <input
            id="stock"
            v-model="formData.stock"
            type="number"
            class="input"
            min="-1"
            :disabled="loading"
          />
          <p class="mt-1 text-xs text-gray-500">
            -1 = ilimitado
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">
            Estado
          </label>
          <div class="flex items-center space-x-3 mt-2">
            <input
              id="activa"
              v-model="formData.activa"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              :disabled="loading"
            />
            <label for="activa" class="text-sm text-gray-700">
              Activa para canje
            </label>
          </div>
        </div>
      </div>

      <!-- Vista Previa -->
      <div class="form-group">
        <label class="form-label">Vista Previa</label>
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 shadow-sm">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ formData.nombre || 'Nombre de la recompensa' }}</h4>
              <p class="text-sm text-gray-600">{{ formData.descripcion || 'Descripcion de la recompensa' }}</p>
              <div class="flex items-center mt-1">
                <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700">{{ formData.costo_puntos || 0 }} puntos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-4">
        <Button 
          @click="cerrarModal"
          variant="outline"
          :disabled="loading"
        >
          Cancelar
        </Button>
        <Button 
          @click="handleSubmit"
          :loading="loading"
          :disabled="!formularioValido"
        >
          <Save class="h-4 w-4 mr-2" />
          {{ recompensa ? 'Actualizar' : 'Crear' }} Recompensa
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from '@/components/common/Button.vue';
import { Save } from 'lucide-vue-next';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  recompensa: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'save']);

// Local state - campos alineados con schema de BD
const formData = ref({
  nombre: '',
  descripcion: '',
  costo_puntos: 100,
  categoria: '',
  stock: -1,  // -1 = ilimitado
  activa: true
});

// Computed properties
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const formularioValido = computed(() => {
  return formData.value.nombre.trim() &&
         formData.value.descripcion.trim() &&
         formData.value.costo_puntos > 0 &&
         formData.value.categoria;
});

// Methods
const cerrarModal = () => {
  emit('update:visible', false);
  resetFormulario();
};

const resetFormulario = () => {
  formData.value = {
    nombre: '',
    descripcion: '',
    costo_puntos: 100,
    categoria: '',
    stock: -1,
    activa: true
  };
};

const handleSubmit = () => {
  if (!formularioValido.value) return;
  
  emit('save', { ...formData.value });
};

// Watch for recompensa prop changes (edit mode)
watch(() => props.recompensa, (nuevaRecompensa) => {
  if (nuevaRecompensa) {
    formData.value = {
      nombre: nuevaRecompensa.nombre || '',
      descripcion: nuevaRecompensa.descripcion || '',
      costo_puntos: nuevaRecompensa.costo_puntos || 100,
      categoria: nuevaRecompensa.categoria || '',
      stock: nuevaRecompensa.stock ?? -1,
      activa: nuevaRecompensa.activa !== false
    };
  } else {
    resetFormulario();
  }
}, { immediate: true });

// Watch for modal visibility changes
watch(() => props.visible, (visible) => {
  if (!visible) {
    resetFormulario();
  }
});
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary;
}
</style>