<template>
  <div class="space-y-6">
    <!-- Header con saldo -->
    <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
      <!-- Patrón decorativo -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div class="relative z-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">Recompensas</h1>
            <p class="text-amber-100 mt-2">
              Canjea tus puntos por beneficios exclusivos de tu empresa
            </p>
          </div>

          <!-- Saldo prominente -->
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-center min-w-[180px]">
            <p class="text-amber-100 text-sm mb-1">Tu saldo actual</p>
            <div class="flex items-center justify-center gap-2">
              <Star class="w-8 h-8 text-amber-300 fill-amber-300" />
              <span class="text-4xl font-bold">{{ puntosUsuario.toLocaleString() }}</span>
            </div>
            <p class="text-amber-200 text-sm mt-1">puntos disponibles</p>
          </div>
        </div>

        <!-- Tabs de navegación -->
        <div class="flex gap-2 mt-6 border-t border-white/20 pt-4">
          <button
            @click="tabActiva = 'catalogo'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="tabActiva === 'catalogo'
              ? 'bg-white text-amber-600'
              : 'bg-white/10 text-white hover:bg-white/20'"
          >
            <Gift class="w-4 h-4 inline mr-2" />
            Catálogo
          </button>
          <button
            @click="tabActiva = 'historial'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="tabActiva === 'historial'
              ? 'bg-white text-amber-600'
              : 'bg-white/10 text-white hover:bg-white/20'"
          >
            <Clock class="w-4 h-4 inline mr-2" />
            Mis canjes
          </button>
          <button
            @click="tabActiva = 'puntos'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="tabActiva === 'puntos'
              ? 'bg-white text-amber-600'
              : 'bg-white/10 text-white hover:bg-white/20'"
          >
            <TrendingUp class="w-4 h-4 inline mr-2" />
            Historial puntos
          </button>
        </div>
      </div>
    </div>

    <!-- Tab: Catálogo -->
    <template v-if="tabActiva === 'catalogo'">
      <!-- Cómo ganar puntos -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <HelpCircle class="w-5 h-5 text-blue-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-3">Formas de ganar puntos</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div
                v-for="actividad in actividadesPuntos"
                :key="actividad.codigo"
                class="bg-white rounded-lg p-3 border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl">{{ actividad.icono }}</span>
                  <p class="text-xl font-bold text-blue-600">+{{ actividad.puntos }}</p>
                </div>
                <p class="text-xs text-blue-800">{{ actividad.nombre }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-teal-500 border-t-transparent mx-auto mb-4" />
        <p class="text-gray-600">Cargando catálogo de recompensas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las recompensas</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="cargarDatos"
          class="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <RefreshCw class="h-4 w-4 mr-2" />
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="recompensas.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Gift class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Catálogo en preparación</h3>
        <p class="text-gray-500">Tu empresa está preparando recompensas exclusivas para ti.</p>
        <p class="text-gray-400 text-sm mt-2">Vuelve pronto para ver las novedades.</p>
      </div>

      <!-- Catálogo de Recompensas -->
      <div v-else>
        <!-- Filtros rápidos -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            @click="filtroActivo = 'todas'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="filtroActivo === 'todas'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'"
          >
            Todas ({{ recompensas.length }})
          </button>
          <button
            @click="filtroActivo = 'disponibles'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="filtroActivo === 'disponibles'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'"
          >
            <CheckCircle class="w-4 h-4 inline mr-1" />
            Puedo canjear ({{ recompensasDisponibles.length }})
          </button>
          <button
            @click="filtroActivo = 'proximamente'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="filtroActivo === 'proximamente'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'"
          >
            <Target class="w-4 h-4 inline mr-1" />
            Casi lo logro
          </button>
        </div>

        <!-- Grid de recompensas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="recompensa in recompensasFiltradas"
            :key="recompensa.id"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
            :class="{ 'opacity-60': !recompensa.disponible }"
          >
            <!-- Header con icono -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center group-hover:from-teal-50 group-hover:to-emerald-50 transition-colors">
              <div class="text-5xl mb-3">{{ recompensa.icono }}</div>
              <h3 class="text-lg font-semibold text-gray-900">{{ recompensa.nombre }}</h3>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ recompensa.descripcion }}</p>
            </div>

            <!-- Contenido -->
            <div class="p-5">
              <!-- Coste en puntos -->
              <div class="text-center mb-4">
                <div class="inline-flex items-center bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                  <Star class="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
                  <span class="text-2xl font-bold text-amber-700">{{ recompensa.costo_puntos.toLocaleString() }}</span>
                  <span class="text-sm text-amber-600 ml-1">puntos</span>
                </div>
              </div>

              <!-- Info de categoría y stock -->
              <div class="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                <div class="flex items-center text-gray-500">
                  <Tag class="h-4 w-4 mr-2" />
                  <span class="capitalize">{{ recompensa.categoria }}</span>
                </div>
                <span
                  v-if="recompensa.stock > 0 && recompensa.stock < 10"
                  class="text-orange-600 font-medium"
                >
                  Solo {{ recompensa.stock }} disponibles
                </span>
                <span v-else-if="recompensa.stock === 0" class="text-red-600 font-medium">
                  Agotado
                </span>
              </div>

              <!-- Indicador de progreso -->
              <div v-if="!recompensa.puede_canjear && recompensa.disponible" class="mb-4">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-600">Tu progreso</span>
                  <span class="font-medium text-teal-600">{{ recompensa.progreso }}%</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                    :style="{ width: `${recompensa.progreso}%` }"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2 text-center">
                  Te faltan <strong class="text-gray-700">{{ recompensa.puntos_faltantes.toLocaleString() }}</strong> puntos
                </p>
              </div>

              <!-- Botón de canje -->
              <button
                @click="iniciarCanje(recompensa)"
                :disabled="!recompensa.puede_canjear || canjeandoId === recompensa.id"
                class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                :class="{
                  'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg': recompensa.puede_canjear,
                  'bg-gray-100 text-gray-400 cursor-not-allowed': !recompensa.puede_canjear
                }"
              >
                <template v-if="canjeandoId === recompensa.id">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </template>
                <template v-else-if="!recompensa.disponible">
                  <X class="h-4 w-4" />
                  No Disponible
                </template>
                <template v-else-if="!recompensa.puede_canjear">
                  <Lock class="h-4 w-4" />
                  Puntos insuficientes
                </template>
                <template v-else>
                  <ShoppingCart class="h-4 w-4" />
                  Canjear ahora
                </template>
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay resultados en el filtro -->
        <div
          v-if="recompensasFiltradas.length === 0"
          class="bg-white rounded-xl border border-gray-200 p-8 text-center"
        >
          <Gift class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">No hay recompensas en esta categoría</p>
          <button
            @click="filtroActivo = 'todas'"
            class="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Ver todas las recompensas
          </button>
        </div>
      </div>
    </template>

    <!-- Tab: Historial de Canjes -->
    <template v-if="tabActiva === 'historial'">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-900">Mis canjes</h3>
          <p class="text-sm text-gray-500">Historial de recompensas canjeadas</p>
        </div>

        <div v-if="historialCanjes.length === 0" class="p-8 text-center">
          <Gift class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">Aún no has canjeado ninguna recompensa</p>
          <button
            @click="tabActiva = 'catalogo'"
            class="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Ver catálogo
          </button>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="canje in historialCanjes"
            :key="canje.id"
            class="p-4 flex items-center gap-4 hover:bg-gray-50"
          >
            <div class="text-3xl">{{ canje.icono }}</div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ canje.recompensa }}</p>
              <p class="text-sm text-gray-500">{{ formatFecha(canje.fecha) }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-amber-600">-{{ canje.puntosGastados }} pts</p>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': canje.estado === 'pendiente',
                  'bg-blue-100 text-blue-800': canje.estado === 'procesado',
                  'bg-green-100 text-green-800': canje.estado === 'completado',
                  'bg-red-100 text-red-800': canje.estado === 'cancelado'
                }"
              >
                {{ canje.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Tab: Historial de Puntos -->
    <template v-if="tabActiva === 'puntos'">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-900">Historial de puntos</h3>
          <p class="text-sm text-gray-500">Todas tus transacciones de puntos</p>
        </div>

        <div v-if="historialPuntos.length === 0" class="p-8 text-center">
          <TrendingUp class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">Aún no tienes transacciones de puntos</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="transaccion in historialPuntos"
            :key="transaccion.id"
            class="p-4 flex items-center gap-4 hover:bg-gray-50"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="transaccion.esGanado ? 'bg-green-100' : 'bg-red-100'"
            >
              <TrendingUp v-if="transaccion.esGanado" class="w-5 h-5 text-green-600" />
              <TrendingDown v-else class="w-5 h-5 text-red-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ transaccion.motivo }}</p>
              <p class="text-sm text-gray-500">{{ formatFecha(transaccion.fecha) }}</p>
            </div>
            <div class="text-right">
              <p
                class="font-bold"
                :class="transaccion.esGanado ? 'text-green-600' : 'text-red-600'"
              >
                {{ transaccion.esGanado ? '+' : '' }}{{ transaccion.cantidad }} pts
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de confirmación de canje -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mostrarModalConfirmacion"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="mostrarModalConfirmacion"
              class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div class="bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white text-center">
                <div class="text-5xl mb-3">{{ recompensaSeleccionada?.icono }}</div>
                <h3 class="text-xl font-bold">Confirmar canje</h3>
              </div>
              <div class="p-6">
                <div class="text-center mb-6">
                  <p class="text-gray-900 font-semibold text-lg mb-2">
                    {{ recompensaSeleccionada?.nombre }}
                  </p>
                  <div class="inline-flex items-center bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                    <Star class="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
                    <span class="text-xl font-bold text-amber-700">
                      {{ recompensaSeleccionada?.costo_puntos.toLocaleString() }}
                    </span>
                    <span class="text-sm text-amber-600 ml-1">puntos</span>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Tu saldo actual</span>
                    <span class="font-medium">{{ puntosUsuario.toLocaleString() }} pts</span>
                  </div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Costo</span>
                    <span class="font-medium text-red-600">
                      -{{ recompensaSeleccionada?.costo_puntos.toLocaleString() }} pts
                    </span>
                  </div>
                  <div class="border-t pt-2 flex justify-between text-sm">
                    <span class="text-gray-600">Saldo después</span>
                    <span class="font-bold text-gray-900">
                      {{ (puntosUsuario - (recompensaSeleccionada?.costo_puntos || 0)).toLocaleString() }} pts
                    </span>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    @click="cerrarModal"
                    class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    :disabled="canjeandoId"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="confirmarCanje"
                    :disabled="canjeandoId"
                    class="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span v-if="canjeandoId" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{{ canjeandoId ? 'Procesando...' : 'Confirmar canje' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de canje exitoso -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mostrarModalExito"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div class="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white text-center">
              <CheckCircle class="w-16 h-16 mx-auto mb-4" />
              <h3 class="text-xl font-bold">¡Canje exitoso!</h3>
            </div>
            <div class="p-6 text-center">
              <p class="text-gray-700 mb-2">
                Has canjeado <strong>{{ recompensaCanjeada?.nombre }}</strong>
              </p>
              <p class="text-gray-500 text-sm mb-6">
                Recibirás un correo con los detalles de tu recompensa.
              </p>
              <div class="bg-amber-50 rounded-lg p-4 mb-6">
                <p class="text-sm text-amber-800">
                  Tu nuevo saldo: <strong>{{ puntosUsuario.toLocaleString() }} puntos</strong>
                </p>
              </div>
              <button
                @click="cerrarModalExito"
                class="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mensaje de privacidad -->
    <div class="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <Shield class="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 class="font-medium text-gray-900 text-sm">Tu privacidad</h4>
          <p class="text-xs text-gray-600 mt-1">
            Tus puntos y canjes son privados. Nadie más puede ver tu saldo ni historial de recompensas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  AlertCircle,
  RefreshCw,
  Gift,
  Tag,
  Star,
  X,
  Lock,
  ShoppingCart,
  HelpCircle,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Target
} from 'lucide-vue-next';
import { empleadoRecompensasService } from '@/services/empleado.recompensas.service';

// Estado
const loading = ref(true);
const error = ref(null);
const tabActiva = ref('catalogo');
const filtroActivo = ref('todas');

// Datos
const puntosUsuario = ref(0);
const actividadesPuntos = ref([]);
const recompensas = ref([]);
const historialCanjes = ref([]);
const historialPuntos = ref([]);

// Estado del canje
const canjeandoId = ref(null);
const mostrarModalConfirmacion = ref(false);
const mostrarModalExito = ref(false);
const recompensaSeleccionada = ref(null);
const recompensaCanjeada = ref(null);

// Computed
const recompensasDisponibles = computed(() =>
  recompensas.value.filter(r => r.puede_canjear)
);

const recompensasFiltradas = computed(() => {
  if (filtroActivo.value === 'todas') {
    return recompensas.value;
  } else if (filtroActivo.value === 'disponibles') {
    return recompensas.value.filter(r => r.puede_canjear);
  } else if (filtroActivo.value === 'proximamente') {
    return recompensas.value.filter(r =>
      r.disponible && r.progreso >= 50 && r.progreso < 100
    );
  }
  return recompensas.value;
});

// Funciones
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Intentar usar la función RPC completa
    const datos = await empleadoRecompensasService.getDatosCompletos();
    puntosUsuario.value = datos.puntos;
    actividadesPuntos.value = datos.actividades;
    recompensas.value = datos.recompensas;
    historialCanjes.value = datos.historialCanjes;
    historialPuntos.value = datos.historialPuntos;
  } catch (err) {
    console.warn('RPC no disponible, usando fallback:', err);
    // Fallback: cargar datos individualmente
    try {
      const [puntos, actividades, catalogo, canjes, puntosList] = await Promise.all([
        empleadoRecompensasService.getPuntos(),
        empleadoRecompensasService.getActividadesPuntos(),
        empleadoRecompensasService.getCatalogoRecompensas(),
        empleadoRecompensasService.getHistorialCanjes(),
        empleadoRecompensasService.getHistorialPuntos()
      ]);

      puntosUsuario.value = puntos;
      actividadesPuntos.value = actividades;
      recompensas.value = catalogo;
      historialCanjes.value = canjes;
      historialPuntos.value = puntosList;
    } catch (fallbackErr) {
      console.error('Error cargando datos:', fallbackErr);
      error.value = 'No se pudieron cargar los datos. Inténtalo de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

const iniciarCanje = (recompensa) => {
  recompensaSeleccionada.value = recompensa;
  mostrarModalConfirmacion.value = true;
};

const cerrarModal = () => {
  mostrarModalConfirmacion.value = false;
  recompensaSeleccionada.value = null;
};

const confirmarCanje = async () => {
  if (!recompensaSeleccionada.value || canjeandoId.value) return;

  canjeandoId.value = recompensaSeleccionada.value.id;

  try {
    // Intentar RPC primero, luego fallback
    let resultado;
    try {
      resultado = await empleadoRecompensasService.canjearRecompensa(recompensaSeleccionada.value.id);
    } catch {
      resultado = await empleadoRecompensasService.canjearRecompensaFallback(recompensaSeleccionada.value.id);
    }

    if (resultado.success) {
      // Actualizar puntos
      puntosUsuario.value = resultado.puntosRestantes;

      // Guardar recompensa canjeada
      recompensaCanjeada.value = recompensaSeleccionada.value;

      // Cerrar modal de confirmación y abrir el de éxito
      mostrarModalConfirmacion.value = false;
      mostrarModalExito.value = true;

      // Recargar datos para actualizar el catálogo
      await cargarDatos();
    }
  } catch (err) {
    console.error('Error al canjear:', err);
    alert(err.message || 'Error al procesar el canje. Inténtalo de nuevo.');
  } finally {
    canjeandoId.value = null;
    recompensaSeleccionada.value = null;
  }
};

const cerrarModalExito = () => {
  mostrarModalExito.value = false;
  recompensaCanjeada.value = null;
};

const formatFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Inicializar
onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
