<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Historial de Canjes" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Historial de Canjes de Recompensas</h1>
              <p class="mt-2 text-lg text-gray-600">Monitorea todos los canjes realizados por los empleados</p>
            </div>
            <Button 
              @click="volverARecompensas"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Volver a Recompensas
            </Button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ estadisticas.totalCanjes }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Canjes</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-green-600">{{ estadisticas.puntosGastados }}</div>
            <div class="text-sm text-gray-500 mt-1">Puntos Gastados</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-purple-600">{{ estadisticas.canjesHoy }}</div>
            <div class="text-sm text-gray-500 mt-1">Canjes Hoy</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-orange-600">{{ estadisticas.promedioDiario }}</div>
            <div class="text-sm text-gray-500 mt-1">Promedio Diario</div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando historial de canjes...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar el historial</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarHistorial" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="canjesConEmpleados.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Gift class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay canjes registrados</h3>
          <p class="text-gray-500">Los canjes aparecerán aquí cuando los empleados empiecen a usar sus puntos</p>
        </div>

        <!-- Historial Table -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Table Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">
                Historial Completo ({{ canjesConEmpleados.length }} canjes)
              </h2>
              <div class="flex items-center space-x-4">
                <!-- Filtro por Estado -->
                <select
                  v-model="filtroEstado"
                  @change="aplicarFiltros"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="procesando">Procesando</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                
                <!-- Botón Exportar -->
                <Button @click="exportarHistorial" variant="outline">
                  <Download class="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recompensa
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coste
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="canje in canjesFiltrados" 
                  :key="canje.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <!-- Fecha -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatearFecha(canje.fecha) }}</div>
                    <div class="text-sm text-gray-500">{{ formatearHora(canje.fecha) }}</div>
                  </td>

                  <!-- Empleado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                        <span class="text-white text-xs font-medium">
                          {{ getIniciales(canje.empleadoNombre) }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ canje.empleadoNombre }}</div>
                        <div class="text-sm text-gray-500">{{ canje.empleadoDepartamento }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Recompensa -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-lg mr-3">{{ getIconoRecompensa(canje.recompensaId) }}</span>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ canje.recompensaTitulo }}</div>
                        <div class="text-sm text-gray-500">{{ getCategoriaRecompensa(canje.recompensaId) }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Coste -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm font-bold text-gray-900">{{ canje.coste }}</span>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        canje.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        canje.estado === 'procesando' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      ]"
                    >
                      <span 
                        :class="[
                          'w-1.5 h-1.5 rounded-full mr-1.5',
                          canje.estado === 'completado' ? 'bg-green-400' :
                          canje.estado === 'procesando' ? 'bg-yellow-400' :
                          'bg-red-400'
                        ]"
                      ></span>
                      {{ 
                        canje.estado === 'completado' ? 'Completado' :
                        canje.estado === 'procesando' ? 'Procesando' :
                        'Cancelado'
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination (si fuera necesario) -->
          <div v-if="canjesFiltrados.length > 10" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Mostrando {{ Math.min(10, canjesFiltrados.length) }} de {{ canjesFiltrados.length }} canjes
              </div>
              <div class="text-sm text-gray-500">
                Paginación disponible en versión completa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getHistorialCanjesCompleto } from '@/services/mock/recompensas.service';
import { getEmpleados } from '@/services/mock/empleados.service';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import { ArrowLeft, AlertCircle, RefreshCw, Gift, Download } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();

// Estado reactivo
const historialCanjes = ref([]);
const empleados = ref([]);
const loading = ref(true);
const error = ref(null);
const filtroEstado = ref('');

// Computed properties
const canjesConEmpleados = computed(() => {
  return historialCanjes.value.map(canje => {
    const empleado = empleados.value.find(emp => emp.id === canje.usuarioId);
    return {
      ...canje,
      empleadoNombre: empleado ? empleado.nombre : 'Empleado no encontrado',
      empleadoDepartamento: empleado ? empleado.departamento : 'Sin departamento'
    };
  });
});

const canjesFiltrados = computed(() => {
  if (!filtroEstado.value) return canjesConEmpleados.value;
  return canjesConEmpleados.value.filter(canje => canje.estado === filtroEstado.value);
});

const estadisticas = computed(() => {
  const canjes = canjesConEmpleados.value;
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  
  const canjesHoy = canjes.filter(canje => 
    new Date(canje.fecha) >= inicioHoy
  ).length;
  
  const totalPuntos = canjes.reduce((total, canje) => total + canje.coste, 0);
  
  // Calcular promedio diario (últimos 30 días)
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);
  const canjesUltimos30Dias = canjes.filter(canje => 
    new Date(canje.fecha) >= hace30Dias
  ).length;
  const promedioDiario = Math.round(canjesUltimos30Dias / 30 * 10) / 10;
  
  return {
    totalCanjes: canjes.length,
    puntosGastados: totalPuntos,
    canjesHoy,
    promedioDiario
  };
});

// Methods
const volverARecompensas = () => {
  router.push('/admin/recompensas');
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatearHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getIniciales = (nombre) => {
  return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getIconoRecompensa = (recompensaId) => {
  // Mapeo de iconos por ID de recompensa
  const iconos = {
    'rec-01': '🏖️',
    'rec-02': '🍽️',
    'rec-03': '💆‍♀️',
    'rec-04': '🎁',
    'rec-05': '🎬',
    'rec-06': '🧘‍♀️',
    'rec-07': '🚗',
    'rec-08': '🥗',
    'rec-09': '⏰',
    'rec-10': '🎵'
  };
  return iconos[recompensaId] || '🎁';
};

const getCategoriaRecompensa = (recompensaId) => {
  // Mapeo de categorías por ID de recompensa
  const categorias = {
    'rec-01': 'Tiempo Libre',
    'rec-02': 'Gastronomía',
    'rec-03': 'Bienestar',
    'rec-04': 'Compras',
    'rec-05': 'Entretenimiento',
    'rec-06': 'Bienestar',
    'rec-07': 'Comodidad',
    'rec-08': 'Salud',
    'rec-09': 'Tiempo Libre',
    'rec-10': 'Entretenimiento'
  };
  return categorias[recompensaId] || 'General';
};

const aplicarFiltros = () => {
  // Los filtros se aplican automáticamente a través de computed properties
  console.log('Filtros aplicados:', { estado: filtroEstado.value });
};

const exportarHistorial = () => {
  // Simular exportación
  const csvContent = [
    'Fecha,Empleado,Departamento,Recompensa,Coste,Estado',
    ...canjesFiltrados.value.map(canje => 
      `${formatearFecha(canje.fecha)},${canje.empleadoNombre},${canje.empleadoDepartamento},${canje.recompensaTitulo},${canje.coste},${canje.estado}`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historial-canjes-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  toast.add({
    severity: 'success',
    summary: 'Historial exportado',
    detail: 'El archivo CSV se ha descargado correctamente',
    life: 4000
  });
};

const cargarHistorial = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Cargar historial de canjes y empleados en paralelo
    const [canjesData, empleadosData] = await Promise.all([
      getHistorialCanjesCompleto(),
      getEmpleados()
    ]);
    
    historialCanjes.value = canjesData;
    empleados.value = empleadosData;
    
  } catch (err) {
    error.value = err.message || 'Error al cargar el historial de canjes';
    console.error('Error cargando historial:', err);
  } finally {
    loading.value = false;
  }
};

// Load data on mount
onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>