<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Colaboradores</h1>
        <p class="text-gray-600">Administra los profesionales de bienestar</p>
      </div>
      <button @click="mostrarModalInvitar = true" class="btn btn-primary">
        ➕ Invitar Colaborador
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" v-if="stats">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div class="flex items-center">
          <div class="text-2xl mr-3">👥</div>
          <div>
            <p class="text-sm font-medium text-gray-500">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total_colaboradores }}</p>
          </div>
        </div>
      </div>
      <div class="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
        <div class="flex items-center">
          <div class="text-2xl mr-3">⏳</div>
          <div>
            <p class="text-sm font-medium text-gray-500">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendientes_aprobacion }}</p>
          </div>
        </div>
      </div>
      <div class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
        <div class="flex items-center">
          <div class="text-2xl mr-3">✅</div>
          <div>
            <p class="text-sm font-medium text-gray-500">Verificados</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.verificados }}</p>
          </div>
        </div>
      </div>
      <div class="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
        <div class="flex items-center">
          <div class="text-2xl mr-3">⭐</div>
          <div>
            <p class="text-sm font-medium text-gray-500">Calificación</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.calificacion_promedio ? stats.calificacion_promedio.toFixed(1) : 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar colaboradores..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select v-model="filtroEstado" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="verificado">Verificados</option>
          <option value="rechazado">Rechazados</option>
        </select>
        <button @click="cargarDatos" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          🔍 Buscar
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colaborador</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  Cargando...
                </div>
              </td>
            </tr>
            <tr v-else-if="colaboradores.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No hay colaboradores
              </td>
            </tr>
            <tr v-else v-for="colaborador in colaboradores" :key="colaborador.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-600 font-medium">
                      {{ colaborador.nombre ? colaborador.nombre.charAt(0) : '' }}{{ colaborador.apellido ? colaborador.apellido.charAt(0) : '' }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ colaborador.nombre }} {{ colaborador.apellido }}</div>
                    <div class="text-sm text-gray-500">{{ colaborador.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ colaborador.especialidad }}</div>
                <div class="text-sm text-gray-500">{{ colaborador.experiencia }} años</div>
              </td>
              <td class="px-6 py-4">
                <span v-if="colaborador.estado === 'pendiente'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pendiente
                </span>
                <span v-else-if="colaborador.estado === 'verificado'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Verificado
                </span>
                <span v-else-if="colaborador.estado === 'rechazado'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Rechazado
                </span>
                <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ colaborador.estado }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button @click="verDetalles(colaborador)" class="text-blue-600 hover:text-blue-900">
                    👁️
                  </button>
                  <button v-if="colaborador.estado === 'pendiente'" @click="aprobar(colaborador)" class="text-green-600 hover:text-green-900">
                    ✅
                  </button>
                  <button v-if="colaborador.estado === 'pendiente'" @click="rechazar(colaborador)" class="text-red-600 hover:text-red-900">
                    ❌
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Invitar Colaborador -->
    <div v-if="mostrarModalInvitar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">Invitar Colaborador</h2>
          <button @click="cerrarModalInvitar" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form @submit.prevent="invitarColaborador" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input v-model="formInvitar.nombre" type="text" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input v-model="formInvitar.apellido" type="text" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input v-model="formInvitar.email" type="email" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
              <select v-model="formInvitar.especialidad" required 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar especialidad</option>
                <option value="Instructor de Yoga">Instructor de Yoga</option>
                <option value="Nutricionista">Nutricionista</option>
                <option value="Coach Personal">Coach Personal</option>
                <option value="Psicólogo">Psicólogo</option>
                <option value="Entrenador Físico">Entrenador Físico</option>
                <option value="Especialista en Meditación">Especialista en Meditación</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="cerrarModalInvitar" 
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="loading"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Invitando...' : 'Invitar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detalles -->
    <div v-if="mostrarDetalles" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">Detalles del Colaborador</h2>
          <button @click="mostrarDetalles = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div class="p-6" v-if="colaboradorSeleccionado">
          <div class="space-y-4">
            <div><strong>Nombre:</strong> {{ colaboradorSeleccionado.nombre }} {{ colaboradorSeleccionado.apellido }}</div>
            <div><strong>Email:</strong> {{ colaboradorSeleccionado.email }}</div>
            <div><strong>Especialidad:</strong> {{ colaboradorSeleccionado.especialidad }}</div>
            <div><strong>Experiencia:</strong> {{ colaboradorSeleccionado.experiencia }} años</div>
            <div><strong>Estado:</strong> {{ colaboradorSeleccionado.estado }}</div>
          </div>
        </div>
        <div class="flex justify-end p-6 border-t">
          <button @click="mostrarDetalles = false" class="px-4 py-2 bg-blue-600 text-white rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div v-if="notificacion" class="fixed top-4 right-4 z-50">
      <div class="px-6 py-4 rounded-lg shadow-lg bg-green-500 text-white">
        {{ notificacion }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../services/supabase'

const colaboradores = ref([])
const loading = ref(false)
const mostrarDetalles = ref(false)
const mostrarModalInvitar = ref(false)
const colaboradorSeleccionado = ref(null)
const stats = ref(null)
const notificacion = ref(null)
const busqueda = ref('')
const filtroEstado = ref('')

// Formulario de invitación
const formInvitar = ref({
  nombre: '',
  apellido: '',
  email: '',
  especialidad: ''
})

const cargarDatos = async () => {
  try {
    loading.value = true
    let data, error
    
    if (filtroEstado.value) {
      // Usar función con filtro de estado
      const result = await supabase.rpc('get_colaboradores_por_estado', {
        filtro_estado: filtroEstado.value
      })
      data = result.data
      error = result.error
    } else {
      // Usar función sin filtros
      const result = await supabase.rpc('get_colaboradores_todos')
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error SQL:', error)
      throw error
    }
    
    // Aplicar filtro de búsqueda en el frontend si existe
    let colaboradoresFiltrados = data || []
    if (busqueda.value) {
      const termino = busqueda.value.toLowerCase()
      colaboradoresFiltrados = colaboradoresFiltrados.filter(c =>
        c.nombre?.toLowerCase().includes(termino) ||
        c.apellido?.toLowerCase().includes(termino) ||
        c.email?.toLowerCase().includes(termino) ||
        c.especialidad?.toLowerCase().includes(termino)
      )
    }
    
    colaboradores.value = colaboradoresFiltrados
    console.log('Colaboradores cargados:', colaboradoresFiltrados)
  } catch (error) {
    console.error('Error completo:', error)
    mostrarNotificacion('Error al cargar colaboradores: ' + error.message)
  } finally {
    loading.value = false
  }
}

const cargarEstadisticas = async () => {
  try {
    const { data, error } = await supabase.rpc('get_stats_colaboradores_simple')
    if (error) {
      console.error('Error estadísticas:', error)
      throw error
    }
    stats.value = data
    console.log('Estadísticas:', data)
  } catch (error) {
    console.error('Error estadísticas completo:', error)
  }
}

const verDetalles = (colaborador) => {
  colaboradorSeleccionado.value = colaborador
  mostrarDetalles.value = true
}

const aprobar = async (colaborador) => {
  try {
    const { error } = await supabase.rpc('aprobar_colaborador', {
      colaborador_id_param: colaborador.id,
      nuevo_estado: 'verificado'
    })

    if (error) throw error
    mostrarNotificacion('Colaborador aprobado')
    cargarDatos()
    cargarEstadisticas()
  } catch (error) {
    console.error('Error:', error)
    mostrarNotificacion('Error al aprobar')
  }
}

const rechazar = async (colaborador) => {
  try {
    const { error } = await supabase.rpc('aprobar_colaborador', {
      colaborador_id_param: colaborador.id,
      nuevo_estado: 'rechazado'
    })

    if (error) throw error
    mostrarNotificacion('Colaborador rechazado')
    cargarDatos()
    cargarEstadisticas()
  } catch (error) {
    console.error('Error:', error)
    mostrarNotificacion('Error al rechazar')
  }
}

const invitarColaborador = async () => {
  try {
    loading.value = true
    
    // Crear usuario colaborador
    const nuevoId = crypto.randomUUID()
    
    // Insertar en usuarios
    const { error: errorUsuario } = await supabase
      .from('usuarios')
      .insert({
        id: nuevoId,
        email: formInvitar.value.email,
        nombre: formInvitar.value.nombre,
        apellido: formInvitar.value.apellido,
        tipo_usuario: 'colaborador',
        activo: true
      })
    
    if (errorUsuario) throw errorUsuario
    
    // Insertar perfil colaborador
    const { error: errorPerfil } = await supabase
      .from('perfil_colaboradores')
      .insert({
        usuario_id: nuevoId,
        especialidad: formInvitar.value.especialidad,
        estado: 'pendiente',
        verificado: false,
        experiencia: 0
      })
    
    if (errorPerfil) throw errorPerfil
    
    mostrarNotificacion('Colaborador invitado correctamente')
    cerrarModalInvitar()
    cargarDatos()
    cargarEstadisticas()
    
  } catch (error) {
    console.error('Error invitando:', error)
    mostrarNotificacion('Error al invitar colaborador: ' + error.message)
  } finally {
    loading.value = false
  }
}

const cerrarModalInvitar = () => {
  mostrarModalInvitar.value = false
  formInvitar.value = {
    nombre: '',
    apellido: '',
    email: '',
    especialidad: ''
  }
}

const mostrarNotificacion = (mensaje) => {
  notificacion.value = mensaje
  setTimeout(() => {
    notificacion.value = null
  }, 3000)
}

onMounted(() => {
  cargarDatos()
  cargarEstadisticas()
})
</script>