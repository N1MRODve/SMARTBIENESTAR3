<template>
  <!-- Overlay -->
  <div 
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="cerrarSiClickFuera"
  >
    <!-- Modal -->
    <div 
      ref="modalRef"
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ modo === 'crear' ? 'Nueva Sesión' : 'Editar Sesión' }}
          </h2>
          <button
            @click="$emit('cerrar')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardar" class="p-6 space-y-6">
        <!-- Información básica -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Título -->
          <div class="lg:col-span-1">
            <label class="form-label">Título de la sesión *</label>
            <input
              v-model="form.titulo"
              type="text"
              class="input"
              placeholder="Ej: Yoga para principiantes"
              required
            />
          </div>

          <!-- Servicio -->
          <div class="lg:col-span-1">
            <label class="form-label">Tipo de servicio *</label>
            <select v-model="form.servicio_id" class="input" required>
              <option value="">Seleccionar servicio</option>
              <option 
                v-for="servicio in servicios" 
                :key="servicio.id" 
                :value="servicio.id"
              >
                {{ servicio.nombre }} ({{ servicio.tipo }})
              </option>
            </select>
          </div>

          <!-- Colaborador -->
          <div class="lg:col-span-1">
            <label class="form-label">Colaborador *</label>
            <select v-model="form.colaborador_id" class="input" required>
              <option value="">Seleccionar colaborador</option>
              <option 
                v-for="colaborador in colaboradores" 
                :key="colaborador.id" 
                :value="colaborador.id"
              >
                {{ colaborador.nombre }} {{ colaborador.apellido }} - {{ colaborador.especialidad }}
              </option>
            </select>
          </div>

          <!-- Empresa (opcional) -->
          <div class="lg:col-span-1">
            <label class="form-label">Empresa específica</label>
            <select v-model="form.empresa_id" class="input">
              <option value="">Todas las empresas</option>
              <option 
                v-for="empresa in empresas" 
                :key="empresa.id" 
                :value="empresa.id"
              >
                {{ empresa.nombre }}
              </option>
            </select>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="form-label">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            class="input"
            placeholder="Describe brevemente la sesión..."
          ></textarea>
        </div>

        <!-- Fecha y hora -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Fecha -->
          <div>
            <label class="form-label">Fecha *</label>
            <input
              v-model="form.fecha"
              type="date"
              class="input"
              :min="fechaMinima"
              required
            />
          </div>

          <!-- Hora inicio -->
          <div>
            <label class="form-label">Hora inicio *</label>
            <input
              v-model="form.hora_inicio"
              type="time"
              class="input"
              required
            />
          </div>

          <!-- Hora fin -->
          <div>
            <label class="form-label">Hora fin *</label>
            <input
              v-model="form.hora_fin"
              type="time"
              class="input"
              required
            />
          </div>
        </div>

        <!-- Configuración de la sesión -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Modalidad -->
          <div>
            <label class="form-label">Modalidad *</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  v-model="form.modalidad" 
                  type="radio" 
                  value="online" 
                  class="mr-2"
                />
                <Globe class="h-4 w-4 mr-2 text-blue-500" />
                Online
              </label>
              <label class="flex items-center">
                <input 
                  v-model="form.modalidad" 
                  type="radio" 
                  value="presencial" 
                  class="mr-2"
                />
                <MapPin class="h-4 w-4 mr-2 text-green-500" />
                Presencial
              </label>
            </div>
          </div>

          <!-- Capacidad máxima -->
          <div>
            <label class="form-label">Capacidad máxima *</label>
            <input
              v-model.number="form.capacidad_maxima"
              type="number"
              min="1"
              max="100"
              class="input"
              placeholder="Ej: 15"
              required
            />
          </div>
        </div>

        <!-- Ubicación/Enlace según modalidad -->
        <div v-if="form.modalidad === 'presencial'">
          <label class="form-label">Ubicación</label>
          <input
            v-model="form.ubicacion"
            type="text"
            class="input"
            placeholder="Ej: Sala de yoga, segundo piso"
          />
        </div>

        <div v-if="form.modalidad === 'online'" class="space-y-4">
          <div>
            <label class="form-label">Enlace de reunión</label>
            <input
              v-model="form.enlace_reunion"
              type="url"
              class="input"
              placeholder="https://zoom.us/j/..."
            />
          </div>
          <div>
            <label class="form-label">Código de acceso</label>
            <input
              v-model="form.codigo_acceso"
              type="text"
              class="input"
              placeholder="Código opcional para acceder"
            />
          </div>
        </div>

        <!-- Configuraciones adicionales -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuraciones adicionales</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Puntos por asistencia -->
            <div>
              <label class="form-label">Puntos por asistencia</label>
              <input
                v-model.number="form.puntos_asistencia"
                type="number"
                min="0"
                max="100"
                class="input"
                placeholder="0"
              />
            </div>

            <!-- Recordatorio -->
            <div>
              <label class="form-label">Recordatorio (horas antes)</label>
              <select v-model="form.recordatorio_horas" class="input">
                <option value="1">1 hora</option>
                <option value="2">2 horas</option>
                <option value="6">6 horas</option>
                <option value="12">12 horas</option>
                <option value="24">24 horas</option>
                <option value="48">48 horas</option>
              </select>
            </div>
          </div>

          <!-- Opciones -->
          <div class="mt-6 space-y-3">
            <label class="flex items-center">
              <input 
                v-model="form.sesion_grabable" 
                type="checkbox" 
                class="mr-3"
              />
              <span class="text-sm font-medium text-gray-700">Permitir grabación</span>
            </label>

            <label class="flex items-center">
              <input 
                v-model="form.permitir_lista_espera" 
                type="checkbox" 
                class="mr-3"
              />
              <span class="text-sm font-medium text-gray-700">Permitir lista de espera</span>
            </label>
          </div>
        </div>

        <!-- Notas internas -->
        <div>
          <label class="form-label">Notas internas</label>
          <textarea
            v-model="form.notas_internas"
            rows="2"
            class="input"
            placeholder="Notas que solo verá el equipo administrativo..."
          ></textarea>
        </div>

        <!-- Indicaciones previas -->
        <div>
          <label class="form-label">Indicaciones para participantes</label>
          <textarea
            v-model="form.indicaciones_previas"
            rows="3"
            class="input"
            placeholder="Instrucciones especiales, materiales necesarios, preparación previa..."
          ></textarea>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="guardando"
            class="btn btn-primary"
          >
            <span v-if="guardando" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </span>
            <span v-else>
              {{ modo === 'crear' ? 'Crear Sesión' : 'Actualizar Sesión' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { X, Globe, MapPin } from 'lucide-vue-next';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  sesion: {
    type: Object,
    default: null
  },
  modo: {
    type: String,
    default: 'crear'
  }
});

const emit = defineEmits(['cerrar', 'guardar']);

// Estado reactivo
const guardando = ref(false);
const servicios = ref([]);
const colaboradores = ref([]);
const empresas = ref([]);

const form = reactive({
  titulo: '',
  servicio_id: '',
  colaborador_id: '',
  empresa_id: '',
  descripcion: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
  modalidad: 'online',
  capacidad_maxima: 10,
  ubicacion: '',
  enlace_reunion: '',
  codigo_acceso: '',
  puntos_asistencia: 0,
  recordatorio_horas: 24,
  sesion_grabable: false,
  permitir_lista_espera: true,
  notas_internas: '',
  indicaciones_previas: ''
});

// Computed
const fechaMinima = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Métodos
const cargarDatos = async () => {
  try {
    // Cargar servicios
    const { data: serviciosData } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('nombre');
    
    servicios.value = serviciosData || [];

    // Cargar colaboradores
    const { data: colaboradoresData } = await supabase
      .from('usuarios')
      .select(`
        *,
        perfil_colaboradores(especialidad, estado)
      `)
      .eq('tipo_usuario', 'colaborador')
      .eq('activo', true);
    
    colaboradores.value = colaboradoresData?.filter(c => 
      c.perfil_colaboradores?.estado === 'verificado'
    ).map(c => ({
      ...c,
      especialidad: c.perfil_colaboradores?.especialidad
    })) || [];

    // Cargar empresas
    const { data: empresasData } = await supabase
      .from('empresas')
      .select('id, nombre')
      .eq('activo', true)
      .order('nombre');
    
    empresas.value = empresasData || [];

  } catch (error) {
    console.error('Error cargando datos:', error);
  }
};

const guardar = async () => {
  try {
    guardando.value = true;
    
    // Construir objeto de datos
    const fechaHoraInicio = new Date(`${form.fecha}T${form.hora_inicio}`);
    const fechaHoraFin = new Date(`${form.fecha}T${form.hora_fin}`);
    
    const datosSesion = {
      titulo: form.titulo,
      servicio_id: form.servicio_id,
      colaborador_id: form.colaborador_id,
      empresa_id: form.empresa_id || null,
      descripcion: form.descripcion,
      fecha_inicio: fechaHoraInicio.toISOString(),
      fecha_fin: fechaHoraFin.toISOString(),
      modalidad: form.modalidad,
      capacidad_maxima: form.capacidad_maxima,
      ubicacion: form.modalidad === 'presencial' ? form.ubicacion : null,
      enlace_reunion: form.modalidad === 'online' ? form.enlace_reunion : null,
      codigo_acceso: form.modalidad === 'online' ? form.codigo_acceso : null,
      puntos_asistencia: form.puntos_asistencia,
      recordatorio_horas: form.recordatorio_horas,
      sesion_grabable: form.sesion_grabable,
      permitir_lista_espera: form.permitir_lista_espera,
      notas_internas: form.notas_internas,
      indicaciones_previas: form.indicaciones_previas,
      activo: true,
      estado_sesion: 'programada'
    };
    
    let result;
    
    if (props.modo === 'crear') {
      result = await supabase
        .from('sesiones')
        .insert([datosSesion])
        .select();
    } else {
      result = await supabase
        .from('sesiones')
        .update(datosSesion)
        .eq('id', props.sesion.id)
        .select();
    }
    
    if (result.error) {
      throw result.error;
    }
    
    emit('guardar', result.data[0]);
    emit('cerrar');
    
  } catch (error) {
    console.error('Error guardando sesión:', error);
    alert('Error al guardar la sesión: ' + error.message);
  } finally {
    guardando.value = false;
  }
};

const cerrarSiClickFuera = (event) => {
  if (event.target === event.currentTarget) {
    emit('cerrar');
  }
};

// Watchers
watch(() => props.visible, (nuevoValor) => {
  if (nuevoValor) {
    cargarDatos();
  }
});

// Lifecycle
onMounted(() => {
  if (props.visible) {
    cargarDatos();
  }
});
</script>

<style scoped>
input[type="radio"] {
  @apply h-4 w-4 text-primary border-gray-300 focus:ring-primary;
}

input[type="checkbox"] {
  @apply h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary;
}
</style>