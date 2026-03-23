import { Doctor } from '../types/medical';

export const specialties = [
  'Todas las especialidades',
  'Cardiología',
  'Dermatología',
  'Neurología',
  'Pediatría',
  'Ginecología',
  'Traumatología',
  'Psiquiatría',
  'Oftalmología',
  'Endocrinología',
  'Gastroenterología',
  'Urología'
];

export const genders = [
  'Cualquier género',
  'Masculino',
  'Femenino'
];

export const insuranceTypes = [
  'Todos los seguros',
  'OSDE',
  'Swiss Medical',
  'Galeno',
  'Medicus',
  'Particular'
];

// Generar slots de tiempo disponibles
const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  
  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    timeSlots.forEach(time => {
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${time}`,
        date: date.toISOString().split('T')[0],
        time,
        available: Math.random() > 0.3 // 70% de probabilidad de estar disponible
      });
    });
  }
  
  return slots;
};

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Benjamin Lee',
    specialty: 'Dermatología',
    gender: 'male',
    clinic: 'Cedars-Sinai Medical Center',
    location: 'Buenos Aires, CABA',
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Especialista en dermatología con más de 15 años de experiencia en tratamientos de piel.',
    experience: 15,
    languages: ['Español', 'Inglés']
  },
  {
    id: 2,
    name: 'Dra. Olivia Martinez',
    specialty: 'Cardiología',
    gender: 'female',
    clinic: 'Cleveland Clinic Florida',
    location: 'Córdoba, Córdoba',
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Cardióloga especializada en cirugía cardiovascular y medicina preventiva.',
    experience: 12,
    languages: ['Español', 'Inglés', 'Portugués']
  },
  {
    id: 3,
    name: 'Dr. Carlos Rodriguez',
    specialty: 'Neurología',
    gender: 'male',
    clinic: 'Hospital Italiano',
    location: 'Rosario, Santa Fe',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Neurólogo con especialización en trastornos del movimiento y epilepsia.',
    experience: 18,
    languages: ['Español']
  },
  {
    id: 4,
    name: 'Dra. Ana Sofia Gutierrez',
    specialty: 'Pediatría',
    gender: 'female',
    clinic: 'Hospital de Niños',
    location: 'Mendoza, Mendoza',
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Pediatra especializada en desarrollo infantil y medicina preventiva.',
    experience: 10,
    languages: ['Español', 'Inglés']
  },
  {
    id: 5,
    name: 'Dr. Miguel Torres',
    specialty: 'Traumatología',
    gender: 'male',
    clinic: 'Sanatorio Allende',
    location: 'Córdoba, Córdoba',
    rating: 4.6,
    reviewCount: 94,
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Traumatólogo especializado en cirugía de columna y artroscopia.',
    experience: 20,
    languages: ['Español']
  },
  {
    id: 6,
    name: 'Dra. Laura Fernandez',
    specialty: 'Ginecología',
    gender: 'female',
    clinic: 'Clínica Santa Isabel',
    location: 'Buenos Aires, CABA',
    rating: 4.8,
    reviewCount: 178,
    image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
    acceptsInsurance: true,
    availableSlots: generateTimeSlots(),
    bio: 'Ginecóloga especializada en medicina reproductiva y cirugía mínimamente invasiva.',
    experience: 14,
    languages: ['Español', 'Inglés']
  }
];