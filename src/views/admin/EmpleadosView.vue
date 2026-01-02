<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  Users, Plus, Mail, Search, CheckCircle, Clock, AlertCircle,
  Info, AlertTriangle, Activity, Edit3, Trash2,
  X, ArrowUpDown, ArrowUp, ArrowDown, Send
} from 'lucide-vue-next';
import EmptyState from '@/components/common/EmptyState.vue';
import InvitarEmpleadosModal from '@/components/admin/InvitarEmpleadosModal.vue';
import EditarEmpleadoModal from '@/components/admin/EditarEmpleadoModal.vue';
import Pagination from '@/components/common/Pagination.vue';
import { useToast } from '@/composables/useToast';
import { usePagination } from '@/composables/usePagination';

const authStore = useAuthStore();
const toast = useToast();

const empleados = ref([]);
const departamentos = ref([]);
const isLoading = ref(true);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const empleadoSeleccionado = ref(null);
const empleadosSeleccionados = ref([]);

// Filtros
const filtros = ref({
  busqueda: '',
  estado: '',
  departamento: '',
  participacion: ''
});

// Ordenamiento
const ordenamiento = ref({
  campo: 'created_at',
  direccion: 'desc'
});

const hasEmpleados = computed(() => empleados.value.length > 0);

// Stats para KPIs
const stats = computed(() => {
  const total = empleados.value.length;
  const activos = empleados.value.filter(e => e.estado === 'Activo').length;
  const pendientes = empleados.value.filter(e => e.estado === 'Invitado').length;

  // Empleados sin participación: activos con 0 puntos o sin acceso reciente
  const sinParticipacion = empleados.value.filter(e => {
    if (e.estado !== 'Activo') return false;

    // Si tiene ultimo_acceso, verificar si es mayor a 30 días
    if (e.ultimo_acceso) {
      const diasInactivo = Math.floor((Date.now() - new Date(e.ultimo_acceso).getTime()) / (1000 * 60 * 60 * 24));
      return diasInactivo > 30;
    }

    // Si no tiene ultimo_acceso, verificar puntos
    return (e.puntos || 0) === 0;
  }).length;

  return {
    total,
    activos,
    pendientes,
    sinParticipacion,
    porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0
  };
});

// Filtrado
const empleadosFiltrados = computed(() => {
  let resultado = empleados.value;

  // Búsqueda
  if (filtros.value.busqueda) {
    const termino = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter(e =>
      e.nombre.toLowerCase().includes(termino) ||
      e.email.toLowerCase().includes(termino) ||
      (e.cargo && e.cargo.toLowerCase().includes(termino))
    );
  }

  // Estado
  if (filtros.value.estado) {
    resultado = resultado.filter(e => e.estado === filtros.value.estado);
  }

  // Departamento
  if (filtros.value.departamento) {
    resultado = resultado.filter(e => e.departamento_id === filtros.value.departamento);
  }

  // Participación
  if (filtros.value.participacion) {
    resultado = resultado.filter(e => {
      const puntos = e.puntos || 0;
      switch (filtros.value.participacion) {
        case 'alta': return puntos >= 50;
        case 'media': return puntos >= 10 && puntos < 50;
        case 'baja': return puntos > 0 && puntos < 10;
        case 'nula': return puntos === 0;
        default: return true;
      }
    });
  }

  return resultado;
});

// Ordenamiento
const empleadosOrdenados = computed(() => {
  const resultado = [...empleadosFiltrados.value];

  resultado.sort((a, b) => {
    let valorA = a[ordenamiento.value.campo];
    let valorB = b[ordenamiento.value.campo];

    // Manejar valores nulos
    if (valorA === null || valorA === undefined) valorA = '';
    if (valorB === null || valorB === undefined) valorB = '';

    // Normalizar strings
    if (typeof valorA === 'string') {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    let comparacion = 0;
    if (valorA > valorB) comparacion = 1;
    if (valorA < valorB) comparacion = -1;

    return ordenamiento.value.direccion === 'asc' ? comparacion : -comparacion;
  });

  return resultado;
});

// Paginación
const {
  paginatedItems: empleadosPaginados,
  currentPage,
  totalPages,
  nextPage,
  previousPage,
  goToPage
} = usePagination(empleadosOrdenados, 25);

const tienesFiltrosActivos = computed(() => {
  return filtros.value.busqueda || filtros.value.estado ||
         filtros.value.departamento || filtros.value.participacion;
});

// Selección múltiple
const todosSeleccionados = computed({
  get: () => {
    if (empleadosPaginados.value.length === 0) return false;
    return empleadosPaginados.value.every(e => empleadosSeleccionados.value.includes(e.id));
  },
  set: (value) => {
    if (value) {
      // Agregar todos los de la página actual
      empleadosPaginados.value.forEach(e => {
        if (!empleadosSeleccionados.value.includes(e.id)) {
          empleadosSeleccionados.value.push(e.id);
        }
      });
    } else {
      // Remover todos los de la página actual
      empleadosPaginados.value.forEach(e => {
        const index = empleadosSeleccionados.value.indexOf(e.id);
        if (index > -1) {
          empleadosSeleccionados.value.splice(index, 1);
        }
      });
    }
  }
});

onMounted(async () => {
  await Promise.all([
    cargarEmpleados(),
    cargarDepartamentos()
  ]);
});

const cargarEmpleados = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos(nombre)
      `)
      .eq('empresa_id', authStore.empresaId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    empleados.value = data.map(emp => ({
      ...emp,
      departamento: emp.departamentos?.nombre || null
    }));
  } catch (error) {
    console.error('Error cargando empleados:', error);
    toast.error('Error al cargar empleados');
  } finally {
    isLoading.value = false;
  }
};

const cargarDepartamentos = async () => {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('empresa_id', authStore.empresaId)
      .order('nombre');

    if (error) throw error;
    departamentos.value = data || [];
  } catch (error) {
    console.error('Error cargando departamentos:', error);
  }
};

const handleInvitar = async (datosEmpleados) => {
  try {
    const empleadosParaInsertar = datosEmpleados.map(emp => ({
      empresa_id: authStore.empresaId,
      nombre: emp.nombre,
      email: emp.email,
      departamento_id: emp.departamento_id,
      cargo: emp.cargo || '',
      estado: 'Invitado',
      puntos: 0,
      es_admin: false,
      invitacion_enviada_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('empleados')
      .insert(empleadosParaInsertar);

    if (error) throw error;

    await cargarEmpleados();
    isModalVisible.value = false;

    const count = datosEmpleados.length;
    toast.success(
      count === 1
        ? `${datosEmpleados[0].nombre} ha sido invitado correctamente`
        : `${count} empleados han sido invitados correctamente`,
      { icon: '👥', timeout: 5000 }
    );
  } catch (error) {
    console.error('Error invitando empleados:', error);
    toast.error('Error al invitar empleados. Por favor, verifica los datos e intenta de nuevo.');
  }
};

const abrirModalEditar = (empleado) => {
  empleadoSeleccionado.value = empleado;
  isEditModalVisible.value = true;
};

const handleActualizarEmpleado = async (datosActualizados) => {
  try {
    const { error } = await supabase
      .from('empleados')
      .update({
        nombre: datosActualizados.nombre,
        email: datosActualizados.email,
        departamento_id: datosActualizados.departamento_id,
        cargo: datosActualizados.cargo,
        estado: datosActualizados.estado
      })
      .eq('id', empleadoSeleccionado.value.id);

    if (error) throw error;

    await cargarEmpleados();
    isEditModalVisible.value = false;
    toast.success('Empleado actualizado correctamente', { icon: '✅' });
  } catch (error) {
    console.error('Error actualizando empleado:', error);
    toast.error('Error al actualizar empleado. Por favor, verifica los datos e intenta de nuevo.');
  }
};

const toggleSeleccion = (id) => {
  const index = empleadosSeleccionados.value.indexOf(id);
  if (index > -1) {
    empleadosSeleccionados.value.splice(index, 1);
  } else {
    empleadosSeleccionados.value.push(id);
  }
};

const resetFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: '',
    departamento: '',
    participacion: ''
  };
};

const ordenarPor = (campo) => {
  if (ordenamiento.value.campo === campo) {
    ordenamiento.value.direccion = ordenamiento.value.direccion === 'asc' ? 'desc' : 'asc';
  } else {
    ordenamiento.value.campo = campo;
    ordenamiento.value.direccion = 'asc';
  }
};

const getOrdenIcon = (campo) => {
  if (ordenamiento.value.campo !== campo) return ArrowUpDown;
  return ordenamiento.value.direccion === 'asc' ? ArrowUp : ArrowDown;
};

const reenviarInvitacion = async (empleado) => {
  try {
    // Actualizar fecha de reenvío
    const { error } = await supabase
      .from('empleados')
      .update({ invitacion_enviada_at: new Date().toISOString() })
      .eq('id', empleado.id);

    if (error) throw error;

    toast.success(`Invitación reenviada a ${empleado.nombre}`, { icon: '📧' });
    await cargarEmpleados();
  } catch (error) {
    console.error('Error reenviando invitación:', error);
    toast.error('Error al reenviar invitación');
  }
};

const reenviarInvitacionesBloque = async () => {
  try {
    const empleadosInvitados = empleados.value.filter(e =>
      empleadosSeleccionados.value.includes(e.id) && e.estado === 'Invitado'
    );

    if (empleadosInvitados.length === 0) {
      toast.warning('Selecciona al menos un empleado con estado "Invitado"');
      return;
    }

    const { error } = await supabase
      .from('empleados')
      .update({ invitacion_enviada_at: new Date().toISOString() })
      .in('id', empleadosInvitados.map(e => e.id));

    if (error) throw error;

    toast.success(`${empleadosInvitados.length} invitaciones reenviadas`, { icon: '📧' });
    empleadosSeleccionados.value = [];
    await cargarEmpleados();
  } catch (error) {
    console.error('Error reenviando invitaciones:', error);
    toast.error('Error al reenviar invitaciones');
  }
};

const eliminarBloque = async () => {
  if (!confirm(`¿Estás seguro de eliminar ${empleadosSeleccionados.value.length} empleados?`)) {
    return;
  }

  try {
    const { error } = await supabase
      .from('empleados')
      .delete()
      .in('id', empleadosSeleccionados.value);

    if (error) throw error;

    toast.success(`${empleadosSeleccionados.value.length} empleados eliminados`, { icon: '🗑️' });
    empleadosSeleccionados.value = [];
    await cargarEmpleados();
  } catch (error) {
    console.error('Error eliminando empleados:', error);
    toast.error('Error al eliminar empleados');
  }
};

const cambiarEstadoBloque = async () => {
  const nuevoEstado = prompt('Ingresa el nuevo estado (Activo, Invitado, Inactivo):');
  if (!nuevoEstado || !['Activo', 'Invitado', 'Inactivo'].includes(nuevoEstado)) {
    toast.warning('Estado no válido');
    return;
  }

  try {
    const { error } = await supabase
      .from('empleados')
      .update({ estado: nuevoEstado })
      .in('id', empleadosSeleccionados.value);

    if (error) throw error;

    toast.success(`Estado actualizado para ${empleadosSeleccionados.value.length} empleados`);
    empleadosSeleccionados.value = [];
    await cargarEmpleados();
  } catch (error) {
    console.error('Error cambiando estado:', error);
    toast.error('Error al cambiar estado');
  }
};

const getUltimoAccesoTexto = (empleado) => {
  if (!empleado.ultimo_acceso) {
    return 'Sin acceso registrado';
  }

  const diasInactivo = Math.floor((Date.now() - new Date(empleado.ultimo_acceso).getTime()) / (1000 * 60 * 60 * 24));

  if (diasInactivo === 0) return 'Activo hoy';
  if (diasInactivo === 1) return 'Último acceso ayer';
  if (diasInactivo <= 7) return `Hace ${diasInactivo} días`;
  if (diasInactivo <= 30) return `Hace ${Math.floor(diasInactivo / 7)} semanas`;
  return `Hace más de 30 días`;
};

const tieneAlertaParticipacion = (empleado) => {
  if (empleado.estado !== 'Activo') return false;

  // Alerta si no tiene puntos
  if ((empleado.puntos || 0) === 0) return true;

  // Alerta si no ha accedido en 30+ días
  if (empleado.ultimo_acceso) {
    const diasInactivo = Math.floor((Date.now() - new Date(empleado.ultimo_acceso).getTime()) / (1000 * 60 * 60 * 24));
    return diasInactivo > 30;
  }

  return false;
};

const getNivel = (puntos) => {
  if (puntos >= 100) return 'Experto';
  if (puntos >= 50) return 'Avanzado';
  if (puntos >= 10) return 'Activo';
  if (puntos > 0) return 'Iniciado';
  return 'Nuevo';
};

const getNivelBadgeClass = (puntos) => {
  if (puntos >= 100) return 'bg-purple-100 text-purple-800';
  if (puntos >= 50) return 'bg-blue-100 text-blue-800';
  if (puntos >= 10) return 'bg-green-100 text-green-800';
  if (puntos > 0) return 'bg-gray-100 text-gray-600';
  return 'bg-gray-50 text-gray-400';
};

const getProgresoNivel = (puntos) => {
  if (puntos >= 100) return 100;
  if (puntos >= 50) return ((puntos - 50) / 50) * 100;
  if (puntos >= 10) return ((puntos - 10) / 40) * 100;
  if (puntos > 0) return (puntos / 10) * 100;
  return 0;
};

const getNivelBarClass = (puntos) => {
  if (puntos >= 100) return 'bg-purple-500';
  if (puntos >= 50) return 'bg-blue-500';
  if (puntos >= 10) return 'bg-green-500';
  if (puntos > 0) return 'bg-gray-400';
  return 'bg-gray-300';
};

const getDepartamentoBadgeClass = (departamento) => {
  const clases = {
    'RRHH': 'bg-blue-100 text-blue-800',
    'Tecnología': 'bg-purple-100 text-purple-800',
    'Ventas': 'bg-green-100 text-green-800',
    'Marketing': 'bg-pink-100 text-pink-800',
    'Operaciones': 'bg-yellow-100 text-yellow-800',
    'Finanzas': 'bg-indigo-100 text-indigo-800',
    'Entrenamiento Personal': 'bg-orange-100 text-orange-800',
    'Nutrición Deportiva': 'bg-green-100 text-green-800',
    'Fisioterapia': 'bg-blue-100 text-blue-800',
    'Recepción y Atención': 'bg-purple-100 text-purple-800',
    'Clases Grupales': 'bg-pink-100 text-pink-800',
    'Dirección': 'bg-gray-800 text-white'
  };
  return clases[departamento] || 'bg-gray-100 text-gray-800';
};

const verActividad = (empleado) => {
  toast.info(`Funcionalidad de historial de actividad próximamente para ${empleado.nombre}`);
};
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Users class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Gestión de Empleados</h1>
            <p class="text-white/80 mt-1">
              {{ empleados.length }} empleado{{ empleados.length !== 1 ? 's' : '' }} en tu organización
            </p>
          </div>
        </div>
        <button
          @click="isModalVisible = true"
          class="bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          Invitar Empleados
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasEmpleados" class="bg-white rounded-2xl shadow-lg border border-gray-100">
      <EmptyState
        :icon="Users"
        title="No hay empleados aún"
        description="Comienza invitando a los miembros de tu equipo. Ellos recibirán una invitación por email para unirse a la plataforma."
        action-text="Invitar empleados"
        :action-icon="Mail"
        @action="isModalVisible = true"
      />
    </div>

    <!-- Content con empleados -->
    <template v-else>
      <!-- Cards de Resumen KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Empleados</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Activos -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Activos</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.activos }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ stats.porcentajeActivos }}% del total</p>
        </div>

        <!-- Pendientes -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pendientes</p>
              <p class="text-2xl font-bold text-yellow-600 mt-1">{{ stats.pendientes }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Invitaciones sin aceptar</p>
        </div>

        <!-- Sin Participación -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Sin Participación</p>
              <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.sinParticipacion }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Sin actividad reciente</p>
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <!-- Búsqueda -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Buscar por nombre, email o cargo..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Filtros -->
        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-sm font-medium text-gray-700">Filtrar:</span>

          <!-- Estado -->
          <select
            v-model="filtros.estado"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Invitado">Pendientes</option>
            <option value="Inactivo">Inactivos</option>
          </select>

          <!-- Departamento -->
          <select
            v-model="filtros.departamento"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departamentos" :key="dept.id" :value="dept.id">
              {{ dept.nombre }}
            </option>
          </select>

          <!-- Participación -->
          <select
            v-model="filtros.participacion"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Cualquier nivel</option>
            <option value="alta">Alta (50+ puntos)</option>
            <option value="media">Media (10-49 puntos)</option>
            <option value="baja">Baja (1-9 puntos)</option>
            <option value="nula">Sin participación (0 puntos)</option>
          </select>

          <!-- Reset -->
          <button
            v-if="tienesFiltrosActivos"
            @click="resetFiltros"
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>

          <!-- Contador de resultados -->
          <span class="text-sm text-gray-500 ml-auto">
            {{ empleadosFiltrados.length }} de {{ empleados.length }} empleados
          </span>
        </div>
      </div>

      <!-- Tabla de Empleados -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <!-- Checkbox -->
                <th class="px-4 py-4 w-12">
                  <input
                    type="checkbox"
                    v-model="todosSeleccionados"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <!-- Nombre -->
                <th
                  @click="ordenarPor('nombre')"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1">
                    Nombre
                    <component
                      :is="getOrdenIcon('nombre')"
                      class="h-3 w-3"
                      :class="{ 'text-blue-600': ordenamiento.campo === 'nombre', 'opacity-50': ordenamiento.campo !== 'nombre' }"
                    />
                  </div>
                </th>
                <!-- Email -->
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <!-- Cargo -->
                <th
                  @click="ordenarPor('cargo')"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1">
                    Cargo
                    <component
                      :is="getOrdenIcon('cargo')"
                      class="h-3 w-3"
                      :class="{ 'text-blue-600': ordenamiento.campo === 'cargo', 'opacity-50': ordenamiento.campo !== 'cargo' }"
                    />
                  </div>
                </th>
                <!-- Departamento -->
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Departamento
                </th>
                <!-- Estado -->
                <th
                  @click="ordenarPor('estado')"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1">
                    Estado
                    <component
                      :is="getOrdenIcon('estado')"
                      class="h-3 w-3"
                      :class="{ 'text-blue-600': ordenamiento.campo === 'estado', 'opacity-50': ordenamiento.campo !== 'estado' }"
                    />
                  </div>
                </th>
                <!-- Puntos -->
                <th
                  @click="ordenarPor('puntos')"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1">
                    Puntos
                    <component
                      :is="getOrdenIcon('puntos')"
                      class="h-3 w-3"
                      :class="{ 'text-blue-600': ordenamiento.campo === 'puntos', 'opacity-50': ordenamiento.campo !== 'puntos' }"
                    />
                  </div>
                </th>
                <!-- Acciones -->
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="empleado in empleadosPaginados"
                :key="empleado.id"
                class="hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50/30': empleadosSeleccionados.includes(empleado.id) }"
              >
                <!-- Checkbox -->
                <td class="px-4 py-4">
                  <input
                    type="checkbox"
                    :checked="empleadosSeleccionados.includes(empleado.id)"
                    @change="toggleSeleccion(empleado.id)"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <!-- Nombre -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ empleado.nombre }}</div>
                    </div>
                  </div>
                </td>
                <!-- Email -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ empleado.email }}
                </td>
                <!-- Cargo -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ empleado.cargo || '-' }}
                </td>
                <!-- Departamento -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="empleado.departamento"
                    :class="getDepartamentoBadgeClass(empleado.departamento)"
                    class="px-3 py-1 text-xs font-medium rounded-full inline-block"
                  >
                    {{ empleado.departamento }}
                  </span>
                  <span v-else class="text-sm text-gray-400">Sin asignar</span>
                </td>
                <!-- Estado mejorado -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <!-- Badge con dot indicator -->
                    <div class="relative">
                      <span
                        :class="{
                          'bg-green-100 text-green-800': empleado.estado === 'Activo',
                          'bg-yellow-100 text-yellow-800': empleado.estado === 'Invitado',
                          'bg-gray-100 text-gray-800': empleado.estado === 'Inactivo'
                        }"
                        class="px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5"
                      >
                        <!-- Dot indicator -->
                        <span
                          :class="{
                            'bg-green-500': empleado.estado === 'Activo',
                            'bg-yellow-500': empleado.estado === 'Invitado',
                            'bg-gray-400': empleado.estado === 'Inactivo'
                          }"
                          class="w-1.5 h-1.5 rounded-full"
                        ></span>
                        {{ empleado.estado }}
                      </span>
                    </div>

                    <!-- Tooltip de último acceso -->
                    <div
                      v-if="empleado.estado === 'Activo'"
                      :title="getUltimoAccesoTexto(empleado)"
                      class="cursor-help"
                    >
                      <Info class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </div>
                  </div>

                  <!-- Indicador de alerta si no hay participación -->
                  <p
                    v-if="tieneAlertaParticipacion(empleado)"
                    class="text-xs text-red-600 mt-1 flex items-center gap-1"
                  >
                    <AlertTriangle class="h-3 w-3" />
                    Sin participación
                  </p>
                </td>
                <!-- Puntos con contexto -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    :title="`Nivel: ${getNivel(empleado.puntos || 0)}`"
                    class="cursor-help"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-gray-900">
                        {{ empleado.puntos || 0 }}
                      </span>

                      <!-- Badge de nivel -->
                      <span
                        :class="getNivelBadgeClass(empleado.puntos || 0)"
                        class="px-2 py-0.5 text-xs font-medium rounded"
                      >
                        {{ getNivel(empleado.puntos || 0) }}
                      </span>
                    </div>

                    <!-- Barra de progreso mini -->
                    <div class="w-20 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        :style="{ width: `${getProgresoNivel(empleado.puntos || 0)}%` }"
                        :class="getNivelBarClass(empleado.puntos || 0)"
                        class="h-full rounded-full transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </td>
                <!-- Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1">
                    <!-- Ver actividad -->
                    <div class="relative group">
                      <button
                        @click="verActividad(empleado)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Activity class="h-4 w-4" />
                      </button>
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Ver historial
                        <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                      </span>
                    </div>

                    <!-- Reenviar invitación -->
                    <div v-if="empleado.estado === 'Invitado'" class="relative group">
                      <button
                        @click="reenviarInvitacion(empleado)"
                        class="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Send class="h-4 w-4" />
                      </button>
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Reenviar invitación
                        <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                      </span>
                    </div>

                    <!-- Editar -->
                    <div class="relative group">
                      <button
                        @click="abrirModalEditar(empleado)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit3 class="h-4 w-4" />
                      </button>
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Editar empleado
                        <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="border-t border-gray-200 px-6 py-4">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="goToPage"
            @next="nextPage"
            @previous="previousPage"
          />
        </div>
      </div>
    </template>

    <!-- Barra de acciones flotante para selección múltiple -->
    <Transition name="slide-up">
      <div
        v-if="empleadosSeleccionados.length > 0"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-4 z-50 max-w-4xl"
      >
        <span class="font-medium whitespace-nowrap">
          {{ empleadosSeleccionados.length }} seleccionado{{ empleadosSeleccionados.length !== 1 ? 's' : '' }}
        </span>

        <div class="h-6 w-px bg-white/20"></div>

        <button
          @click="reenviarInvitacionesBloque"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Send class="h-4 w-4" />
          Reenviar invitaciones
        </button>

        <button
          @click="cambiarEstadoBloque"
          class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          Cambiar estado
        </button>

        <button
          @click="eliminarBloque"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Trash2 class="h-4 w-4" />
          Eliminar
        </button>

        <button
          @click="empleadosSeleccionados = []"
          class="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </Transition>

    <!-- Modales -->
    <InvitarEmpleadosModal
      v-if="isModalVisible"
      :departamentos="departamentos"
      @close="isModalVisible = false"
      @submit="handleInvitar"
    />

    <EditarEmpleadoModal
      v-if="isEditModalVisible"
      :empleado="empleadoSeleccionado"
      :departamentos="departamentos"
      @close="isEditModalVisible = false"
      @submit="handleActualizarEmpleado"
    />

  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>
