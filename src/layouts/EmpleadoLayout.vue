<script setup>
// Aquí podríamos añadir lógica global para el empleado, como su total de puntos.
// import { useGamificacionStore } from '@/stores/gamificacion.store';
// const gamificacionStore = useGamificacionStore();
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 flex-shrink-0 bg-white border-r">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-primary">SMART Bienestar</h1>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/empleado/dashboard" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/actividades" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Actividades</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/apoyo-personal" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Apoyo Personal</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/recompensas" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Recompensas</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-primary text-white p-4 shadow-md flex justify-between items-center">
         <h2 class="text-xl font-semibold">Bienvenido</h2>
        <div>
          <button class="font-semibold hover:underline">Cerrar Sesión</button>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el enlace activo en el menú */
.router-link-exact-active {
  background-color: #f3f4f6; /* bg-gray-100 */
  font-weight: 600; /* semibold */
  color: #1e40af; /* text-primary-dark */
}
</style>