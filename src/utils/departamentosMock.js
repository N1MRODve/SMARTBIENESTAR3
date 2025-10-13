// TODO: conectar con tablas "departamentos" y "empleados_encuestas" cuando BD esté activa.

export const departamentos = [
  {
    id: 1,
    nombre: "RRHH",
    empleados: 8,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 2,
    nombre: "Marketing",
    empleados: 12,
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: 3,
    nombre: "Ventas",
    empleados: 15,
    color: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    nombre: "Producción",
    empleados: 10,
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: 5,
    nombre: "Desarrollo",
    empleados: 18,
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    id: 6,
    nombre: "Administración",
    empleados: 7,
    color: "bg-gray-100 text-gray-800"
  }
];

export const getTotalEmpleados = () => {
  return departamentos.reduce((total, dept) => total + dept.empleados, 0);
};

export const getDepartamentoById = (id) => {
  return departamentos.find(dept => dept.id === id);
};
