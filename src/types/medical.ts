// Tipos TypeScript para el sistema médico
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  gender: 'male' | 'female';
  clinic: string;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  acceptsInsurance: boolean;
  availableSlots: TimeSlot[];
  bio?: string;
  experience?: number;
  languages?: string[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface SearchFilters {
  specialty: string;
  gender: string;
  insurance: string;
  location: string;
}

export interface Patient {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  insurance?: string;
}