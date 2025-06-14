// src/views/auth/AdminLogin.vue
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-primary rounded-xl flex items-center justify-center mb-6">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">SMART Bienestar</h2>
        <p class="mt-2 text-lg text-gray-600">Panel Empresarial</p>
        <p class="mt-1 text-sm text-gray-500">Acceso para administradores de empresa</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
        <!-- Formulario de Login -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="form-label">
              Correo electrónico empresarial
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                class="input"
                placeholder="admin@miempresa.com"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="password" class="form-label">
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="form.password"
                class="input pr-10"
                placeholder="••••••••"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l.907-2.321m0 0a9.971 9.971 0 015.855-.908m-5.855.908C7.72 7.42 8.877 7.5 12 7.5c.34 0 .677.018 1.01.055M15.121 14.121L16.535 15.535M15.121 14.121l2.321.907m-2.321-.907C16.28 16.58 15.123 16.5 12 16.5c-.34 0-.677-.018-1.01-.055"/>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Recordarme -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="form.remember"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary-dark">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="notification notification-error">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Botón de Login -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn btn-primary flex justify-center py-3"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                ¿Necesitas ayuda?
              </span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Si tu empresa no tiene acceso a SMART Bienestar o necesitas soporte,
            </p>
            <a href="mailto:soporte@smartbienestar.com" class="text-primary hover:text-primary-dark font-medium">
              contacta a nuestro equipo
            </a>
          </div>
        </div>

        <!-- Información de demo -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200" v-if="isDemoMode">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Datos de prueba
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p><strong>Email:</strong> admin@innovatech.com</p>
                <p><strong>Contraseña:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      email: '',
      password: '',
      remember: false
    })
    
    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref('')

    // Modo demo para desarrollo
    const isDemoMode = computed(() => {
      return process.env.NODE_ENV === 'development' || window.location.hostname.includes('localhost')
    })

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''

        // Validaciones básicas
        if (!form.value.email || !form.value.password) {
          error.value = 'Por favor, completa todos los campos'
          return
        }

        // Verificar que el email tenga formato válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.value.email)) {
          error.value = 'Por favor, ingresa un email válido'
          return
        }

        // Intentar login
        const result = await authStore.loginAdmin({
          email: form.value.email,
          password: form.value.password,
          remember: form.value.remember
        })

        if (result.success) {
          // Verificar que el usuario sea administrador
          if (result.user.tipo_usuario !== 'administrador') {
            error.value = 'Este acceso es solo para administradores de empresa'
            await authStore.logout()
            return
          }

          // Guardar preferencia de recordar
          if (form.value.remember) {
            localStorage.setItem('admin_remember', 'true')
            localStorage.setItem('admin_email', form.value.email)
          } else {
            localStorage.removeItem('admin_remember')
            localStorage.removeItem('admin_email')
          }

          // Redireccionar al dashboard
          router.push('/admin')
        } else {
          error.value = result.error || 'Credenciales incorrectas'
        }

      } catch (err) {
        console.error('Error en login:', err)
        error.value = err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.'
      } finally {
        loading.value = false
      }
    }

    // Cargar datos recordados al inicializar
    const loadRememberedData = () => {
      const remembered = localStorage.getItem('admin_remember')
      const savedEmail = localStorage.getItem('admin_email')
      
      if (remembered === 'true' && savedEmail) {
        form.value.email = savedEmail
        form.value.remember = true
      }
    }

    // Inicializar
    loadRememberedData()

    return {
      form,
      showPassword,
      loading,
      error,
      isDemoMode,
      handleLogin
    }
  }
}
</script>