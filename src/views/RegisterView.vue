<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import Button from '@/components/ui/Button.vue';
import { supabase } from '@/lib/supabase.js';

const router = useRouter();
const authStore = useAuthStore();

// Datos de la empresa
const razonSocial = ref('');
const ruc = ref('');
const telefono = ref('');
const direccion = ref('');
const pais = ref('');
const ciudad = ref('');
const industria = ref('');
const numEmpleados = ref('');
const sitioWeb = ref('');

// Datos del administrador
const adminNombre = ref('');
const adminEmail = ref('');
const adminPassword = ref('');
const adminPasswordConfirm = ref('');

// UI
const errorMsg = ref('');
const loading = ref(false);
const currentStep = ref(1);

// Validaciones
const passwordsMatch = computed(() => {
  return adminPassword.value === adminPasswordConfirm.value;
});

const isValidCorporateEmail = computed(() => {
  if (!adminEmail.value) return true;
  const domain = adminEmail.value.split('@')[1]?.toLowerCase();
  const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
  return domain && !publicDomains.includes(domain);
});

const emailDomain = computed(() => {
  if (!adminEmail.value) return '';
  return adminEmail.value.split('@')[1]?.toLowerCase() || '';
});

const canProceedStep1 = computed(() => {
  return razonSocial.value &&
         adminEmail.value &&
         isValidCorporateEmail.value;
});

const canProceedStep2 = computed(() => {
  return adminNombre.value &&
         adminPassword.value &&
         adminPasswordConfirm.value &&
         passwordsMatch.value;
});

const nextStep = () => {
  if (currentStep.value === 1 && canProceedStep1.value) {
    currentStep.value = 2;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleRegister = async () => {
  errorMsg.value = '';

  if (!canProceedStep2.value) {
    errorMsg.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  loading.value = true;

  try {
    // 1. Verificar si ya existe una empresa con este dominio
    const { data: empresaExistente, error: checkError } = await supabase
      .from('empresas')
      .select('id')
      .eq('dominio', emailDomain.value)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (empresaExistente) {
      throw new Error('Ya existe una empresa con este dominio. Un compañero de tu empresa debe invitarte.');
    }

    // 2. Crear empresa PRIMERO (antes del usuario)
    const { data: empresaData, error: empresaError } = await supabase.rpc('crear_empresa_completa', {
      p_email: adminEmail.value,
      p_razon_social: razonSocial.value,
      p_dominio: emailDomain.value,
      p_ruc: ruc.value || null,
      p_telefono: telefono.value || null,
      p_direccion: direccion.value || null,
      p_pais: pais.value || null,
      p_ciudad: ciudad.value || null,
      p_industria: industria.value || null,
      p_num_empleados: numEmpleados.value ? parseInt(numEmpleados.value) : null,
      p_sitio_web: sitioWeb.value || null,
      p_admin_user_id: null
    });

    if (empresaError) throw empresaError;

    // 3. Ahora crear el usuario (sin trigger automático)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail.value,
      password: adminPassword.value,
      options: {
        data: {
          nombre: adminNombre.value,
          es_admin: true
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario');
    }

    // 4. Actualizar empresa con admin_user_id
    const { error: updateEmpresaError } = await supabase
      .from('empresas')
      .update({ admin_user_id: authData.user.id })
      .eq('dominio', emailDomain.value);

    if (updateEmpresaError) {
      console.warn('No se pudo actualizar admin_user_id:', updateEmpresaError);
    }

    // 5. Obtener departamento RRHH o el primero disponible
    const { data: departamentos } = await supabase
      .from('departamentos')
      .select('id')
      .eq('empresa_id', empresaData)
      .order('nombre')
      .limit(1);

    const departamentoId = departamentos && departamentos.length > 0 ? departamentos[0].id : null;

    // 6. Crear empleado manualmente
    const { error: empleadoError } = await supabase
      .from('empleados')
      .insert({
        auth_user_id: authData.user.id,
        empresa_id: empresaData,
        nombre: adminNombre.value,
        email: adminEmail.value,
        departamento_id: departamentoId,
        cargo: 'Administrador',
        es_admin: true,
        estado: 'Activo',
        puntos: 0
      });

    if (empleadoError) {
      console.error('Error al crear empleado:', empleadoError);
      throw new Error('No se pudo crear el perfil de empleado');
    }

    // 7. Iniciar sesión automáticamente
    await authStore.login(adminEmail.value, adminPassword.value);

    // 8. Redirigir al dashboard de admin
    router.push('/admin/dashboard');

  } catch (error) {
    console.error('Error en el registro:', error);

    if (error.message?.includes('correos corporativos')) {
      errorMsg.value = 'Solo se permiten correos corporativos. No uses Gmail, Yahoo, Hotmail, etc.';
    } else if (error.message?.includes('User already registered')) {
      errorMsg.value = 'Este correo ya está registrado. Intenta iniciar sesión.';
    } else if (error.message?.includes('Ya existe una empresa')) {
      errorMsg.value = 'Ya existe una empresa con este dominio. Un compañero de tu empresa debe invitarte.';
    } else if (error.message?.includes('Database error')) {
      errorMsg.value = 'Error en la base de datos. Por favor verifica tus datos e intenta de nuevo.';
    } else {
      errorMsg.value = error.message || 'Error al registrar. Por favor intenta de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h1 class="text-3xl font-bold">Registra tu Empresa</h1>
        <p class="mt-2 text-blue-100">Comienza a mejorar el bienestar de tu equipo</p>
      </div>

      <!-- Progress Steps -->
      <div class="flex items-center justify-center p-6 bg-gray-50 border-b">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            ]">
              1
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'
            ]">
              Información de la Empresa
            </span>
          </div>

          <div class="w-16 h-1 bg-gray-300"></div>

          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            ]">
              2
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'
            ]">
              Datos del Administrador
            </span>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-8">

        <!-- Step 1: Company Information -->
        <div v-show="currentStep === 1" class="space-y-6">
          <div>
            <label for="razonSocial" class="block text-sm font-semibold text-gray-700 mb-2">
              Razón Social <span class="text-red-500">*</span>
            </label>
            <input
              id="razonSocial"
              v-model="razonSocial"
              type="text"
              required
              placeholder="Ej: Acme Corporation S.A."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label for="adminEmail" class="block text-sm font-semibold text-gray-700 mb-2">
              Email Corporativo del Administrador <span class="text-red-500">*</span>
            </label>
            <input
              id="adminEmail"
              v-model="adminEmail"
              type="email"
              required
              placeholder="admin@tuempresa.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p v-if="!isValidCorporateEmail && adminEmail" class="mt-2 text-sm text-red-600">
              Solo se permiten correos corporativos. No uses Gmail, Yahoo, Hotmail, etc.
            </p>
            <p v-if="isValidCorporateEmail && adminEmail" class="mt-2 text-sm text-green-600">
              Dominio: {{ emailDomain }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="ruc" class="block text-sm font-semibold text-gray-700 mb-2">
                RUC / NIF
              </label>
              <input
                id="ruc"
                v-model="ruc"
                type="text"
                placeholder="Ej: 20123456789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label for="telefono" class="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                id="telefono"
                v-model="telefono"
                type="tel"
                placeholder="Ej: +51 999 999 999"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="direccion" class="block text-sm font-semibold text-gray-700 mb-2">
              Dirección
            </label>
            <input
              id="direccion"
              v-model="direccion"
              type="text"
              placeholder="Ej: Av. Principal 123, Lima"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="pais" class="block text-sm font-semibold text-gray-700 mb-2">
                País
              </label>
              <input
                id="pais"
                v-model="pais"
                type="text"
                placeholder="Ej: Perú"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label for="ciudad" class="block text-sm font-semibold text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                id="ciudad"
                v-model="ciudad"
                type="text"
                placeholder="Ej: Lima"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="industria" class="block text-sm font-semibold text-gray-700 mb-2">
                Industria / Sector
              </label>
              <select
                id="industria"
                v-model="industria"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecciona una industria</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Retail">Retail</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Servicios">Servicios</option>
                <option value="Consultoría">Consultoría</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label for="numEmpleados" class="block text-sm font-semibold text-gray-700 mb-2">
                Número de Empleados
              </label>
              <select
                id="numEmpleados"
                v-model="numEmpleados"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecciona un rango</option>
                <option value="10">1-10</option>
                <option value="50">11-50</option>
                <option value="100">51-100</option>
                <option value="250">101-250</option>
                <option value="500">251-500</option>
                <option value="1000">501-1000</option>
                <option value="5000">1000+</option>
              </select>
            </div>
          </div>

          <div>
            <label for="sitioWeb" class="block text-sm font-semibold text-gray-700 mb-2">
              Sitio Web
            </label>
            <input
              id="sitioWeb"
              v-model="sitioWeb"
              type="url"
              placeholder="https://www.tuempresa.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <!-- Step 2: Administrator Information -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800">
              <strong>Importante:</strong> Estás creando la cuenta de administrador para {{ razonSocial }}.
              Esta cuenta tendrá acceso completo a todas las funcionalidades de la plataforma.
            </p>
          </div>

          <div>
            <label for="adminNombre" class="block text-sm font-semibold text-gray-700 mb-2">
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <input
              id="adminNombre"
              v-model="adminNombre"
              type="text"
              required
              placeholder="Ej: Juan Pérez"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email Corporativo
            </label>
            <div class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
              {{ adminEmail }}
            </div>
          </div>

          <div>
            <label for="adminPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <input
              id="adminPassword"
              v-model="adminPassword"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label for="adminPasswordConfirm" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Contraseña <span class="text-red-500">*</span>
            </label>
            <input
              id="adminPasswordConfirm"
              v-model="adminPasswordConfirm"
              type="password"
              required
              placeholder="Repite la contraseña"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p v-if="adminPasswordConfirm && !passwordsMatch" class="mt-2 text-sm text-red-600">
              Las contraseñas no coinciden
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ errorMsg }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex items-center justify-between">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Anterior
          </button>

          <div class="flex-1"></div>

          <button
            v-if="currentStep === 1"
            @click="nextStep"
            :disabled="!canProceedStep1"
            type="button"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Siguiente
          </button>

          <Button
            v-if="currentStep === 2"
            @click="handleRegister"
            :disabled="!canProceedStep2 || loading"
            type="button"
            class="px-6 py-3"
          >
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </Button>
        </div>

        <!-- Login Link -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <button
              @click="goToLogin"
              type="button"
              class="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
