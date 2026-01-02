<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
      <p class="text-gray-600 font-medium">Cargando analítica ejecutiva...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-md mx-auto py-12">
      <div class="bg-white border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="h-8 w-8 text-red-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Error al cargar analítica</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <!-- Detalle técnico colapsable -->
        <details v-if="errorDetails" class="text-left mb-4">
          <summary class="text-sm text-gray-500 cursor-pointer hover:text-gray-700">Ver detalle técnico</summary>
          <pre class="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">{{ errorDetails }}</pre>
        </details>
        <button
          @click="cargarDatos"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="sinDatos" class="max-w-lg mx-auto py-12">
      <div class="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg">
        <div class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 class="h-10 w-10 text-indigo-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Sin datos de analítica</h3>
        <p class="text-gray-600 mb-6">
          Para ver la analítica ejecutiva, primero necesitas tener empleados registrados y encuestas con respuestas.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/admin/empleados"
            class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Gestionar empleados
          </router-link>
          <router-link
            to="/admin/encuestas"
            class="px-5 py-2.5 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Crear encuesta
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Analítica Ejecutiva Consolidada</h1>
          <p class="text-gray-600 mt-2">Resumen general de bienestar y participación organizacional</p>
          <!-- Indicador de fuente de datos (solo mostrar si es fallback) -->
          <div v-if="analitica._source === 'fallback'" class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              <AlertTriangle class="h-3 w-3 mr-1" />
              Modo fallback - datos estimados
            </span>
            <span v-if="analitica._generated_at" class="text-xs text-gray-500">
              {{ formatDate(analitica._generated_at) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Botón Debug (solo en desarrollo) -->
          <button
            v-if="isDev"
            @click="toggleDebug"
            class="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Bug class="h-4 w-4" />
            Debug
          </button>
          <button
            @click="abrirPresentacion"
            class="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Monitor class="h-5 w-5" />
            Modo Presentación
          </button>
        </div>
      </div>

      <!-- Panel Debug (colapsable) -->
      <div v-if="showDebug && debugData" class="mb-6 bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white font-bold">Debug: Verificación de Datos</span>
          <button @click="cargarDebug" class="text-xs bg-green-600 text-white px-3 py-1 rounded">Refresh</button>
        </div>
        <pre class="overflow-auto max-h-64">{{ JSON.stringify(debugData, null, 2) }}</pre>
      </div>

      <!-- Grid KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Índice Global de Bienestar -->
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-emerald-200 relative group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <Heart class="h-6 w-6 text-white" />
            </div>
            <div :class="[estadoGlobal.border, 'px-3 py-1 rounded-full border-2 bg-white shadow-sm']">
              <span class="text-xs font-semibold text-emerald-700">{{ estadoGlobal.label }}</span>
            </div>
          </div>
          <p class="text-sm font-semibold text-emerald-700 mb-1 flex items-center gap-1">
            Índice Global de Bienestar
            <HelpCircle class="h-3.5 w-3.5 text-emerald-400 cursor-help" />
          </p>
          <p class="text-4xl font-bold text-emerald-900">
            <template v-if="analitica.bienestar_global !== null">
              {{ analitica.bienestar_global.toFixed(1) }}
            </template>
            <span v-else class="text-gray-400 text-2xl">--</span>
          </p>
          <p class="text-xs text-emerald-600 mt-1">de 5.0</p>
          <!-- Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
            <strong>Cómo se calcula:</strong> Promedio de todas las respuestas numéricas (1-5) de encuestas en los últimos 90 días.
          </div>
        </div>

        <!-- Variación Trimestral -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-200 relative group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp class="h-6 w-6 text-white" />
            </div>
            <component
              :is="(analitica.variacion_trimestral || 0) > 0 ? TrendingUp : (analitica.variacion_trimestral || 0) < 0 ? TrendingDown : Minus"
              :class="(analitica.variacion_trimestral || 0) > 0 ? 'text-emerald-600' : (analitica.variacion_trimestral || 0) < 0 ? 'text-red-600' : 'text-gray-600'"
              class="h-6 w-6"
            />
          </div>
          <p class="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
            Variación Trimestral
            <HelpCircle class="h-3.5 w-3.5 text-blue-400 cursor-help" />
          </p>
          <p class="text-4xl font-bold text-blue-900">
            <template v-if="analitica.variacion_trimestral !== null">
              {{ (analitica.variacion_trimestral || 0) > 0 ? '+' : '' }}{{ (analitica.variacion_trimestral || 0).toFixed(1) }}
            </template>
            <span v-else class="text-gray-400 text-2xl">--</span>
          </p>
          <p class="text-xs text-blue-600 mt-1">vs. período anterior</p>
          <!-- Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
            <strong>Cómo se calcula:</strong> Diferencia entre el índice de bienestar actual y el del período anterior (90 días).
          </div>
        </div>

        <!-- Participación Global -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 relative group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Users class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-1">
            Participación Global
            <HelpCircle class="h-3.5 w-3.5 text-purple-400 cursor-help" />
          </p>
          <p class="text-4xl font-bold text-purple-900">
            <template v-if="analitica.participacion_global !== null">
              {{ analitica.participacion_global }}%
            </template>
            <span v-else class="text-gray-400 text-2xl">--</span>
          </p>
          <div class="mt-3 w-full bg-purple-200 rounded-full h-2.5 shadow-inner">
            <div
              class="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              :style="{ width: `${analitica.participacion_global || 0}%` }"
            ></div>
          </div>
          <!-- Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
            <strong>Cómo se calcula:</strong> (Empleados con actividad / Total empleados) x 100. Actividad = respuesta a encuesta o lectura de comunicado.
          </div>
        </div>

        <!-- Alertas Activas -->
        <div :class="analitica.alertas_activas === 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'" class="rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 relative group">
          <div class="flex items-center justify-between mb-4">
            <div :class="analitica.alertas_activas === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'" class="w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
              <AlertTriangle class="h-6 w-6 text-white" />
            </div>
            <span v-if="analitica.alertas_activas > 0" class="flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
            </span>
            <span v-else class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <CheckCircle class="h-5 w-5 text-green-600" />
            </span>
          </div>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-700' : 'text-amber-700'" class="text-sm font-semibold mb-1 flex items-center gap-1">
            Alertas Activas
            <HelpCircle class="h-3.5 w-3.5 opacity-50 cursor-help" />
          </p>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-900' : 'text-amber-900'" class="text-4xl font-bold">
            {{ analitica.alertas_activas }}
          </p>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-600' : 'text-amber-600'" class="text-xs mt-1 font-medium">{{ analitica.alertas_activas === 0 ? 'Sin alertas' : 'Requieren atención' }}</p>
          <!-- Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
            <strong>Cómo se calcula:</strong> Número de departamentos con índice de bienestar menor a 3.0/5.0.
          </div>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-5 border-2 border-orange-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-orange-700 mb-1">Encuestas Activas</p>
              <p class="text-3xl font-bold text-orange-900">{{ analitica.encuestas_activas }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
              <FileText class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-lg p-5 border-2 border-cyan-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-cyan-700 mb-1">Encuestas Cerradas</p>
              <p class="text-3xl font-bold text-cyan-900">{{ analitica.encuestas_completadas }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-5 border-2 border-slate-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-700 mb-1">Empleados Activos</p>
              <p class="text-3xl font-bold text-slate-900">{{ analitica.empleados_totales }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
              <Building2 class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Departamentos Fuertes y Críticos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top 3 Áreas Fuertes -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-emerald-200">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                <Award class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-white">Top Áreas Fuertes</h2>
                <p class="text-sm text-emerald-50">Departamentos con mejor clima laboral</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
            <div
              v-for="(dept, index) in analitica.departamentos_fuertes"
              :key="dept.nombre"
              class="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all border-2 border-emerald-100 hover:border-emerald-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-emerald-700 font-medium">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-emerald-700">{{ (dept.promedio || 0).toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingUp v-if="dept.tendencia === 'up'" class="h-4 w-4 text-emerald-600 mr-1" />
                    <Minus v-else class="h-4 w-4 text-gray-400 mr-1" />
                    <span class="text-xs text-emerald-600 font-medium">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Empty state -->
            <div v-if="analitica.departamentos_fuertes.length === 0" class="text-center py-6 text-gray-500">
              <BarChart3 class="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p class="text-sm">Sin datos suficientes</p>
            </div>
          </div>
        </div>

        <!-- Top Áreas Críticas -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200">
          <div class="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                <AlertCircle class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-white">Áreas Críticas</h2>
                <p class="text-sm text-amber-50">Departamentos que requieren atención</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <div
              v-for="dept in analitica.departamentos_criticos"
              :key="dept.nombre"
              class="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all border-2 border-amber-100 hover:border-amber-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    !
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-amber-700 font-medium">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-amber-700">{{ (dept.promedio || 0).toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingDown class="h-4 w-4 text-amber-600 mr-1" />
                    <span class="text-xs text-amber-600 font-medium">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay áreas críticas -->
            <div v-if="analitica.departamentos_criticos.length === 0" class="text-center py-8 bg-white rounded-lg border-2 border-green-200">
              <CheckCircle class="h-16 w-16 text-green-600 mx-auto mb-3" />
              <p class="text-sm font-semibold text-green-700">Sin departamentos en estado crítico</p>
              <p class="text-xs text-green-600 mt-1">Todos los equipos están funcionando bien</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Evolución -->
      <div class="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-blue-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <LineChart class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Evolución del Bienestar Global</h2>
            <p class="text-sm text-blue-600 font-medium">Últimos 6 meses</p>
          </div>
        </div>

        <!-- Gráfico Simple con Barras -->
        <div v-if="evolucion.length > 0" class="space-y-3">
          <div
            v-for="dato in evolucion"
            :key="dato.mes"
            class="flex items-center gap-4"
          >
            <div class="w-24 flex-shrink-0">
              <p class="text-sm font-bold text-gray-700">{{ dato.mes }}</p>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div class="flex-1 relative">
                  <div class="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-10 relative overflow-hidden shadow-inner">
                    <div
                      class="h-10 rounded-full transition-all duration-700 flex items-center justify-end pr-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-md"
                      :style="{ width: `${((dato.valor || 0) / 5) * 100}%` }"
                    >
                      <span class="text-white font-bold text-sm">{{ (dato.valor || 0).toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-24 text-right">
                  <p class="text-xs font-semibold text-blue-600">{{ dato.participacion }} personas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12 text-gray-500">
          <LineChart class="h-16 w-16 mx-auto mb-3 opacity-30" />
          <p class="font-medium">Sin datos de evolución</p>
          <p class="text-sm mt-1">Se mostrarán cuando haya respuestas a encuestas</p>
        </div>
      </div>

      <!-- Categorías de Bienestar -->
      <div class="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-purple-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <BarChart3 class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Categorías de Bienestar</h2>
            <p class="text-sm text-purple-600 font-medium">Desglose por dimensión</p>
          </div>
        </div>

        <div v-if="categorias.length > 0" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            v-for="(cat, index) in categorias"
            :key="cat.categoria"
            :class="getCategoryStyle(index)"
            class="rounded-lg p-4 border-2 hover:shadow-md transition-all"
          >
            <p class="text-xs font-bold mb-2" :class="getCategoryTextColor(index)">{{ cat.categoria }}</p>
            <p class="text-3xl font-bold mb-1" :class="getCategoryValueColor(index)">
              {{ cat.valor ? cat.valor.toFixed(1) : '--' }}
            </p>
            <div v-if="cat.variacion !== null && cat.variacion !== 0" class="flex items-center">
              <component
                :is="cat.variacion > 0 ? TrendingUp : cat.variacion < 0 ? TrendingDown : Minus"
                :class="cat.variacion > 0 ? 'text-emerald-600' : cat.variacion < 0 ? 'text-red-600' : 'text-gray-400'"
                class="h-4 w-4 mr-1"
              />
              <span class="text-sm font-bold" :class="[
                cat.variacion > 0 ? 'text-emerald-600' : '',
                cat.variacion < 0 ? 'text-red-600' : '',
                cat.variacion === 0 ? 'text-gray-600' : ''
              ]">
                {{ cat.variacion > 0 ? '+' : '' }}{{ cat.variacion.toFixed(1) }}
              </span>
            </div>
            <div v-else class="text-xs text-gray-400">Sin variación</div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12 text-gray-500">
          <BarChart3 class="h-16 w-16 mx-auto mb-3 opacity-30" />
          <p class="font-medium">Sin datos de categorías</p>
          <p class="text-sm mt-1">Se mostrarán cuando las preguntas tengan categorías asignadas</p>
        </div>
      </div>

      <!-- Resumen Ejecutivo -->
      <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 shadow-lg border-l-4 border-slate-700">
        <div class="flex items-start">
          <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
            <Info class="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Resumen Ejecutivo</h3>
            <p class="text-slate-700 text-sm leading-relaxed italic font-medium">
              {{ resumenEjecutivo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { analiticaService } from '@/services/analitica.service';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle,
  Building2,
  Award,
  AlertCircle,
  LineChart,
  BarChart3,
  Info,
  Monitor,
  HelpCircle,
  Bug
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// Estado
const analitica = ref({
  bienestar_global: null,
  variacion_trimestral: null,
  participacion_global: null,
  alertas_activas: 0,
  encuestas_activas: 0,
  encuestas_completadas: 0,
  empleados_totales: 0,
  departamentos_fuertes: [],
  departamentos_criticos: [],
  _source: null
});
const evolucion = ref([]);
const categorias = ref([]);
const loading = ref(true);
const error = ref(null);
const errorDetails = ref(null);
const showDebug = ref(false);
const debugData = ref(null);

// Detectar modo desarrollo
const isDev = import.meta.env.DEV;

// Computed
const sinDatos = computed(() => {
  return analitica.value.empleados_totales === 0 &&
         analitica.value.encuestas_activas === 0 &&
         analitica.value.encuestas_completadas === 0 &&
         analitica.value.bienestar_global === null;
});

const estadoGlobal = computed(() => {
  const valor = analitica.value.bienestar_global;
  if (valor === null) return { label: 'Sin datos', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
  if (valor >= 4.0) return { label: 'Excelente', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
  if (valor >= 3.5) return { label: 'Bueno', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  if (valor >= 3.0) return { label: 'Regular', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  return { label: 'Crítico', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
});

const resumenEjecutivo = computed(() => {
  const valor = analitica.value.bienestar_global;
  const participacion = analitica.value.participacion_global;

  if (valor === null || participacion === null) {
    return 'No hay suficientes datos para generar un resumen ejecutivo. Complete encuestas para obtener métricas de bienestar.';
  }

  if (valor >= 4.0 && participacion >= 80) {
    return 'La organización presenta indicadores excelentes de bienestar con alta participación. Se recomienda mantener las prácticas actuales y continuar monitoreando.';
  } else if (valor >= 3.5) {
    return 'Los indicadores de bienestar son buenos. Existen oportunidades de mejora en áreas específicas que pueden potenciar aún más el clima laboral.';
  } else if (valor >= 3.0) {
    return 'Se identifican áreas de mejora importantes. Se recomienda implementar acciones correctivas en los departamentos con menor desempeño.';
  } else {
    return 'Los indicadores requieren atención inmediata. Es fundamental desarrollar un plan de acción integral para mejorar el bienestar organizacional.';
  }
});

// Estilos por categoría
const getCategoryStyle = (index) => {
  const styles = [
    'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300',
    'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-300',
    'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300',
    'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300',
    'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'
  ];
  return styles[index % styles.length];
};

const getCategoryTextColor = (index) => {
  const colors = ['text-rose-700', 'text-violet-700', 'text-emerald-700', 'text-amber-700', 'text-blue-700'];
  return colors[index % colors.length];
};

const getCategoryValueColor = (index) => {
  const colors = ['text-rose-900', 'text-violet-900', 'text-emerald-900', 'text-amber-900', 'text-blue-900'];
  return colors[index % colors.length];
};

// Formatear fecha
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

// Cargar datos
onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  errorDetails.value = null;

  try {
    const [analiticaData, evolucionData, categoriasData] = await Promise.all([
      analiticaService.getAnalytics(authStore.empresaId),
      analiticaService.getEvolution(authStore.empresaId),
      analiticaService.getCategorias(authStore.empresaId)
    ]);

    analitica.value = analiticaData;
    evolucion.value = evolucionData;
    categorias.value = categoriasData;

    console.log('[AnaliticaEjecutiva] Datos cargados:', {
      source: analiticaData._source,
      empleados: analiticaData.empleados_totales,
      bienestar: analiticaData.bienestar_global
    });

  } catch (err) {
    console.error('Error cargando analítica:', err);
    error.value = err.message || 'No se pudieron cargar los datos';
    errorDetails.value = JSON.stringify(err, null, 2);
  } finally {
    loading.value = false;
  }
};

// Debug
const toggleDebug = async () => {
  showDebug.value = !showDebug.value;
  if (showDebug.value && !debugData.value) {
    await cargarDebug();
  }
};

const cargarDebug = async () => {
  try {
    debugData.value = await analiticaService.verificarConsistencia();
  } catch (err) {
    debugData.value = { error: err.message };
  }
};

// Métodos
const abrirPresentacion = () => {
  router.push('/admin/presentacion');
};
</script>
