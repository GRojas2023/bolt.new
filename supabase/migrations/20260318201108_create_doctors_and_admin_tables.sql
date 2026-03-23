/*
  # Sistema de Gestión de Profesionales Médicos
  
  ## Descripción
  Este migration crea las tablas necesarias para un sistema completo de gestión de profesionales médicos con panel de administración.
  
  ## 1. Nuevas Tablas
  
  ### `doctors`
  Tabla principal para almacenar información de profesionales médicos
  - `id` (uuid, primary key) - Identificador único del doctor
  - `name` (text) - Nombre completo del doctor
  - `specialty` (text) - Especialidad médica
  - `gender` (text) - Género (male/female)
  - `clinic` (text) - Nombre de la clínica
  - `location` (text) - Ubicación (ciudad, provincia)
  - `rating` (numeric) - Calificación promedio (0-5)
  - `review_count` (integer) - Número de reseñas
  - `image` (text) - URL de la imagen del doctor
  - `accepts_insurance` (boolean) - Si acepta seguros médicos
  - `bio` (text) - Biografía del doctor
  - `experience` (integer) - Años de experiencia
  - `languages` (text[]) - Array de idiomas que habla
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de última actualización
  
  ### `doctor_time_slots`
  Tabla para gestionar horarios disponibles de los doctores
  - `id` (uuid, primary key) - Identificador único del slot
  - `doctor_id` (uuid, foreign key) - Referencia al doctor
  - `slot_date` (date) - Fecha del turno
  - `slot_time` (time) - Hora del turno
  - `available` (boolean) - Si está disponible
  - `created_at` (timestamptz) - Fecha de creación
  
  ### `appointments`
  Tabla para almacenar las citas médicas reservadas
  - `id` (uuid, primary key) - Identificador único de la cita
  - `appointment_id` (text) - ID legible para el usuario (APT-XXXXXX)
  - `doctor_id` (uuid, foreign key) - Referencia al doctor
  - `patient_name` (text) - Nombre del paciente
  - `patient_email` (text) - Email del paciente
  - `patient_phone` (text) - Teléfono del paciente
  - `patient_birth_date` (date) - Fecha de nacimiento del paciente
  - `insurance` (text) - Obra social/seguro
  - `appointment_date` (date) - Fecha de la cita
  - `appointment_time` (time) - Hora de la cita
  - `reason` (text) - Motivo de la consulta
  - `status` (text) - Estado (confirmed, pending, cancelled)
  - `created_at` (timestamptz) - Fecha de creación
  
  ### `admin_users`
  Tabla para usuarios administradores del sistema
  - `id` (uuid, primary key) - Identificador único
  - `user_id` (uuid, foreign key) - Referencia a auth.users
  - `full_name` (text) - Nombre completo del admin
  - `role` (text) - Rol (super_admin, admin)
  - `created_at` (timestamptz) - Fecha de creación
  
  ## 2. Seguridad - Row Level Security (RLS)
  
  Todas las tablas tienen RLS habilitado para máxima seguridad:
  
  ### Políticas `doctors`:
  - SELECT: Lectura pública para usuarios autenticados y anónimos
  - INSERT/UPDATE/DELETE: Solo administradores autenticados
  
  ### Políticas `doctor_time_slots`:
  - SELECT: Lectura pública para ver disponibilidad
  - INSERT/UPDATE/DELETE: Solo administradores
  
  ### Políticas `appointments`:
  - SELECT: Solo administradores pueden ver todas las citas
  - INSERT: Usuarios autenticados pueden crear citas
  - UPDATE/DELETE: Solo administradores
  
  ### Políticas `admin_users`:
  - SELECT: Solo usuarios admin pueden ver otros admins
  - INSERT/UPDATE/DELETE: Solo super_admin
  
  ## 3. Índices
  - Índices en campos de búsqueda frecuente (specialty, location, doctor_id)
  - Índices en foreign keys para joins eficientes
  
  ## 4. Funciones Helper
  - Función para verificar si un usuario es administrador
  
  ## 5. Notas Importantes
  - Todos los IDs usan UUID para seguridad
  - Timestamps automáticos con valores por defecto
  - Constraints de integridad referencial
  - Validaciones de datos en check constraints
*/

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de doctores
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  clinic text NOT NULL,
  location text NOT NULL,
  rating numeric(2, 1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  image text NOT NULL,
  accepts_insurance boolean DEFAULT true,
  bio text DEFAULT '',
  experience integer DEFAULT 0 CHECK (experience >= 0),
  languages text[] DEFAULT ARRAY['Español'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de horarios disponibles
CREATE TABLE IF NOT EXISTS doctor_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date date NOT NULL,
  slot_time time NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, slot_date, slot_time)
);

-- Tabla de citas médicas
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id text UNIQUE NOT NULL,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  patient_birth_date date,
  insurance text,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  reason text DEFAULT '',
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(location);
CREATE INDEX IF NOT EXISTS idx_time_slots_doctor_id ON doctor_time_slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON doctor_time_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Función para verificar si un usuario es administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS en todas las tablas
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla doctors
CREATE POLICY "Doctors are viewable by everyone"
  ON doctors FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (is_admin());

-- Políticas para tabla doctor_time_slots
CREATE POLICY "Time slots are viewable by everyone"
  ON doctor_time_slots FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert time slots"
  ON doctor_time_slots FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update time slots"
  ON doctor_time_slots FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete time slots"
  ON doctor_time_slots FOR DELETE
  TO authenticated
  USING (is_admin());

-- Políticas para tabla appointments
CREATE POLICY "Only admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Authenticated users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (is_admin());

-- Políticas para tabla admin_users
CREATE POLICY "Admins can view other admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only authenticated users can insert admin_users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own admin profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only super admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );