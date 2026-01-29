/*
  # Catálogo de Servicios SMART Bienestar

  1. Cambios en la estructura
    - Ampliación de categorías permitidas en la tabla `servicios`
    - Ampliación de tipos de servicio permitidos
    - Adición de campo `beneficios` para almacenar los beneficios del servicio

  2. Nuevas categorías
    - salud_mental: Servicios de salud mental y emocional
    - clima_laboral: Servicios de mejora del clima laboral
    - productividad: Servicios de gestión de carga de trabajo
    - comunicacion: Servicios de comunicación organizacional
    - desarrollo_profesional: Servicios de desarrollo de habilidades
    - bienestar_general: Servicios de bienestar integral
    - consultoria: Servicios de consultoría estratégica

  3. Nuevos tipos de servicio
    - sesion_grupal, sesion_individual, taller, webinar (existentes)
    - programa: Programas de formación de múltiples sesiones
    - consultoria: Servicios de consultoría personalizada

  4. Servicios insertados
    - 12 servicios del catálogo SMART Bienestar
    - Disponibles para todas las empresas (empresa_id = NULL)
*/

-- Eliminar constraint antiguo de categoría y crear uno nuevo con más opciones
ALTER TABLE servicios DROP CONSTRAINT IF EXISTS servicios_categoria_check;
ALTER TABLE servicios ADD CONSTRAINT servicios_categoria_check 
  CHECK (categoria = ANY (ARRAY[
    'salud_mental'::text, 
    'fisico'::text, 
    'financiero'::text, 
    'legal'::text, 
    'familiar'::text,
    'clima_laboral'::text,
    'productividad'::text,
    'comunicacion'::text,
    'desarrollo_profesional'::text,
    'bienestar_general'::text,
    'consultoria'::text
  ]));

-- Eliminar constraint antiguo de tipo y crear uno nuevo con más opciones
ALTER TABLE servicios DROP CONSTRAINT IF EXISTS servicios_tipo_check;
ALTER TABLE servicios ADD CONSTRAINT servicios_tipo_check 
  CHECK (tipo = ANY (ARRAY[
    'sesion_grupal'::text, 
    'sesion_individual'::text, 
    'taller'::text, 
    'webinar'::text,
    'programa'::text,
    'consultoria'::text
  ]));

-- Añadir columna de beneficios si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'servicios' AND column_name = 'beneficios'
  ) THEN
    ALTER TABLE servicios ADD COLUMN beneficios jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Añadir columna de cantidad/frecuencia si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'servicios' AND column_name = 'frecuencia'
  ) THEN
    ALTER TABLE servicios ADD COLUMN frecuencia text;
  END IF;
END $$;

-- Insertar servicios del catálogo SMART Bienestar
-- Estos servicios están disponibles para todas las empresas (sin empresa_id específico)

-- SALUD MENTAL
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Liderazgo Consciente',
  'Un programa de formación diseñado para dotar a los líderes de herramientas prácticas que les permitan gestionarse emocionalmente, pero sobre todo detectar señales tempranas de estrés, ansiedad, depresión o agotamiento en sus equipos y buscar soluciones sin necesidad de asumir funciones terapéuticas. Evitando así bajas o rotación de talento.',
  'salud_mental',
  'programa',
  180,
  true,
  '[
    {"titulo": "Prevención del Burnout", "descripcion": "Reduce con importancia la incidencia de agotamiento crónico en los mandos medios y superiores."},
    {"titulo": "Cultura de Empatía", "descripcion": "Mejora la retención del talento al crear un entorno de trabajo donde los miembros de equipos se sienten comprendidos y respaldados por su líder."},
    {"titulo": "Toma de Decisiones", "descripcion": "Un líder con bienestar emocional mantiene una mayor claridad mental y eficacia bajo presión."}
  ]'::jsonb,
  '2 sesiones de 90 minutos'
);

INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'SMART Care: Asistencia Psicológica Profesional',
  'Servicio de orientación y apoyo psicológico externo que ofrece a todos los colaboradores un espacio seguro y profesional para abordar retos emocionales o personales que impactan en su vida laboral.',
  'salud_mental',
  'sesion_individual',
  60,
  true,
  '[
    {"titulo": "Seguridad y confidencialidad", "descripcion": "Garantiza al personal un canal de ayuda totalmente anónimo y externo a la estructura de la empresa, lo que aumenta la confianza para buscar apoyo."},
    {"titulo": "Reducción del absentismo", "descripcion": "Interviene de manera temprana en problemas de ansiedad o depresión, disminuyendo las bajas laborales."},
    {"titulo": "Incremento del bienestar percibido", "descripcion": "Mejora el pulso de bienestar general al sentir el colaborador que la empresa invierte activamente en su salud integral."}
  ]'::jsonb,
  '2 sesiones al mes por persona'
);

-- CLIMA LABORAL
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Coaching Personalizado para Líderes',
  'Un acompañamiento individualizado para los mandos medios y gerentes de la organización, enfocado en potenciar sus habilidades de gestión de personas y resolución de conflictos dentro de sus equipos.',
  'clima_laboral',
  'sesion_individual',
  60,
  true,
  '[
    {"titulo": "Fortalecimiento del vínculo", "descripcion": "Mejora la relación directa entre el líder y cada colaborador, reduciendo la fricción en el día a día."},
    {"titulo": "Gestión de crisis", "descripcion": "Dota al líder de herramientas para manejar situaciones difíciles de forma asertiva, protegiendo el clima del departamento."},
    {"titulo": "Desarrollo de autoconocimiento", "descripcion": "Ayuda al líder a identificar sesgos o comportamientos que pueden estar afectando negativamente la moral de los miembros del equipo."}
  ]'::jsonb,
  '2 sesiones al mes por persona'
);

INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Transformación Cultura Organizacional',
  'Servicio de consultoría estratégica y facilitación grupal orientado a redefinir los valores y comportamientos de la empresa, eliminando silos y promoviendo una cultura de colaboración real.',
  'clima_laboral',
  'consultoria',
  NULL,
  true,
  '[
    {"titulo": "Sentido de pertenencia", "descripcion": "Logra que cada miembro del equipo se sienta identificado con los valores de la empresa, aumentando su compromiso a largo plazo."},
    {"titulo": "Alineación organizacional", "descripcion": "Unifica la visión de todos los departamentos, asegurando que todos los colaboradores remen en la misma dirección."},
    {"titulo": "Optimización del ambiente", "descripcion": "Al intervenir directamente en la cultura, se reducen las dinámicas tóxicas y se fomenta un espacio donde el talento florece y se refuerza la confianza."}
  ]'::jsonb,
  'Según necesidad'
);

-- CARGA DE TRABAJO (PRODUCTIVIDAD)
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Multiplica el Tiempo Gestionando Prioridades',
  'En este taller práctico los participantes aprenderán a diferenciar lo urgente de lo importante, utilizando herramientas de planificación que permiten organizar la carga laboral de manera inteligente y realista para reducir la sensación de caos.',
  'productividad',
  'taller',
  90,
  true,
  '[
    {"titulo": "Reducción del estrés", "descripcion": "Disminuye la sensación de agobio al proporcionar un orden claro para abordar las responsabilidades diarias."},
    {"titulo": "Aumento de la eficiencia", "descripcion": "Permite que los miembros del equipo dediquen su energía a las tareas que realmente generan valor para la empresa."},
    {"titulo": "Cumplimiento de Objetivos", "descripcion": "Mejora la capacidad de entrega en los plazos establecidos, evitando la saturación de último minuto."}
  ]'::jsonb,
  'Sesión única de 90 minutos'
);

INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Identificando y Gestionando al Cliente Difícil',
  'En este taller práctico los equipos aprenderán a identificar los diferentes perfiles de clientes difíciles, entender las razones detrás de sus comportamientos y aplicar herramientas efectivas para manejarlos.',
  'productividad',
  'taller',
  90,
  true,
  '[
    {"titulo": "Protección del Bienestar", "descripcion": "Evita que el desgaste emocional causado por agentes externos afecte la salud mental del profesional."},
    {"titulo": "Mejora de la Comunicación", "descripcion": "Capacita al colaborador para transformar conflictos en conversaciones productivas y profesionales."},
    {"titulo": "Retención del Talento", "descripcion": "Reduce la rotación en áreas de servicio o atención al cliente al hacer el entorno de trabajo más sostenible y seguro."}
  ]'::jsonb,
  'Sesión única de 90 minutos'
);

-- COMUNICACIÓN
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Comunicación 360°: De la Confusión a la Claridad',
  'Este programa está diseñado para transformar la forma en que los líderes transmiten la estrategia a sus equipos. Se enfoca en eliminar el ruido informativo y asegurar que cada mensaje inspire acción, seguridad y confianza.',
  'comunicacion',
  'programa',
  360,
  true,
  '[
    {"titulo": "Claridad de Ejecución", "descripcion": "Garantiza que cada colaborador sepa exactamente qué se espera de él, eliminando la pérdida de tiempo por malentendidos."},
    {"titulo": "Seguridad Psicológica", "descripcion": "Crea un entorno donde los miembros del equipo sienten la confianza necesaria para preguntar y proponer sin miedo."},
    {"titulo": "Agilidad Organizacional", "descripcion": "Acelera la toma de decisiones al establecer canales de comunicación directos, honestos y sin filtros innecesarios."}
  ]'::jsonb,
  '4 sesiones de 90 minutos'
);

-- DESARROLLO PROFESIONAL
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'SMART Skills: Impulsando el Potencial Técnico',
  'Programas de capacitación especializada en habilidades de alta demanda diseñados de forma personalizada para mantener a los colaboradores a la vanguardia de su sector.',
  'desarrollo_profesional',
  'programa',
  NULL,
  true,
  '[
    {"titulo": "Actualización de competencias", "descripcion": "Asegura que los miembros del equipo cuenten con las herramientas más modernas para realizar su trabajo con excelencia."},
    {"titulo": "Competitividad del talento", "descripcion": "Aumenta el valor profesional del colaborador dentro de la organización."},
    {"titulo": "Motivación por aprendizaje", "descripcion": "Satisface la necesidad de crecimiento constante, reduciendo el sentimiento de estancamiento profesional."}
  ]'::jsonb,
  'Según programa'
);

INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'El Poder de las Habilidades Blandas',
  'Talleres enfocados en la inteligencia emocional, gestión del cambio, liderazgo, gestión del estrés y otros programas enfocados a desarrollar habilidades que permitan a los miembros del equipo fortalecer su liderazgo personal.',
  'desarrollo_profesional',
  'taller',
  NULL,
  true,
  '[
    {"titulo": "Liderazgo Colaborativo", "descripcion": "Mejora la capacidad de los colaboradores para trabajar en equipo y resolver conflictos de manera pacífica."},
    {"titulo": "Adaptabilidad al Cambio", "descripcion": "Prepara a los miembros del equipo para enfrentar nuevos retos con resiliencia y creatividad."},
    {"titulo": "Relaciones Profesionales Sólidas", "descripcion": "Fortalece la cohesión interna y la marca personal de cada colaborador frente a clientes y compañeros."}
  ]'::jsonb,
  'Según programa'
);

-- BIENESTAR GENERAL
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'De Gestión del Tiempo a Gestión de Energía',
  'Un programa práctico que enseña a los colaboradores a optimizar su jornada laboral basándose en sus picos de energía biológica, permitiéndoles trabajar de forma más fluida y sin agotamiento.',
  'bienestar_general',
  'programa',
  60,
  true,
  '[
    {"titulo": "Recuperación del Control", "descripcion": "Dota a los miembros del equipo de técnicas para evitar que la agenda los domine, reduciendo la fatiga mental."},
    {"titulo": "Sostenibilidad Personal", "descripcion": "Ayuda a integrar pausas de calidad que mantienen la claridad mental durante toda la jornada."},
    {"titulo": "Equilibrio Vida-Trabajo", "descripcion": "Al mejorar la eficiencia del tiempo, el colaborador puede disfrutar de su vida personal sin la carga mental del trabajo pendiente."}
  ]'::jsonb,
  '2 sesiones mensuales'
);

INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'Pausa Consciente para tu Calma Laboral',
  'Actividades como sesiones guiadas de estiramientos ergonómicos, respiración y relajación diseñadas para realizarse fuera y/o dentro del entorno laboral, ayudando a liberar la tensión física y mental.',
  'bienestar_general',
  'sesion_grupal',
  15,
  true,
  '[
    {"titulo": "Salud física inmediata", "descripcion": "Reduce las molestias causadas por el sedentarismo y las posturas frente al ordenador, cuidando la salud física del colaborador."},
    {"titulo": "Reducción del cortisol", "descripcion": "Ayuda a bajar los niveles de estrés en momentos de alta demanda, devolviendo la calma al miembro del equipo."},
    {"titulo": "Mejora del Humor", "descripcion": "Estas pausas generan una sensación de bienestar inmediato que mejora la actitud y la disposición hacia las tareas y los compañeros."}
  ]'::jsonb,
  'Diario o según necesidad'
);

-- CONSULTORÍA
INSERT INTO servicios (nombre, descripcion, categoria, tipo, duracion_minutos, activo, beneficios, frecuencia)
VALUES (
  'SMART Advisory: Consultoría de Estrategia y Bienestar',
  'Un servicio de acompañamiento experto diseñado para ayudar a las empresas a interpretar los datos de la plataforma, obtener una visión externa y objetiva de su situación actual y diseñar planes de acción a medida que mejoren la experiencia de cada colaborador.',
  'consultoria',
  'consultoria',
  30,
  true,
  '[
    {"titulo": "Visión Externa y Objetiva", "descripcion": "Aporta una perspectiva experta y neutral que ayuda a identificar puntos ciegos que la empresa no puede ver por sí misma."},
    {"titulo": "Optimización de la Plataforma", "descripcion": "Asegura que la empresa aproveche al máximo todas las funcionalidades de SMART Bienestar, garantizando una alta tasa de participación de los miembros del equipo."},
    {"titulo": "Estrategia Basada en Datos", "descripcion": "Transforma las métricas en decisiones de negocio inteligentes, asegurando que cada inversión en bienestar tenga un impacto real en la cultura y los resultados."}
  ]'::jsonb,
  '2 sesiones de 30 minutos mensuales'
);