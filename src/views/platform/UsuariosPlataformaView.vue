<script setup>
import { ref, onMounted } from 'vue';
import {
  Users,
  Plus,
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  X,
  Check
} from 'lucide-vue-next';
import { platformService } from '@/services/platform.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const loading = ref(true);
const usuarios = ref([]);
const showModal = ref(false);
const selectedUsuario = ref(null);

onMounted(async () => {
  await loadUsuarios();
});

const loadUsuarios = async () => {
  loading.value = true;
  try {
    usuarios.value = await platformService.getUsuariosPlataforma();
  } catch (error) {
    console.error('Error loading usuarios:', error);
  } finally {
    loading.value = false;
  }
};

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
};

const getRolLabel = (rol) => {
  const roles = {
    superadmin: 'Super Admin',
    soporte: 'Soporte',
    comercial: 'Comercial'
  };
  return roles[rol] || rol;
};

const getRolColor = (rol) => {
  const colors = {
    superadmin: 'bg-emerald-100 text-emerald-700',
    soporte: 'bg-blue-100 text-blue-700',
    comercial: 'bg-amber-100 text-amber-700'
  };
  return colors[rol] || 'bg-gray-100 text-gray-700';
};

const toggleActivo = async (usuario) => {
  try {
    await platformService.updateUsuarioPlataforma(usuario.id, {
      activo: !usuario.activo
    });
    usuario.activo = !usuario.activo;
  } catch (error) {
    console.error('Error updating usuario:', error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500">Gestiona los usuarios internos de la plataforma SMART Bienestar</p>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else-if="usuarios.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
      <Users class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
      <p class="text-gray-500 mb-4">Aun no se han registrado usuarios de plataforma</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Usuario
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Rol
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fecha Registro
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="usuario in usuarios"
            :key="usuario.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span class="text-emerald-700 font-medium">
                    {{ usuario.nombre?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ usuario.nombre }}</p>
                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <Mail class="w-3 h-3" />
                    <span>{{ usuario.email }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
                :class="getRolColor(usuario.rol)"
              >
                <Shield class="w-3 h-3" />
                {{ getRolLabel(usuario.rol) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Calendar class="w-4 h-4" />
                <span>{{ formatFecha(usuario.fecha_creacion) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full"
                :class="usuario.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ usuario.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button
                @click="toggleActivo(usuario)"
                class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                :class="usuario.activo
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-green-600 hover:bg-green-50'"
              >
                {{ usuario.activo ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p class="text-sm text-blue-800">
        <strong>Nota:</strong> Para agregar nuevos usuarios de plataforma, primero deben registrarse con su email
        y luego se les asigna el rol correspondiente directamente en la base de datos.
      </p>
    </div>
  </div>
</template>
