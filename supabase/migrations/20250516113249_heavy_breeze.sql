/*
  # Initial schema setup for companies management

  1. New Tables
    - `empresas`
      - `id` (uuid, primary key)
      - `nombre` (text, unique)
      - `dominio_email` (text, unique)
      - `logo_url` (text, nullable)
      - `direccion` (text, nullable)
      - `telefono` (text, nullable)
      - `fecha_registro` (timestamptz)
      - `activo` (boolean)
      - `activa` (boolean)
      - `actividad_score` (integer)

    - `servicios_contratados`
      - `id` (uuid, primary key)
      - `empresa_id` (uuid, references empresas)
      - `tipo_servicio` (text)
      - `fecha_inicio` (timestamptz)
      - `fecha_fin` (timestamptz, nullable)
      - `activo` (boolean)
      - `creado_por` (uuid, references auth.users)
      - `notas` (text, nullable)
      - `fecha_creacion` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create empresas table
CREATE TABLE IF NOT EXISTS empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  dominio_email text UNIQUE NOT NULL,
  logo_url text,
  direccion text,
  telefono text,
  fecha_registro timestamptz DEFAULT now(),
  activo boolean DEFAULT true,
  activa boolean DEFAULT true,
  actividad_score integer DEFAULT 0
);

-- Create servicios_contratados table
CREATE TABLE IF NOT EXISTS servicios_contratados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_servicio text NOT NULL,
  fecha_inicio timestamptz DEFAULT now(),
  fecha_fin timestamptz,
  activo boolean DEFAULT true,
  creado_por uuid REFERENCES auth.users(id),
  notas text,
  fecha_creacion timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_contratados ENABLE ROW LEVEL SECURITY;

-- Create policies for empresas
CREATE POLICY "Allow read access for authenticated users"
  ON empresas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON empresas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for servicios_contratados
CREATE POLICY "Allow read access for authenticated users"
  ON servicios_contratados
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON servicios_contratados
  FOR INSERT
  TO authenticated
  WITH CHECK (true);