<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { DEMO_MODE, demoData } from '@/utils/demoData';
import { Users, Plus, Mail } from 'lucide-vue-next';
import EmptyState from '@/components/common/EmptyState.vue';
import InvitarEmpleadosModal from '@/components/admin/InvitarEmpleadosModal.vue';
import EditarEmpleadoModal from '@/components/admin/EditarEmpleadoModal.vue';

const authStore = useAuthStore();

const empleados = ref([]);
const departamentos = ref([]);
const isLoading = ref(true);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const empleadoSeleccionado = ref(null);

const hasEmpleados = computed(() => empleados.value.length > 0);

onMounted(async () => {
  await Promise.all([
    cargarEmpleados(),
    cargarDepartamentos()
  ]);
});

const cargarEmpleados = async () => {
  isLoading.value = true;
  try {
    if (DEMO_MODE.enabled) {
      console.log('[DEMO MODE] Cargando empleados demo:', demoData.empleados.length);
      empleados.value = demoData.empleados.map(emp => ({
        ...emp,
        departamento: emp.departamentos?.nombre || null
      }));
    } else {
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
    }
  } catch (error) {
    console.error('Error cargando empleados:', error);
  } finally {
    isLoading.value = false;
  }
};

const cargarDepartamentos = async () => {
  try {
    if (DEMO_MODE.enabled) {
      departamentos.value = demoData.departamentos;
    } else {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('empresa_id', authStore.empresaId)
        .order('nombre');

      if (error) throw error;
      departamentos.value = data || [];
    }
  } catch (error) {
    console.error('Error cargando departamentos:', error);
  }
};

const handleInvitar = async (datosEmpleados) => {
  if (DEMO_MODE.enabled) {
    console.log('[DEMO MODE] Simulando invitación de empleados');
    isModalVisible.value = false;
    return;
  }

  try {
    const empleadosParaInsertar = datosEmpleados.map(emp => ({
      empresa_id: authStore.empresaId,
      nombre: emp.nombre,
      email: emp.email,
      departamento_id: emp.departamento_id,
      cargo: emp.cargo || '',
      estado: 'Invitado',
      puntos: 0,
      es_admin: false
    }));

    const { error } = await supabase
      .from('empleados')
      .insert(empleadosParaInsertar);

    if (error) throw error;

    await cargarEmpleados();
    isModalVisible.value = false;
  } catch (error) {
    console.error('Error invitando empleados:', error);
    alert('Error al invitar empleados. Por favor intenta de nuevo.');
  }
};

const abrirModalEditar = (empleado) => {
  empleadoSeleccionado.value = empleado;
  isEditModalVisible.value = true;
};

const handleActualizarEmpleado = async (datosActualizados) => {
  if (DEMO_MODE.enabled) {
    console.log('[DEMO MODE] Simulando actualización de empleado');
    isEditModalVisible.value = false;
    return;
  }

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
  } catch (error) {
    console.error('Error actualizando empleado:', error);
    alert('Error al actualizar empleado. Por favor intenta de nuevo.');
  }
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

    <!-- Tabla de Empleados -->
    <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cargo
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Departamento
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Puntos
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="empleado in empleados" :key="empleado.id" class="hover:bg-gray-50 transition-colors">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ empleado.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ empleado.cargo || '-' }}
              </td>
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-green-100 text-green-800': empleado.estado === 'Activo',
                    'bg-yellow-100 text-yellow-800': empleado.estado === 'Invitado',
                    'bg-gray-100 text-gray-800': empleado.estado === 'Inactivo'
                  }"
                  class="px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ empleado.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ empleado.puntos || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="abrirModalEditar(empleado)"
                  class="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
