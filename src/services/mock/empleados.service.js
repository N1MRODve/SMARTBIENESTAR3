// /src/services/mock/empleados.service.js

import { ref } from 'vue';

// Usamos ref para que la lista sea reactiva dentro del propio servicio
const empleados = ref([
  { id: 'emp-01', nombre: 'Ana García', email: 'ana.garcia@empresa.com', estado: 'Activo' },
  { id: 'emp-02', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', estado: 'Activo' },
  { id: 'emp-03', nombre: 'Laura Martínez', email: 'laura.martinez@empresa.com', estado: 'Invitado' },
]);

/**
 * Devuelve la lista de empleados.
 */
export const getEmpleados = async () => {
  return new Promise(resolve => setTimeout(() => resolve(empleados.value), 200));
};

/**
 * Añade nuevos empleados a la lista con estado 'Invitado'.
 * @param {string[]} emails - Un array de correos electrónicos a invitar.
 */
export const invitarEmpleados = async (emails) => {
  const nuevosEmpleados = emails.map(email => ({
    id: `emp-${Date.now()}-${Math.random()}`,
    nombre: 'Nuevo Invitado', // Nombre genérico inicial
    email: email,
    estado: 'Invitado',
  }));
  
  empleados.value.push(...nuevosEmpleados);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 200));
};

/**
 * Cambia el estado de un empleado.
 * @param {string} empleadoId - El ID del empleado a modificar.
 * @param {string} nuevoEstado - El nuevo estado ('Activo' o 'Inactivo').
 */
export const setEstadoEmpleado = async (empleadoId, nuevoEstado) => {
  const empleado = empleados.value.find(e => e.id === empleadoId);
  if (empleado) {
    empleado.estado = nuevoEstado;
  }
  return new Promise(resolve => setTimeout(() => resolve({ success: !!empleado }), 200));
};