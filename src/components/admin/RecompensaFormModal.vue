<template>
  <Dialog 
    v-model:visible="isVisible" 
    modal 
    :header="recompensa ? 'Editar Recompensa' : 'Nueva Recompensa'"
    :style="{ width: '600px' }"
    :closable="!loading"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Título -->
      <div class="form-group">
        <label for="titulo" class="form-label">
          Título de la Recompensa *
        </label>
        <input
          id="titulo"
          v-model="formData.titulo"
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

      <!-- Coste y Categoría -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="coste" class="form-label">
            Coste en Puntos *
          </label>
          <input
            id="coste"
            v-model="formData.coste"
            type="number"
            class="input"
            min="1"
            max="1000"
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
            <option value="tiempo">⏰ Tiempo Libre</option>
            <option value="bienestar">💆‍♀️ Bienestar</option>
            <option value="gastronomia">🍽️ Gastronomía</option>
            <option value="compras">🎁 Compras</option>
            <option value="entretenimiento">🎬 Entretenimiento</option>
            <option value="comodidad">🚗 Comodidad</option>
            <option value="salud">🥗 Salud</option>
          </select>
        </div>
      </div>

      <!-- Icono -->
      <div class="form-group">
        <label for="icono" class="form-label">
          Icono (Emoji) *
        </label>
        <div class="flex items-center space-x-3">
          <input
            id="icono"
            v-model="formData.icono"
            type="text"
            class="input flex-1"
            placeholder="🎁"
            maxlength="2"
            required
            :disabled="loading"
          />
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">{{ formData.icono || '❓' }}</span>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          Usa un emoji que represente la recompensa
        </p>
      </div>

      <!-- Popularidad y Disponibilidad -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="popularidad" class="form-label">
            Popularidad (1-5 estrellas)
          </label>
          <select
            id="popularidad"
            v-model="formData.popularidad"
            class="input"
            :disabled="loading"
          >
            <option :value="1">⭐ (1 estrella)</option>
            <option :value="2">⭐⭐ (2 estrellas)</option>
            <option :value="3">⭐⭐⭐ (3 estrellas)</option>
            <option :value="4">⭐⭐⭐⭐ (4 estrellas)</option>
            <option :value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            Estado
          </label>
          <div class="flex items-center space-x-3 mt-2">
            <input
              id="disponible"
              v-model="formData.disponible"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              :disabled="loading"
            />
            <label for="disponible" class="text-sm text-gray-700">
              Disponible para canje
            </label>
          </div>
        </div>
      </div>

      <!-- Vista Previa -->
      <div class="form-group">
        <label class="form-label">Vista Previa</label>
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
              <span class="text-2xl">{{ formData.icono || '❓' }}</span>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ formData.titulo || 'Título de la recompensa' }}</h4>
              <p class="text-sm text-gray-600">{{ formData.descripcion || 'Descripción de la recompensa' }}</p>
              <div class="flex items-center mt-1">
                <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700">{{ formData.coste || 0 }} puntos</span>
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

// Local state
const formData = ref({
  titulo: '',
  descripcion: '',
  coste: 100,
  categoria: '',
  icono: '🎁',
  popularidad: 3,
  disponible: true
});

// Computed properties
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const formularioValido = computed(() => {
  return formData.value.titulo.trim() &&
         formData.value.descripcion.trim() &&
         formData.value.coste > 0 &&
         formData.value.categoria &&
         formData.value.icono.trim();
});

// Methods
const cerrarModal = () => {
  emit('update:visible', false);
  resetFormulario();
};

const resetFormulario = () => {
  formData.value = {
    titulo: '',
    descripcion: '',
    coste: 100,
    categoria: '',
    icono: '🎁',
    popularidad: 3,
    disponible: true
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
      titulo: nuevaRecompensa.titulo || '',
      descripcion: nuevaRecompensa.descripcion || '',
      coste: nuevaRecompensa.coste || 100,
      categoria: nuevaRecompensa.categoria || '',
      icono: nuevaRecompensa.icono || '🎁',
      popularidad: nuevaRecompensa.popularidad || 3,
      disponible: nuevaRecompensa.disponible !== false
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