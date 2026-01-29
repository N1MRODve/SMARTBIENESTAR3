<script setup>
import { ref } from 'vue';
import {
  Settings,
  Database,
  Bell,
  Shield,
  Globe,
  Mail
} from 'lucide-vue-next';

const activeTab = ref('general');

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'seguridad', label: 'Seguridad', icon: Shield }
];
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="border-b border-gray-100">
        <nav class="flex gap-4 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.id
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuracion General</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <Globe class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-900">Idioma de la plataforma</p>
                    <p class="text-sm text-gray-500">Idioma predeterminado para la interfaz</p>
                  </div>
                </div>
                <select class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="es">Espanol</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <Database class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-900">Modo de mantenimiento</p>
                    <p class="text-sm text-gray-500">Desactiva el acceso publico a la plataforma</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'notificaciones'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <Mail class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-900">Nueva solicitud de servicio</p>
                    <p class="text-sm text-gray-500">Recibir email cuando una empresa solicita un servicio</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <Mail class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-900">Nueva empresa registrada</p>
                    <p class="text-sm text-gray-500">Recibir email cuando una empresa completa el onboarding</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <Bell class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-900">Resumen semanal</p>
                    <p class="text-sm text-gray-500">Recibir un resumen semanal de actividad de la plataforma</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'seguridad'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3 mb-3">
                  <Shield class="w-5 h-5 text-gray-600" />
                  <p class="font-medium text-gray-900">Politicas de acceso</p>
                </div>
                <p class="text-sm text-gray-600">
                  El acceso al panel de super administracion esta restringido a usuarios registrados
                  en la tabla usuarios_plataforma con roles: superadmin, soporte o comercial.
                </p>
              </div>

              <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p class="text-sm text-emerald-800">
                  <strong>Row Level Security (RLS)</strong> esta habilitado en todas las tablas.
                  Los super admins tienen acceso de lectura a todas las empresas y solicitudes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
