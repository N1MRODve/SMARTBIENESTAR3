<script setup>
import { ref, reactive } from 'vue';
import {
  Heart,
  Calendar,
  User,
  Building2,
  Target,
  Send,
  Check,
  CheckCircle,
  Mail,
  Phone,
  Star,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Briefcase,
  ExternalLink,
  MessageSquare
} from 'lucide-vue-next';

const loading = ref(false);
const showSuccess = ref(false);
const aceptaPrivacidad = ref(false);

const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  cargo: '',
  empresa: '',
  tamano: '',
  sector: '',
  intereses: [],
  mensaje: ''
});

const intereses = [
  { value: 'encuestas', label: 'Encuestas de bienestar', icon: MessageSquare },
  { value: 'comunicados', label: 'Comunicación interna', icon: Mail },
  { value: 'recompensas', label: 'Sistema de recompensas', icon: Star },
  { value: 'analitica', label: 'Analítica y reportes', icon: BarChart3 },
  { value: 'servicios', label: 'Catálogo de servicios', icon: Heart },
  { value: 'integraciones', label: 'Integraciones', icon: Target }
];

const submitDemo = async () => {
  loading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Demo request:', form);
    showSuccess.value = true;

    Object.assign(form, {
      nombre: '',
      email: '',
      telefono: '',
      cargo: '',
      empresa: '',
      tamano: '',
      sector: '',
      intereses: [],
      mensaje: ''
    });
    aceptaPrivacidad.value = false;

  } catch (error) {
    console.error('Error al enviar solicitud:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- Panel izquierdo: Branding -->
    <div class="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white flex-col justify-between p-10 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <!-- Logo -->
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-12">
          <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span class="text-xl font-bold tracking-tight">SMART Bienestar</span>
          </router-link>
        </div>

        <h1 class="inline-block bg-black text-white text-3xl lg:text-4xl font-bold leading-tight mb-5 px-4 py-2 rounded-lg">
          Descubre el potencial<br>de tu equipo
        </h1>
        <p class="text-indigo-100 text-base leading-relaxed max-w-md">
          Solicita una demo personalizada y te mostraremos cómo SMART Bienestar transforma la cultura de bienestar en tu empresa.
        </p>
      </div>

      <!-- Features -->
      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Calendar class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Demo personalizada de 30 minutos</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Shield class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Sin compromiso · 100% gratuita</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <BarChart3 class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Propuesta adaptada a tu sector y tamaño</span>
        </div>
      </div>

      <!-- Testimonial -->
      <div class="relative z-10">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <div class="flex items-center gap-1 mb-3">
            <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          </div>
          <p class="text-sm text-indigo-50 italic leading-relaxed mb-3">
            "SMART Bienestar nos ayudó a entender cómo se sienten nuestros colaboradores y a tomar acciones concretas."
          </p>
          <p class="text-xs text-indigo-200">— Director de RRHH, empresa tecnológica</p>
        </div>

        <p class="mt-6 text-xs text-indigo-200/60">
          © {{ new Date().getFullYear() }} SMART Bienestar · smartbienestar.es
        </p>
      </div>
    </div>

    <!-- Panel derecho: Formulario -->
    <div class="flex-1 flex flex-col bg-gray-50/80 overflow-y-auto">

      <!-- Barra superior móvil -->
      <div class="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-base font-bold text-gray-900">SMART Bienestar</span>
        </router-link>
        <router-link to="/login" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Iniciar sesión
        </router-link>
      </div>

      <div class="flex-1 flex items-start justify-center p-6 sm:p-8 lg:p-12 lg:pt-8">
        <div class="w-full max-w-xl">

          <!-- Header -->
          <div class="mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-4">
              <Calendar class="w-3.5 h-3.5" />
              Demostración personalizada
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Solicitar una Demo</h1>
            <p class="text-gray-500 text-sm">Completa el formulario y te contactaremos en menos de 24h</p>
          </div>

          <form @submit.prevent="submitDemo" class="space-y-5">

            <!-- Datos de contacto -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User class="w-4 h-4 text-indigo-600" />
                Datos de contacto
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre completo <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      v-model="form.nombre"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Email corporativo <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="tu@empresa.com"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Teléfono <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      v-model="form.telefono"
                      type="tel"
                      required
                      placeholder="+34 612 345 678"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
                  <div class="relative">
                    <Briefcase class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      v-model="form.cargo"
                      type="text"
                      placeholder="Ej: Director de RRHH"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Datos de empresa -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 class="w-4 h-4 text-indigo-600" />
                Datos de la empresa
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre de la empresa <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <Building2 class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      v-model="form.empresa"
                      type="text"
                      required
                      placeholder="Nombre de tu empresa"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nº de colaboradores <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <Users class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      v-model="form.tamano"
                      required
                      class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none appearance-none"
                    >
                      <option value="">Selecciona un rango</option>
                      <option value="20-50">20 - 50</option>
                      <option value="51-100">51 - 100</option>
                      <option value="101-200">101 - 200</option>
                      <option value="201-500">201 - 500</option>
                      <option value="501+">Más de 500</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Sector</label>
                <select
                  v-model="form.sector"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none appearance-none"
                >
                  <option value="">Selecciona un sector</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="salud">Salud</option>
                  <option value="educacion">Educación</option>
                  <option value="finanzas">Finanzas y Banca</option>
                  <option value="retail">Retail y Comercio</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="servicios">Servicios profesionales</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <!-- Intereses -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Target class="w-4 h-4 text-indigo-600" />
                ¿Qué te interesa conocer?
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  v-for="interes in intereses"
                  :key="interes.value"
                  class="flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                  :class="form.intereses.includes(interes.value) ? 'border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-400/20' : 'border-gray-200'"
                >
                  <input
                    type="checkbox"
                    :value="interes.value"
                    v-model="form.intereses"
                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <component :is="interes.icon" class="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span class="text-sm text-gray-700">{{ interes.label }}</span>
                </label>
              </div>
            </div>

            <!-- Mensaje -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Cuéntanos más sobre tus necesidades
              </label>
              <textarea
                v-model="form.mensaje"
                rows="3"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none resize-none"
                placeholder="¿Qué retos de bienestar laboral enfrentas actualmente?"
              ></textarea>
            </div>

            <!-- Consentimiento RGPD -->
            <div class="pt-3 border-t border-gray-200 space-y-3">
              <div class="flex items-start gap-3">
                <input
                  id="aceptaPrivacidad"
                  v-model="aceptaPrivacidad"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="aceptaPrivacidad" class="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  He leído y acepto la
                  <router-link to="/politica-privacidad" target="_blank" class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5">
                    Política de Privacidad
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  y consiento el tratamiento de mis datos para gestionar mi solicitud de demostración.
                  <span class="text-red-400">*</span>
                </label>
              </div>

              <p class="text-[11px] text-gray-400 leading-relaxed pl-7">
                Responsable: DIANI ANDREÍNA ELÍAS OCHOA (S.M.A.R.T BIENESTAR) · NIF: 51.034.346-Z · Finalidad: gestionar tu solicitud de demo y contactarte · Base legal: consentimiento del interesado · Derechos: acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a
                <a href="mailto:privacidad@smartbienestar.es" class="text-indigo-600 hover:text-indigo-800 underline">privacidad@smartbienestar.es</a>.
              </p>
            </div>

            <!-- Botón submit -->
            <button
              type="submit"
              :disabled="loading || !aceptaPrivacidad"
              class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <template v-if="loading">Enviando solicitud...</template>
              <template v-else>
                Solicitar Demo Gratuita
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>

            <!-- Links -->
            <div class="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
              <router-link to="/login" class="hover:text-indigo-600 transition-colors">¿Ya tienes cuenta? Inicia sesión</router-link>
              <span>·</span>
              <router-link to="/register" class="hover:text-indigo-600 transition-colors">Registra tu empresa</router-link>
            </div>

          </form>
        </div>
      </div>

      <!-- Footer móvil -->
      <div class="lg:hidden p-4 text-center text-xs text-gray-400 border-t border-gray-100">
        © {{ new Date().getFullYear() }} SMART Bienestar · smartbienestar.es
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div
        v-if="showSuccess"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showSuccess = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="w-10 h-10 text-emerald-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            ¡Solicitud enviada!
          </h3>
          <p class="text-gray-500 mb-6 text-sm leading-relaxed">
            Gracias por tu interés en SMART Bienestar. Nuestro equipo se pondrá en contacto contigo
            en las próximas 24 horas hábiles para agendar tu demostración personalizada.
          </p>
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <ArrowLeft class="w-4 h-4" />
            Volver al inicio
          </router-link>
        </div>
      </div>
    </Teleport>
  </div>
</template>
