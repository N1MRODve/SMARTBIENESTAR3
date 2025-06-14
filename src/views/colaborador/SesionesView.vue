<template>
  <div class="space-y-8">
    <!-- Header de la página -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gestiona tus sesiones y reservas
        </p>
      </div>
      
      <Button @click="showNewSessionModal = true">
        <Calendar class="h-4 w-4 mr-2" />
        Nueva Sesión
      </Button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="filters.status" class="w-full rounded-lg border-gray-300">
            <option value="all">Todas</option>
            <option value="upcoming">Próximas</option>
            <option value="past">Pasadas</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
          <select v-model="filters.serviceType" class="w-full rounded-lg border-gray-300">
            <option value="all">Todos</option>
            <option value="yoga">Yoga</option>
            <option value="meditacion">Meditación</option>
            <option value="nutricion">Nutrición</option>
            <option value="coaching">Coaching</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input 
            type="date" 
            v-model="filters.date"
            class="w-full rounded-lg border-gray-300"
          >
        </div>
        
        <div class="flex items-end space-x-2">
          <Button variant="outline" @click="resetFilters">
            Restablecer
          </Button>
          <Button @click="applySesionesFilters">
            Filtrar
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      <span class="ml-3 text-gray-600">Cargando sesiones...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="misSesiones.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron sesiones</h3>
      <p class="text-gray-500 mb-4">No tienes sesiones programadas que coincidan con los filtros seleccionados.</p>
      <Button @click="showNewSessionModal = true">
        Crear nueva sesión
      </Button>
    </div>

    <!-- Sesiones list -->
    <div v-else class="space-y-4">
      <div v-for="sesion in misSesiones" :key="sesion.id" class="bg-white rounded-lg shadow">
        <div class="p-4 flex items-center border-b">
          <div class="bg-primary text-white rounded-lg p-3 text-center w-16">
            <div class="text-2xl font-bold">{{ formatDate(sesion.fecha_inicio, 'DD') }}</div>
            <div class="text-xs uppercase">{{ formatDate(sesion.fecha_inicio, 'MMM') }}</div>
          </div>
          
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-gray-900">{{ sesion.titulo }}</h3>
            <div class="flex items-center mt-1">
              <Clock class="h-4 w-4 text-gray-400 mr-1" />
              <span class="text-sm text-gray-500">
                {{ formatDate(sesion.fecha_inicio, 'HH:mm') }} - {{ formatDate(sesion.fecha_fin, 'HH:mm') }}
              </span>
            </div>
          </div>
          
          <div class="text-sm">
            <span :class="[
              'px-2 py-1 rounded-full',
              getSesionStatusClass(sesion)
            ]">
              {{ getSesionStatusText(sesion) }}
            </span>
          </div>
        </div>
        
        <div class="p-4 flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <Users class="h-4 w-4 mr-2" />
              {{ sesion.reservas_count || 0 }}/{{ sesion.capacidad_maxima }} asistentes
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <MapPin class="h-4 w-4 mr-2" />
              {{ sesion.modalidad === 'online' ? 'Sesión online' : sesion.ubicacion || 'Sin ubicación' }}
            </div>
          </div>
          
          <div class="flex gap-2">
            <Button variant="outline" @click="viewSesionDetails(sesion.id)">
              Ver detalles
            </Button>
            <Button 
              v-if="isFutureSesion(sesion)"
              variant="outline" 
              @click="editSesion(sesion.id)"
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-6">
      <Button
        variant="outline"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      
      <span class="text-sm text-gray-600">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <Button
        variant="outline"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <!-- Modal nueva sesión -->
    <Dialog v-model:visible="showNewSessionModal" modal header="Nueva Sesión">
      <div class="p-4">
        <p>Formulario para crear nueva sesión (implementación pendiente)</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showNewSessionModal = false">
            Cancelar
          </Button>
          <Button @click="createNewSesion">
            Crear Sesión
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import Dialog from 'primevue/dialog';
import Button from '../../components/common/Button.vue';
import { useAuth } from '../../composables/useAuth';
import { supabase } from '../../services/supabase';

const router = useRouter();
const { user } = useAuth();

// Estado
const misSesiones = ref([]);
const loading = ref(true);
const error = ref(null);
const showNewSessionModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;
const totalItems = ref(0);

// Filtros
const filters = ref({
  status: 'all',
  serviceType: 'all',
  date: ''
});

// Formatear fechas
const formatDate = (dateString, format) => {
  const date = new Date(dateString);
  
  if (format === 'DD') {
    return date.getDate();
  } else if (format === 'MMM') {
    return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()];
  } else if (format === 'HH:mm') {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  return dateString;
};

// Verificar si una sesión es futura
const isFutureSesion = (sesion) => {
  return new Date(sesion.fecha_inicio) > new Date();
};

// Obtener clase CSS según estado de la sesión
const getSesionStatusClass = (sesion) => {
  const now = new Date();
  const sesionDate = new Date(sesion.fecha_inicio);
  
  if (sesionDate < now) {
    return 'bg-green-100 text-green-800';
  } else if (sesionDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-blue-100 text-blue-800';
  }
};

// Obtener texto según estado de la sesión
const getSesionStatusText = (sesion) => {
  const now = new Date();
  const sesionDate = new Date(sesion.fecha_inicio);
  
  if (sesionDate < now) {
    return 'Completada';
  } else if (sesionDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
    return 'Próxima';
  } else {
    return 'Programada';
  }
};

// Cargar sesiones
const loadSesiones = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const { data, error: sesionesError, count } = await supabase
      .from('sesiones')
      .select(`
        id,
        titulo,
        fecha_inicio,
        fecha_fin,
        modalidad,
        ubicacion,
        capacidad_maxima,
        servicios (id, tipo),
        (
          SELECT count(*) 
          FROM reservas 
          WHERE sesion_id = sesiones.id AND estado = 'confirmada'
        ) as reservas_count
      `, { count: 'exact' })
      .eq('colaborador_id', user.value.id)
      .order('fecha_inicio', { ascending: false });
    
    if (sesionesError) throw sesionesError;
    
    misSesiones.value = data || [];
    totalItems.value = count || 0;
    
  } catch (err) {
    console.error('Error al cargar sesiones:', err);
    error.value = 'Error al cargar sesiones. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

// Acciones
const viewSesionDetails = (sesionId) => {
  router.push(`/colaborador/sesiones/${sesionId}`);
};

const editSesion = (sesionId) => {
  router.push(`/colaborador/sesiones/${sesionId}/editar`);
};

const createNewSesion = () => {
  showNewSessionModal.value = false;
  // Implementar lógica de creación
};

const resetFilters = () => {
  filters.value = {
    status: 'all',
    serviceType: 'all',
    date: ''
  };
};

const applySesionesFilters = () => {
  currentPage.value = 1;
  loadSesiones();
};

const changePage = (page) => {
  currentPage.value = page;
  loadSesiones();
};

// Cargar datos iniciales
onMounted(() => {
  loadSesiones();
});
</script>