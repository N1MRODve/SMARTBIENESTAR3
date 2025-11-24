<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Catálogo de Recompensas</h1>
        <p class="text-lg text-gray-600 mb-6">Canjea tus puntos de bienestar por increíbles recompensas</p>

        <!-- Saldo de Puntos Prominente -->
        <div class="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-lg mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <div class="text-left">
            <p class="text-sm text-white/90 font-medium">Tu saldo actual</p>
            <p class="text-4xl font-bold">{{ puntosUsuario.toLocaleString() }} <span class="text-xl">Puntos</span></p>
          </div>
        </div>

        <!-- Leyenda de Cómo Ganar Puntos -->
        <div class="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-lg font-bold text-blue-900 mb-2">¿Cómo gano puntos?</h3>
              <p class="text-sm text-blue-800 mb-3">Los puntos se acumulan automáticamente al participar en nuestras actividades de bienestar:</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+100</p>
                  <p class="text-xs text-blue-800">Por encuesta completada</p>
                </div>
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+150</p>
                  <p class="text-xs text-blue-800">Respuesta en menos de 24h</p>
                </div>
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+200</p>
                  <p class="text-xs text-blue-800">Participación mensual completa</p>
                </div>
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+75</p>
                  <p class="text-xs text-blue-800">Asistencia a eventos</p>
                </div>
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+300</p>
                  <p class="text-xs text-blue-800">Sugerencia implementada</p>
                </div>
                <div class="bg-white rounded-lg p-3 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">+50</p>
                  <p class="text-xs text-blue-800">Referir empleado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
      <p class="text-gray-600">Cargando catálogo de recompensas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las recompensas</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="cargarRecompensas" variant="outline">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="recompensas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <Gift class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay recompensas disponibles</h3>
      <p class="text-gray-500">El catálogo de recompensas se actualizará pronto</p>
    </div>

    <!-- Catálogo de Recompensas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="recompensa in recompensas" 
        :key="recompensa.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        <!-- Header de la Recompensa -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center">
          <div class="text-4xl mb-3">{{ recompensa.icono }}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ recompensa.titulo }}</h3>
          <p class="text-sm text-gray-600">{{ recompensa.descripcion }}</p>
        </div>

        <!-- Contenido de la Recompensa -->
        <div class="p-6">
          <!-- Coste en Puntos -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full">
              <svg class="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-2xl font-bold text-primary">{{ recompensa.coste }}</span>
              <span class="text-sm text-primary ml-1">puntos</span>
            </div>
          </div>

          <!-- Información Adicional -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center text-gray-500">
                <Tag class="h-4 w-4 mr-2" />
                <span>Categoría</span>
              </div>
              <span class="font-medium text-gray-900 capitalize">{{ recompensa.categoria }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center text-gray-500">
                <Star class="h-4 w-4 mr-2" />
                <span>Popularidad</span>
              </div>
              <div class="flex">
                <Star 
                  v-for="i in 5" 
                  :key="i"
                  :class="[
                    'h-4 w-4',
                    i <= recompensa.popularidad ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  ]"
                />
              </div>
            </div>
          </div>

          <!-- Estado y Botón de Canje -->
          <div class="space-y-3">
            <!-- Indicador de Puntos Suficientes/Insuficientes -->
            <div v-if="puntosUsuario < recompensa.coste" class="text-center">
              <div class="flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200 mb-3">
                <AlertCircle class="h-5 w-5 text-red-600 mr-2" />
                <span class="text-red-800 font-medium text-sm">
                  Te faltan {{ recompensa.coste - puntosUsuario }} puntos
                </span>
              </div>
            </div>

            <!-- Botón de Canje -->
            <Button 
              @click="canjearRecompensa(recompensa.id)"
              :loading="canjeandoId === recompensa.id"
              :disabled="puntosUsuario < recompensa.coste || !recompensa.disponible"
              class="w-full"
              :class="{
                'opacity-50 cursor-not-allowed': puntosUsuario < recompensa.coste
              }"
            >
              <template v-if="!recompensa.disponible">
                <X class="h-4 w-4 mr-2" />
                No Disponible
              </template>
              <template v-else-if="puntosUsuario < recompensa.coste">
                <Lock class="h-4 w-4 mr-2" />
                Puntos Insuficientes
              </template>
              <template v-else>
                <ShoppingCart class="h-4 w-4 mr-2" />
                Canjear Ahora
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AlertCircle, RefreshCw, Gift, Tag, Star, X, Lock, ShoppingCart } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { recompensasService } from '@/services/recompensas.service'

const loading = ref(true)
const error = ref(null)
const recompensas = ref([])
const puntosUsuario = ref(2450)
const canjeandoId = ref(null)

const iconosPorCategoria = {
  entrenamiento: '🏋️',
  nutricion: '🥗',
  bienestar: '💆‍♀️',
  evaluacion: '📊',
  merchandising: '👕',
  beneficio: '🎁',
  tecnologia: '⌚'
}

const cargarRecompensas = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await recompensasService.getAll()
    recompensas.value = data.map(rec => ({
      id: rec.id,
      titulo: rec.nombre,
      descripcion: rec.descripcion,
      icono: iconosPorCategoria[rec.categoria] || '🎁',
      coste: rec.puntos_requeridos || rec.costo_puntos,
      categoria: rec.categoria,
      popularidad: Math.min(5, Math.max(1, Math.floor(((rec.stock_total - rec.stock_disponible) / rec.stock_total) * 5) || 4)),
      disponible: rec.activo && rec.stock_disponible > 0,
      stock: rec.stock_disponible
    }))
  } catch (err) {
    console.error('Error cargando recompensas:', err)
    error.value = 'No se pudieron cargar las recompensas. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const canjearRecompensa = async (recompensaId) => {
  const recompensa = recompensas.value.find(r => r.id === recompensaId)
  
  if (!recompensa || puntosUsuario.value < recompensa.coste) {
    return
  }
  
  canjeandoId.value = recompensaId
  
  try {
    // Simular proceso de canje
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Descontar puntos
    puntosUsuario.value -= recompensa.coste
    
    // Mostrar confirmación
    alert(`¡Felicidades! Has canjeado "${recompensa.titulo}" por ${recompensa.coste} puntos. Te contactaremos pronto con los detalles.`)
    
  } catch (err) {
    alert('Error al procesar el canje. Inténtalo de nuevo.')
  } finally {
    canjeandoId.value = null
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarRecompensas()
})
</script>