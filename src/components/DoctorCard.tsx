import React from 'react';
import { MapPin, Star, Calendar, Shield, Clock } from 'lucide-react';
import { Doctor } from '../types/medical';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
}) => {
  const availableToday = doctor.availableSlots.filter(slot => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return (slot.date === today || slot.date === tomorrowStr) && slot.available;
  }).length;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Imagen del doctor */}
          <div className="flex-shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>

          {/* Información del doctor */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">
                  {doctor.specialty}
                </p>
              </div>
              
              {doctor.acceptsInsurance && (
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Acepta seguros</span>
                </div>
              )}
            </div>

            {/* Clínica y ubicación */}
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{doctor.clinic}</span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{doctor.location}</span>
            </div>

            {/* Rating y reseñas */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {doctor.rating}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({doctor.reviewCount} reseñas)
                </span>
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center text-green-600 mb-4">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {availableToday > 0 
                  ? `${availableToday} turnos disponibles hoy/mañana`
                  : 'Próximos turnos disponibles'
                }
              </span>
            </div>

            {/* Experiencia y idiomas */}
            {doctor.experience && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{doctor.experience} años</span> de experiencia
              </div>
            )}
            
            {doctor.languages && (
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Idiomas:</span> {doctor.languages.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Botón de reservar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onBookAppointment(doctor)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reservar Turno
          </button>
        </div>
      </div>
    </div>
  );
};