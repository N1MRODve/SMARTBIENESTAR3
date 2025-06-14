<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Horarios</h1>
      <p class="text-gray-600">Dashboard para gestionar sesiones, reservas y ocupación de clases</p>
    </div>

    <!-- Estadísticas Principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Sesiones Programadas -->
      <div class="stats-card stats-card-primary">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Sesiones Programadas</p>
            <p class="text-3xl font-bold text-primary">{{ stats.totalSesiones }}</p>
            <p class="text-xs text-gray-500 mt-1">Próximas 30 días</p>
          </div>
          <Calendar class="h-12 w-12 text-primary opacity-20" />
        </div>
      </div>

      <!-- Ocupación Promedio -->
      <div class="stats-card stats-card-secondary">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Ocupación Promedio</p>
            <p class="text-3xl font-bold text-secondary">{{ stats.ocupacionPromedio }}%</p>
            <p class="text-xs text-gray-500 mt-1">Últimos 7 días</p>
          </div>
          <Users class="h-12 w-12 text-secondary opacity-20" />
        </div>
      </div>

      <!-- Total Reservas -->
      <div class="stats-card stats-card-accent">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Reservas</p>
            <p class="text-3xl font-bold text-dark">{{ stats.totalReservas }}</p>
            <p class="text-xs text-gray-500 mt-1">Este mes</p>
          </div>
          <BookmarkCheck class="h-12 w-12 text-dark opacity-20" />
        </div>
      </div>

      <!-- Colaboradores Activos -->
      <div class="stats-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Colaboradores Activos</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.colaboradoresActivos }}</p>
            <p class="text-xs text-gray-500 mt-1">Con sesiones programadas</p>
          </div>
          <UserCheck class="h-12 w-12 text-gray-400 opacity-20" />
        </div>
      </div>
    </div>

    <!-- Navegación de Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4 inline mr-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Contenido según el tab activo -->
    <div>
      <!-- Vista General -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- Gráfico de Ocupación Semanal -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ocupación por Día de la Semana</h3>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Gráfico de ocupación semanal (próximamente)</p>
          </div>
        </div>

        <!-- Servicios Más Populares -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Servicios Más Populares</h3>
          <div class="space-y-4">
            <div v-for="servicio in serviciosPopulares" :key="servicio.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <component :is="getServiceIcon(servicio.tipo)" class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ servicio.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ servicio.tipo }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ servicio.total_reservas }} reservas</p>
                <p class="text-xs text-gray-500">{{ servicio.ocupacion_promedio }}% ocupación</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Calendario -->
      <div v-if="activeTab === 'calendar'" class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Calendario de Sesiones</h3>
          <div class="flex items-center space-x-4">
            <!-- Filtros -->
            <select v-model="filtros.tipoServicio" class="input">
              <option value="">Todos los servicios</option>
              <option value="yoga">Yoga</option>
              <option value="meditacion">Meditación</option>
              <option value="nutricion">Nutrición</option>
              <option value="coaching">Coaching</option>
              <option value="psicoterapia">Psicoterapia</option>
              <option value="entrenamiento">Entrenamiento</option>
            </select>
            <button @click="crearNuevaSesion" class="btn btn-primary">
              <Plus class="h-4 w-4 mr-2" />
              Nueva Sesión
            </button>
          </div>
        </div>
        
        <!-- Calendario placeholder -->
        <div class="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Calendario de sesiones (próximamente)</p>
            <p class="text-sm text-gray-400 mt-2">Se mostrará cuando se implementen los componentes del calendario</p>
          </div>
        </div>
      </div>

      <!-- Lista de Sesiones -->
      <div v-if="activeTab === 'sessions'" class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Lista de Sesiones</h3>
            <div class="flex items-center space-x-4">
              <input 
                v-model="busqueda" 
                type="text" 
                placeholder="Buscar sesiones..." 
                class="input"
              >
              <button @click="crearNuevaSesion" class="btn btn-primary">
                <Plus class="h-4 w-4 mr-2" />
                Nueva Sesión
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tabla placeholder -->
        <div class="p-8 text-center">
          <List class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">Tabla de sesiones (próximamente)</p>
          <p class="text-sm text-gray-400 mt-2">Se mostrará cuando se implemente el componente TablaSesiones</p>
        </div>
      </div>

      <!-- Gestión de Reservas -->
      <div v-if="activeTab === 'reservations'" class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Gestión de Reservas</h3>
        </div>
        
        <!-- Reservas placeholder -->
        <div class="p-8 text-center">
          <Settings class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">Gestión de reservas (próximamente)</p>
          <p class="text-sm text-gray-400 mt-2">Se mostrará cuando se implemente el componente TablaReservas</p>
        </div>
      </div>
    </div>

    <!-- Modal funcional para crear/editar sesión -->
    <ModalSesion
      v-if="modalSesion.visible"
      :visible="modalSesion.visible"
      :sesion="modalSesion.sesion"
      :modo="modalSesion.modo"
      @cerrar="cerrarModalSesion"
      @guardar="sesionGuardada"
    />

    <!-- Notification Toast -->
    <div
      v-if="notification.visible"
      :class="[
        'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[60] transform transition-all duration-300',
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <div class="flex items-center space-x-2">
        <CheckCircle v-if="notification.type === 'success'" class="h-5 w-5" />
        <XCircle v-else class="h-5 w-5" />
        <span>{{ notification.message }}</span>
        <button @click="notification.visible = false" class="ml-2">
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { 
  Calendar, 
  Users, 
  BookmarkCheck, 
  UserCheck, 
  BarChart3, 
  CalendarDays, 
  List, 
  Settings, 
  Plus,
  Activity,
  Brain,
  Apple,
  MessageCircle,
  Heart,
  Dumbbell,
  CheckCircle,
  XCircle,
  X
} from 'lucide-vue-next';

// Importar el modal funcional
import ModalSesion from '../../components/horarios/ModalSesion.vue';

// Estado reactivo
const activeTab = ref('overview');
const loading = ref(false);
const busqueda = ref('');

const stats = reactive({
  totalSesiones: 0,
  ocupacionPromedio: 0,
  totalReservas: 0,
  colaboradoresActivos: 0
});

const filtros = reactive({
  tipoServicio: '',
  colaborador: '',
  empresa: ''
});

const modalSesion = reactive({
  visible: false,
  sesion: null,
  modo: 'crear'
});

const notification = reactive({
  visible: false,
  message: '',
  type: 'success' // 'success' o 'error'
});

const sesiones = ref([]);
const reservas = ref([]);
const serviciosPopulares = ref([]);

// Configuración de tabs
const tabs = [
  { id: 'overview', name: 'Vista General', icon: BarChart3 },
  { id: 'calendar', name: 'Calendario', icon: CalendarDays },
  { id: 'sessions', name: 'Sesiones', icon: List },
  { id: 'reservations', name: 'Reservas', icon: Settings }
];

// Métodos
const cargarEstadisticas = async () => {
  try {
    loading.value = true;
    
    // Cargar estadísticas principales
    const { data: sesionesData } = await supabase
      .from('sesiones')
      .select('*')
      .gte('fecha_inicio', new Date().toISOString())
      .lte('fecha_inicio', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    
    const { data: reservasData } = await supabase
      .from('reservas')
      .select('*')
      .eq('estado', 'confirmada');
    
    // Calcular estadísticas
    stats.totalSesiones = sesionesData?.length || 0;
    stats.totalReservas = reservasData?.length || 0;
    
    // Calcular ocupación promedio
    if (sesionesData?.length > 0) {
      const ocupaciones = sesionesData.map(sesion => {
        const reservasSesion = reservasData?.filter(r => r.sesion_id === sesion.id) || [];
        return (reservasSesion.length / sesion.capacidad_maxima) * 100;
      });
      stats.ocupacionPromedio = Math.round(ocupaciones.reduce((a, b) => a + b, 0) / ocupaciones.length);
    }
    
    // Colaboradores únicos con sesiones
    const colaboradoresUnicos = new Set(sesionesData?.map(s => s.colaborador_id) || []);
    stats.colaboradoresActivos = colaboradoresUnicos.size;
    
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  } finally {
    loading.value = false;
  }
};

const cargarServiciosPopulares = async () => {
  try {
    // Usar la función SQL personalizada
    const { data, error } = await supabase
      .rpc('get_servicios_populares', { limite: 5 });
    
    if (error) {
      console.error('Error en función get_servicios_populares:', error);
      serviciosPopulares.value = [];
    } else {
      // Los datos ya vienen con la estructura correcta de la función SQL
      serviciosPopulares.value = data || [];
    }
    
  } catch (error) {
    console.error('Error cargando servicios populares:', error);
    serviciosPopulares.value = [];
  }
};

const getServiceIcon = (tipo) => {
  const iconMap = {
    yoga: Activity,
    meditacion: Brain,
    nutricion: Apple,
    coaching: MessageCircle,
    psicoterapia: Heart,
    entrenamiento: Dumbbell
  };
  return iconMap[tipo] || Activity;
};

const crearNuevaSesion = () => {
  modalSesion.visible = true;
  modalSesion.sesion = null;
  modalSesion.modo = 'crear';
};

const cerrarModalSesion = () => {
  modalSesion.visible = false;
  modalSesion.sesion = null;
};

const sesionGuardada = async (nuevaSesion) => {
  // Mostrar notificación de éxito
  mostrarNotificacion(
    modalSesion.modo === 'crear' 
      ? '¡Sesión creada exitosamente!' 
      : '¡Sesión actualizada exitosamente!',
    'success'
  );
  
  // Recargar estadísticas para mostrar los nuevos datos
  await cargarEstadisticas();
  await cargarServiciosPopulares();
  
  console.log('Sesión guardada:', nuevaSesion);
};

const mostrarNotificacion = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.visible = true;
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    notification.visible = false;
  }, 5000);
};

// Lifecycle
onMounted(() => {
  cargarEstadisticas();
  cargarServiciosPopulares();
});
</script>