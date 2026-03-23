import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, X } from 'lucide-react';
import { Doctor, TimeSlot, Patient } from '../types/medical';

interface SuccessModalProps {
  doctor: Doctor;
  slot: TimeSlot;
  patient: Patient;
  appointmentId: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  doctor,
  slot,
  patient,
  appointmentId,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Turno Confirmado!
          </h2>
          <p className="text-gray-600">
            Tu cita médica ha sido reservada exitosamente
          </p>
        </div>

        {/* Appointment Details */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {formatDate(slot.date)}
                </p>
                <p className="text-sm text-gray-600">
                  {slot.time} hs
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  {doctor.name}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.clinic}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Paciente:</span> {patient.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">ID de Turno:</span> #{appointmentId}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Información importante:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Llega 15 minutos antes de tu cita</li>
              <li>• Trae tu documento de identidad</li>
              <li>• Si tienes obra social, trae la credencial</li>
              <li>• Recibirás un recordatorio por email</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Entendido
            </button>
            <button
              onClick={() => {
                // Aquí podrías implementar la funcionalidad de agregar al calendario
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Agregar al Calendario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};