// Generador de 120 empleados para SportLife Performance

const nombres = [
  'Carlos', 'Laura', 'Javier', 'Ana', 'Miguel', 'Patricia', 'Roberto', 'Carmen',
  'David', 'Elena', 'Fernando', 'Sofía', 'Antonio', 'Isabel', 'José', 'María',
  'Manuel', 'Rosa', 'Francisco', 'Teresa', 'Pedro', 'Lucía', 'Ángel', 'Marta',
  'Luis', 'Cristina', 'Raúl', 'Pilar', 'Sergio', 'Beatriz', 'Alberto', 'Silvia',
  'Jorge', 'Natalia', 'Daniel', 'Paula', 'Alejandro', 'Andrea', 'Víctor', 'Sara'
];

const apellidos = [
  'Martínez', 'González', 'Ruiz', 'Morales', 'Sánchez', 'Fernández', 'Díaz', 'López',
  'Torres', 'Ramírez', 'Ortiz', 'Jiménez', 'Vega', 'Castro', 'Romero', 'Navarro',
  'Gil', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Vázquez', 'Ramos', 'Cruz',
  'Flores', 'Herrera', 'Mendoza', 'Guerrero', 'Medina', 'Cortés', 'Aguilar', 'Silva'
];

const cargos = {
  'demo-dept-1': [ // Entrenamiento Personal (35 empleados)
    'Director de Entrenamiento', 'Entrenador Personal Senior', 'Entrenador Personal',
    'Especialista en Fuerza', 'Especialista en Resistencia', 'Preparador Físico',
    'Coach de Alto Rendimiento', 'Instructor Funcional'
  ],
  'demo-dept-2': [ // Nutrición Deportiva (15 empleados)
    'Nutricionista Jefe', 'Nutricionista Senior', 'Nutricionista',
    'Dietista Deportivo', 'Consultor Nutricional'
  ],
  'demo-dept-3': [ // Fisioterapia (12 empleados)
    'Fisioterapeuta Senior', 'Fisioterapeuta', 'Terapeuta Deportivo',
    'Especialista en Recuperación', 'Masajista Deportivo'
  ],
  'demo-dept-4': [ // Recepción y Atención (18 empleados)
    'Coordinadora de Recepción', 'Recepcionista Senior', 'Recepcionista',
    'Atención al Cliente', 'Administrativo'
  ],
  'demo-dept-5': [ // Clases Grupales (28 empleados)
    'Coordinador de Clases', 'Instructor de Spinning', 'Instructora de Yoga',
    'Instructor de Pilates', 'Instructor de CrossFit', 'Instructor de Zumba',
    'Instructor de HIIT', 'Instructor de Body Pump'
  ],
  'demo-dept-6': [ // Dirección (12 empleados)
    'Gerente General', 'Director de Operaciones', 'Director Financiero',
    'Director de RRHH', 'Jefe de Marketing', 'Coordinador General',
    'Analista de Negocios', 'Asistente de Dirección'
  ]
};

const departamentos = [
  { id: 'demo-dept-1', nombre: 'Entrenamiento Personal', cantidad: 35 },
  { id: 'demo-dept-2', nombre: 'Nutrición Deportiva', cantidad: 15 },
  { id: 'demo-dept-3', nombre: 'Fisioterapia', cantidad: 12 },
  { id: 'demo-dept-4', nombre: 'Recepción y Atención', cantidad: 18 },
  { id: 'demo-dept-5', nombre: 'Clases Grupales', cantidad: 28 },
  { id: 'demo-dept-6', nombre: 'Dirección', cantidad: 12 }
];

function generarEmpleados() {
  const empleados = [];
  let empleadoIndex = 1;
  const fechaBase = new Date('2023-01-15');

  departamentos.forEach(dept => {
    const cargosDisponibles = cargos[dept.id];

    for (let i = 0; i < dept.cantidad; i++) {
      const nombreIndex = (empleadoIndex - 1) % nombres.length;
      const apellidoIndex = Math.floor((empleadoIndex - 1) / nombres.length) % apellidos.length;
      const apellido2Index = (apellidoIndex + Math.floor(empleadoIndex / nombres.length)) % apellidos.length;

      const nombre = nombres[nombreIndex];
      const apellido = `${apellidos[apellidoIndex]} ${apellidos[apellido2Index]}`;
      const nombreCompleto = `${nombre} ${apellidos[apellidoIndex]}`;
      const email = `${nombre.toLowerCase()}.${apellidos[apellidoIndex].toLowerCase()}${empleadoIndex}@sportlife.com`;

      // Determinar cargo
      const cargoIndex = i % cargosDisponibles.length;
      const cargo = cargosDisponibles[cargoIndex];

      // Fecha de ingreso (distribuir a lo largo de 2023)
      const diasDesdeFundacion = Math.floor((empleadoIndex - 1) * 365 / 120);
      const fechaIngreso = new Date(fechaBase);
      fechaIngreso.setDate(fechaIngreso.getDate() + diasDesdeFundacion);

      // Puntos (más altos para antiguos y admins)
      const antiguedad = 120 - empleadoIndex;
      const puntosBase = 1000 + (antiguedad * 15);
      const puntos = Math.round(puntosBase + (Math.random() * 500));

      // Admins solo en dirección
      const esAdmin = dept.id === 'demo-dept-6' && i < 3;

      empleados.push({
        id: `demo-emp-${empleadoIndex}`,
        nombre: nombreCompleto,
        email: email,
        departamento_id: dept.id,
        departamentos: { id: dept.id, nombre: dept.nombre },
        cargo: cargo,
        fecha_ingreso: fechaIngreso.toISOString().split('T')[0],
        puntos: puntos,
        es_admin: esAdmin,
        activo: true,
        telefono: `+34 6${(10 + empleadoIndex).toString().padStart(2, '0')} ${(100 + empleadoIndex).toString().padStart(3, '0')} ${(100 + empleadoIndex).toString().padStart(3, '0')}`
      });

      empleadoIndex++;
    }
  });

  return empleados;
}

// Generar y exportar
const empleadosGenerados = generarEmpleados();
console.log(`Total empleados generados: ${empleadosGenerados.length}`);

// Mostrar primeros 5
console.log('\nPrimeros 5 empleados:');
empleadosGenerados.slice(0, 5).forEach(emp => {
  console.log(`- ${emp.nombre} (${emp.cargo}) - ${emp.departamentos.nombre} - ${emp.puntos} pts`);
});

// Exportar para copiar
console.log('\n\n// EMPLEADOS GENERADOS (copiar al demoData.js):');
console.log(JSON.stringify(empleadosGenerados, null, 2));
