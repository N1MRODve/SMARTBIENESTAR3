// /src/services/mock/empleados.service.js

import { ref } from 'vue';

// Usamos ref para que la lista sea reactiva dentro del propio servicio
const empleados = ref([
  // Departamento de Desarrollo
  { id: 'emp-01', nombre: 'Ana García', email: 'ana.garcia@empresa.com', departamento: 'Desarrollo', cargo: 'Frontend Developer', estado: 'Activo' },
  { id: 'emp-02', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', departamento: 'Desarrollo', cargo: 'Backend Developer', estado: 'Activo' },
  { id: 'emp-03', nombre: 'Laura Martínez', email: 'laura.martinez@empresa.com', departamento: 'Desarrollo', cargo: 'Full Stack Developer', estado: 'Activo' },
  { id: 'emp-04', nombre: 'Miguel Fernández', email: 'miguel.fernandez@empresa.com', departamento: 'Desarrollo', cargo: 'DevOps Engineer', estado: 'Activo' },
  { id: 'emp-05', nombre: 'Sofia López', email: 'sofia.lopez@empresa.com', departamento: 'Desarrollo', cargo: 'UI/UX Designer', estado: 'Activo' },
  { id: 'emp-06', nombre: 'David Sánchez', email: 'david.sanchez@empresa.com', departamento: 'Desarrollo', cargo: 'Tech Lead', estado: 'Activo' },
  { id: 'emp-07', nombre: 'Elena Ruiz', email: 'elena.ruiz@empresa.com', departamento: 'Desarrollo', cargo: 'QA Engineer', estado: 'Activo' },
  { id: 'emp-08', nombre: 'Javier Moreno', email: 'javier.moreno@empresa.com', departamento: 'Desarrollo', cargo: 'Mobile Developer', estado: 'Activo' },
  
  // Departamento de Marketing
  { id: 'emp-09', nombre: 'Carmen Jiménez', email: 'carmen.jimenez@empresa.com', departamento: 'Marketing', cargo: 'Marketing Manager', estado: 'Activo' },
  { id: 'emp-10', nombre: 'Roberto Díaz', email: 'roberto.diaz@empresa.com', departamento: 'Marketing', cargo: 'Content Creator', estado: 'Activo' },
  { id: 'emp-11', nombre: 'Patricia Vega', email: 'patricia.vega@empresa.com', departamento: 'Marketing', cargo: 'Social Media Manager', estado: 'Activo' },
  { id: 'emp-12', nombre: 'Fernando Castro', email: 'fernando.castro@empresa.com', departamento: 'Marketing', cargo: 'SEO Specialist', estado: 'Activo' },
  { id: 'emp-13', nombre: 'Lucía Herrera', email: 'lucia.herrera@empresa.com', departamento: 'Marketing', cargo: 'Graphic Designer', estado: 'Activo' },
  { id: 'emp-14', nombre: 'Andrés Peña', email: 'andres.pena@empresa.com', departamento: 'Marketing', cargo: 'Digital Marketing Specialist', estado: 'Activo' },
  
  // Departamento de Ventas
  { id: 'emp-15', nombre: 'Isabel Torres', email: 'isabel.torres@empresa.com', departamento: 'Ventas', cargo: 'Sales Manager', estado: 'Activo' },
  { id: 'emp-16', nombre: 'Raúl Mendoza', email: 'raul.mendoza@empresa.com', departamento: 'Ventas', cargo: 'Account Executive', estado: 'Activo' },
  { id: 'emp-17', nombre: 'Natalia Ramos', email: 'natalia.ramos@empresa.com', departamento: 'Ventas', cargo: 'Sales Representative', estado: 'Activo' },
  { id: 'emp-18', nombre: 'Alejandro Silva', email: 'alejandro.silva@empresa.com', departamento: 'Ventas', cargo: 'Business Development', estado: 'Activo' },
  { id: 'emp-19', nombre: 'Cristina Vargas', email: 'cristina.vargas@empresa.com', departamento: 'Ventas', cargo: 'Customer Success Manager', estado: 'Activo' },
  { id: 'emp-20', nombre: 'Pablo Guerrero', email: 'pablo.guerrero@empresa.com', departamento: 'Ventas', cargo: 'Sales Analyst', estado: 'Activo' },
  
  // Departamento de Recursos Humanos
  { id: 'emp-21', nombre: 'Mónica Ortega', email: 'monica.ortega@empresa.com', departamento: 'RRHH', cargo: 'HR Manager', estado: 'Activo' },
  { id: 'emp-22', nombre: 'Sergio Delgado', email: 'sergio.delgado@empresa.com', departamento: 'RRHH', cargo: 'Recruiter', estado: 'Activo' },
  { id: 'emp-23', nombre: 'Beatriz Romero', email: 'beatriz.romero@empresa.com', departamento: 'RRHH', cargo: 'HR Business Partner', estado: 'Activo' },
  { id: 'emp-24', nombre: 'Óscar Medina', email: 'oscar.medina@empresa.com', departamento: 'RRHH', cargo: 'Talent Acquisition', estado: 'Activo' },
  
  // Departamento de Finanzas
  { id: 'emp-25', nombre: 'Pilar Navarro', email: 'pilar.navarro@empresa.com', departamento: 'Finanzas', cargo: 'CFO', estado: 'Activo' },
  { id: 'emp-26', nombre: 'Tomás Aguilar', email: 'tomas.aguilar@empresa.com', departamento: 'Finanzas', cargo: 'Financial Analyst', estado: 'Activo' },
  { id: 'emp-27', nombre: 'Alicia Campos', email: 'alicia.campos@empresa.com', departamento: 'Finanzas', cargo: 'Accountant', estado: 'Activo' },
  { id: 'emp-28', nombre: 'Ignacio Molina', email: 'ignacio.molina@empresa.com', departamento: 'Finanzas', cargo: 'Controller', estado: 'Activo' },
  
  // Departamento de Operaciones
  { id: 'emp-29', nombre: 'Raquel Prieto', email: 'raquel.prieto@empresa.com', departamento: 'Operaciones', cargo: 'Operations Manager', estado: 'Activo' },
  { id: 'emp-30', nombre: 'Víctor Blanco', email: 'victor.blanco@empresa.com', departamento: 'Operaciones', cargo: 'Project Manager', estado: 'Activo' },
  { id: 'emp-31', nombre: 'Amparo Crespo', email: 'amparo.crespo@empresa.com', departamento: 'Operaciones', cargo: 'Process Analyst', estado: 'Activo' },
  { id: 'emp-32', nombre: 'Gonzalo Rubio', email: 'gonzalo.rubio@empresa.com', departamento: 'Operaciones', cargo: 'Supply Chain Manager', estado: 'Activo' },
  
  // Departamento de Atención al Cliente
  { id: 'emp-33', nombre: 'Inmaculada León', email: 'inmaculada.leon@empresa.com', departamento: 'Atención al Cliente', cargo: 'Customer Service Manager', estado: 'Activo' },
  { id: 'emp-34', nombre: 'Emilio Pascual', email: 'emilio.pascual@empresa.com', departamento: 'Atención al Cliente', cargo: 'Customer Support Agent', estado: 'Activo' },
  { id: 'emp-35', nombre: 'Dolores Iglesias', email: 'dolores.iglesias@empresa.com', departamento: 'Atención al Cliente', cargo: 'Customer Support Agent', estado: 'Activo' },
  { id: 'emp-36', nombre: 'Rubén Lozano', email: 'ruben.lozano@empresa.com', departamento: 'Atención al Cliente', cargo: 'Technical Support', estado: 'Activo' },
  
  // Departamento de Calidad
  { id: 'emp-37', nombre: 'Encarnación Moya', email: 'encarnacion.moya@empresa.com', departamento: 'Calidad', cargo: 'Quality Manager', estado: 'Activo' },
  { id: 'emp-38', nombre: 'Adrián Peña', email: 'adrian.pena@empresa.com', departamento: 'Calidad', cargo: 'Quality Analyst', estado: 'Activo' },
  { id: 'emp-39', nombre: 'Remedios Soto', email: 'remedios.soto@empresa.com', departamento: 'Calidad', cargo: 'Quality Assurance', estado: 'Activo' },
  
  // Departamento de Administración
  { id: 'emp-40', nombre: 'Esteban Cortés', email: 'esteban.cortes@empresa.com', departamento: 'Administración', cargo: 'Office Manager', estado: 'Activo' },
  { id: 'emp-41', nombre: 'Rosario Fuentes', email: 'rosario.fuentes@empresa.com', departamento: 'Administración', cargo: 'Administrative Assistant', estado: 'Activo' },
  { id: 'emp-42', nombre: 'Marcos Gallego', email: 'marcos.gallego@empresa.com', departamento: 'Administración', cargo: 'Facilities Manager', estado: 'Activo' },
  
  // Empleados Recientes (algunos invitados)
  { id: 'emp-43', nombre: 'Nerea Cabrera', email: 'nerea.cabrera@empresa.com', departamento: 'Marketing', cargo: 'Marketing Intern', estado: 'Invitado' },
  { id: 'emp-44', nombre: 'Hugo Santana', email: 'hugo.santana@empresa.com', departamento: 'Desarrollo', cargo: 'Junior Developer', estado: 'Invitado' },
  { id: 'emp-45', nombre: 'Celia Domínguez', email: 'celia.dominguez@empresa.com', departamento: 'Ventas', cargo: 'Sales Intern', estado: 'Invitado' },
  { id: 'emp-46', nombre: 'Iván Márquez', email: 'ivan.marquez@empresa.com', departamento: 'RRHH', cargo: 'HR Assistant', estado: 'Invitado' },
  { id: 'emp-47', nombre: 'Yolanda Carrasco', email: 'yolanda.carrasco@empresa.com', departamento: 'Finanzas', cargo: 'Junior Analyst', estado: 'Invitado' },
  { id: 'emp-48', nombre: 'Nicolás Vázquez', email: 'nicolas.vazquez@empresa.com', departamento: 'Operaciones', cargo: 'Operations Assistant', estado: 'Invitado' },
  { id: 'emp-49', nombre: 'Manuela Herrero', email: 'manuela.herrero@empresa.com', departamento: 'Atención al Cliente', cargo: 'Support Trainee', estado: 'Invitado' },
  { id: 'emp-50', nombre: 'Rodrigo Benítez', email: 'rodrigo.benitez@empresa.com', departamento: 'Calidad', cargo: 'Quality Trainee', estado: 'Invitado' }
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
 * @param {string} departamento - El departamento asignado.
 */
export const invitarEmpleados = async (emails, departamento = '') => {
  const nuevosEmpleados = emails.map(email => ({
    id: `emp-${Date.now()}-${Math.random()}`,
    nombre: 'Nuevo Invitado', // Nombre genérico inicial
    email: email,
    departamento: departamento,
    cargo: '',
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

/**
 * Actualiza los datos de un empleado.
 * @param {string} empleadoId - El ID del empleado a actualizar.
 * @param {Object} datosActualizados - Los nuevos datos del empleado.
 */
export const actualizarEmpleado = async (empleadoId, datosActualizados) => {
  const index = empleados.value.findIndex(e => e.id === empleadoId);
  if (index !== -1) {
    empleados.value[index] = { ...empleados.value[index], ...datosActualizados };
    return new Promise(resolve => setTimeout(() => resolve({ success: true, empleado: empleados.value[index] }), 200));
  }
  return new Promise(resolve => setTimeout(() => resolve({ success: false }), 200));
};