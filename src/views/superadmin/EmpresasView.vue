<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
        <p class="text-gray-600">Administra las empresas registradas en la plataforma</p>
      </div>
      <button @click="showModal = true" class="btn btn-primary">
        Nueva Empresa
      </button>
    </div>

    <!-- Búsqueda y filtros -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            type="text"
            placeholder="Buscar por nombre o dominio..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select v-model="statusFilter" @change="cargarEmpresas" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los estados</option>
          <option value="true">Activas</option>
          <option value="false">Inactivas</option>
        </select>
        <button @click="cargarEmpresas" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          🔍 Actualizar
        </button>
      </div>
    </div>

    <!-- Tabla de empresas -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dominio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  Cargando empresas...
                </div>
              </td>
            </tr>
            <tr v-else-if="empresasFiltradas.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                {{ searchTerm ? 'No se encontraron empresas con ese criterio' : 'No hay empresas registradas' }}
              </td>
            </tr>
            <tr v-else v-for="empresa in empresasFiltradas" :key="empresa.empresa_id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-medium">{{ empresa.empresa_nombre?.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ empresa.empresa_nombre }}</div>
                    <div class="text-sm text-gray-500">Score: {{ empresa.actividad_score }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ empresa.dominio_email }}</code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="empresa.telefono">📞 {{ empresa.telefono }}</div>
                <div v-if="empresa.sitio_web">
                  <a :href="empresa.sitio_web" target="_blank" class="text-blue-600 hover:underline">
                    🌐 Sitio web
                  </a>
                </div>
                <div v-if="!empresa.telefono && !empresa.sitio_web" class="text-gray-400">Sin datos</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="empresa.servicios_activos" class="flex flex-wrap gap-1">
                  <span 
                    v-for="servicio in empresa.servicios_activos.split(', ').slice(0, 3)" 
                    :key="servicio"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ servicio }}
                  </span>
                  <span v-if="empresa.servicios_activos.split(', ').length > 3" class="text-xs text-gray-500">
                    +{{ empresa.servicios_activos.split(', ').length - 3 }} más
                  </span>
                </div>
                <span v-else class="text-gray-400 text-sm">Sin servicios</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="empresa.empresa_activa" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Activa
                </span>
                <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Inactiva
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="verDetalles(empresa)" class="text-blue-600 hover:text-blue-900" title="Ver detalles">
                    👁️
                  </button>
                  <button @click="editarEmpresa(empresa)" class="text-green-600 hover:text-green-900" title="Editar">
                    ✏️
                  </button>
                  <button @click="toggleEstado(empresa)" :class="empresa.empresa_activa ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'" :title="empresa.empresa_activa ? 'Desactivar' : 'Activar'">
                    {{ empresa.empresa_activa ? '🚫' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Nueva Empresa -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Nueva Empresa</h2>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form @submit.prevent="crearEmpresa" class="p-6 space-y-4">
          <!-- Información de la empresa -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Empresa</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
                <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dominio de Email *</label>
                <input v-model="form.dominio_email" type="text" placeholder="empresa.com" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                <input v-model="form.sitio_web" type="url" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <!-- Administrador -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Administrador Inicial</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input v-model="form.admin_nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                <input v-model="form.admin_apellido" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input v-model="form.admin_email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p class="text-xs text-gray-500 mt-1">Debe usar el dominio de la empresa</p>
              </div>
            </div>
          </div>

          <!-- Servicios -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Servicios Contratados</h3>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="servicio in serviciosDisponibles" :key="servicio" class="flex items-center">
                <input type="checkbox" :value="servicio" v-model="form.servicios" class="mr-2" />
                <span class="text-sm capitalize">{{ servicio }}</span>
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="cerrarModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Creando...' : 'Crear Empresa' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="text-center">
            <div class="text-green-600 text-6xl mb-4">✅</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">¡Empresa Creada!</h3>
            <div class="text-sm text-gray-600 mb-4 p-4 bg-gray-50 rounded-lg">
              <p class="mb-2">La empresa se ha creado exitosamente.</p>
              <p class="mb-2">
                <strong>Email del administrador:</strong><br>
                <code class="bg-white px-2 py-1 rounded border">{{ empresaCreada?.admin_email }}</code>
              </p>
              <p class="text-xs text-blue-600">
                El administrador debe registrarse en la plataforma con este email.
              </p>
            </div>
            <button @click="showSuccessModal = false" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Empresa -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Editar Empresa</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form @submit.prevent="guardarCambios" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
            <input 
              v-model="empresaEditando.empresa_nombre" 
              type="text" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dominio de Email</label>
            <input 
              :value="empresaEditando.dominio_email" 
              type="text" 
              disabled 
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" 
            />
            <p class="text-xs text-gray-500 mt-1">El dominio no se puede modificar</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              v-model="empresaEditando.telefono" 
              type="tel" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
            <input 
              v-model="empresaEditando.sitio_web" 
              type="url" 
              placeholder="https://..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detalles Empresa -->
    <div v-if="showDetailsModal && empresaDetalles" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Detalles de {{ empresaDetalles.empresa?.nombre }}</h2>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Información básica -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Información General</h3>
              <div class="space-y-2 text-sm">
                <div><strong>Nombre:</strong> {{ empresaDetalles.empresa?.nombre }}</div>
                <div><strong>Dominio:</strong> {{ empresaDetalles.empresa?.dominio_email }}</div>
                <div v-if="empresaDetalles.empresa?.telefono"><strong>Teléfono:</strong> {{ empresaDetalles.empresa?.telefono }}</div>
                <div v-if="empresaDetalles.empresa?.sitio_web">
                  <strong>Sitio Web:</strong> 
                  <a :href="empresaDetalles.empresa?.sitio_web" target="_blank" class="text-blue-600 hover:underline ml-1">
                    {{ empresaDetalles.empresa?.sitio_web }}
                  </a>
                </div>
                <div><strong>Estado:</strong> 
                  <span :class="empresaDetalles.empresa?.activo ? 'text-green-600' : 'text-red-600'">
                    {{ empresaDetalles.empresa?.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </div>
                <div><strong>Score:</strong> {{ empresaDetalles.empresa?.actividad_score }}</div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Estadísticas</h3>
              <div class="space-y-2 text-sm">
                <div><strong>Empleados:</strong> {{ empresaDetalles.empleados_count }}</div>
                <div><strong>Administradores:</strong> {{ empresaDetalles.administradores?.length || 0 }}</div>
                <div><strong>Servicios Contratados:</strong> {{ empresaDetalles.servicios_contratados?.length || 0 }}</div>
                <div><strong>Fecha Registro:</strong> {{ formatDate(empresaDetalles.empresa?.fecha_registro) }}</div>
              </div>
            </div>
          </div>

          <!-- Administradores -->
          <div v-if="empresaDetalles.administradores?.length">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Administradores</h3>
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="admin in empresaDetalles.administradores" :key="admin.id">
                    <td class="px-4 py-2 text-sm">{{ admin.nombre }} {{ admin.apellido }}</td>
                    <td class="px-4 py-2 text-sm">{{ admin.email }}</td>
                    <td class="px-4 py-2 text-sm">
                      <span :class="admin.activo ? 'text-green-600' : 'text-red-600'">
                        {{ admin.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Servicios Contratados -->
          <div v-if="empresaDetalles.servicios_contratados?.length">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Servicios Contratados</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="servicio in empresaDetalles.servicios_contratados" 
                :key="servicio.tipo_servicio"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900 capitalize">{{ servicio.tipo_servicio }}</h4>
                  <span :class="servicio.activo ? 'text-green-600' : 'text-red-600'" class="text-sm">
                    {{ servicio.activo ? '✓ Activo' : '✗ Inactivo' }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-2">
                  <div>Inicio: {{ formatDate(servicio.fecha_inicio) }}</div>
                  <div v-if="servicio.fecha_fin">Fin: {{ formatDate(servicio.fecha_fin) }}</div>
                  <div v-else>Sin fecha de fin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-6 border-t border-gray-200">
          <button @click="showDetailsModal = false" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div v-if="notificacion" class="fixed top-4 right-4 z-50">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg text-white',
        notificacion.tipo === 'success' ? 'bg-green-500' : 
        notificacion.tipo === 'error' ? 'bg-red-500' : 'bg-blue-500'
      ]">
        {{ notificacion.mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../services/supabase'

// Estados reactivos
const empresas = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const showSuccessModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const empresaCreada = ref(null)
const empresaEditando = ref(null)
const empresaDetalles = ref(null)
const stats = ref(null)
const notificacion = ref(null)
const searchTerm = ref('')
const statusFilter = ref('')

// Formulario
const form = ref({
  nombre: '',
  dominio_email: '',
  telefono: '',
  sitio_web: '',
  admin_nombre: '',
  admin_apellido: '',
  admin_email: '',
  servicios: []
})

const serviciosDisponibles = [
  'yoga', 'meditacion', 'nutricion', 'coaching', 'psicoterapia', 'entrenamiento', 'encuestas'
]

// Computed
const empresasFiltradas = computed(() => {
  let resultado = empresas.value

  // Filtrar por búsqueda
  if (searchTerm.value) {
    const termino = searchTerm.value.toLowerCase()
    resultado = resultado.filter(empresa =>
      empresa.empresa_nombre?.toLowerCase().includes(termino) ||
      empresa.dominio_email?.toLowerCase().includes(termino)
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== '') {
    const activo = statusFilter.value === 'true'
    resultado = resultado.filter(empresa => empresa.empresa_activa === activo)
  }

  return resultado
})

// Métodos
const cargarEmpresas = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('panel_superadmin')
      .select('*')
      .order('fecha_registro', { ascending: false })

    if (error) throw error
    empresas.value = data || []
  } catch (error) {
    console.error('Error cargando empresas:', error)
    showNotificacion('Error al cargar las empresas: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const crearEmpresa = async () => {
  try {
    saving.value = true

    // Validar que el email del admin pertenezca al dominio
    if (!form.value.admin_email.endsWith(`@${form.value.dominio_email}`)) {
      throw new Error('El email del administrador debe pertenecer al dominio de la empresa')
    }

    const { data, error } = await supabase.rpc('crear_empresa_completa', {
      p_nombre: form.value.nombre,
      p_dominio_email: form.value.dominio_email,
      p_admin_nombre: form.value.admin_nombre,
      p_admin_apellido: form.value.admin_apellido,
      p_admin_email: form.value.admin_email,
      p_telefono: form.value.telefono || null,
      p_sitio_web: form.value.sitio_web || null,
      p_servicios: form.value.servicios
    })

    if (error) throw error

    // Mostrar modal de éxito
    empresaCreada.value = data
    showModal.value = false
    showSuccessModal.value = true

    // Limpiar formulario
    form.value = {
      nombre: '',
      dominio_email: '',
      telefono: '',
      sitio_web: '',
      admin_nombre: '',
      admin_apellido: '',
      admin_email: '',
      servicios: []
    }

    // Recargar lista
    cargarEmpresas()
    showNotificacion('✅ Empresa creada exitosamente', 'success')

  } catch (error) {
    console.error('Error creando empresa:', error)
    showNotificacion('Error al crear la empresa: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const editarEmpresa = async (empresa) => {
  empresaEditando.value = { ...empresa }
  showEditModal.value = true
}

const verDetalles = async (empresa) => {
  try {
    const { data, error } = await supabase.rpc('get_empresa_detalles', {
      empresa_id_param: empresa.empresa_id
    })
    
    if (error) throw error
    
    empresaDetalles.value = data
    showDetailsModal.value = true
  } catch (error) {
    console.error('Error obteniendo detalles:', error)
    showNotificacion('Error al obtener los detalles de la empresa', 'error')
  }
}

const guardarCambios = async () => {
  try {
    saving.value = true
    
    const { error } = await supabase.rpc('actualizar_empresa', {
      empresa_id_param: empresaEditando.value.empresa_id,
      p_nombre: empresaEditando.value.empresa_nombre,
      p_telefono: empresaEditando.value.telefono,
      p_sitio_web: empresaEditando.value.sitio_web
    })
    
    if (error) throw error
    
    showEditModal.value = false
    cargarEmpresas()
    showNotificacion('✅ Empresa actualizada correctamente', 'success')
  } catch (error) {
    console.error('Error actualizando empresa:', error)
    showNotificacion('Error al actualizar la empresa: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const toggleEstado = async (empresa) => {
  try {
    const { error } = await supabase
      .from('empresas')
      .update({ activo: !empresa.empresa_activa })
      .eq('id', empresa.empresa_id)

    if (error) throw error
    
    cargarEmpresas()
    showNotificacion(
      `✅ Empresa ${!empresa.empresa_activa ? 'activada' : 'desactivada'} correctamente`, 
      'success'
    )
  } catch (error) {
    console.error('Error cambiando estado:', error)
    showNotificacion('Error al cambiar el estado de la empresa', 'error')
  }
}

const cerrarModal = () => {
  showModal.value = false
  // Limpiar formulario
  form.value = {
    nombre: '',
    dominio_email: '',
    telefono: '',
    sitio_web: '',
    admin_nombre: '',
    admin_apellido: '',
    admin_email: '',
    servicios: []
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showNotificacion = (mensaje, tipo = 'info') => {
  notificacion.value = { mensaje, tipo, id: Date.now() }
  setTimeout(() => {
    notificacion.value = null
  }, 3000)
}

const cargarEstadisticas = async () => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats')
    if (error) throw error
    stats.value = data
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

// Búsqueda con debounce
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // La búsqueda se maneja automáticamente por el computed
  }, 300)
}

// Cargar datos al montar
onMounted(() => {
  cargarEmpresas()
  cargarEstadisticas()
})
</script>