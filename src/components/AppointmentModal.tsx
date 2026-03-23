import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { Doctor, TimeSlot, Patient } from '../types/medical';

interface AppointmentModalProps {
  doctor: Doctor;
  onClose: () => void;
  onConfirm: (appointment: {
    doctor: Doctor;
    slot: TimeSlot;
    patient: Patient;
    reason: string;
  }) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  doctor,
  onClose,
  onConfirm,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patient, setPatient] = useState<Patient>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    insurance: '',
  });
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'slots' | 'details'>('slots');

  // Agrupar slots por fecha
  const groupedSlots = doctor.availableSlots
    .filter(slot => slot.available)
    .reduce((groups, slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {} as Record<string, TimeSlot[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleConfirm = () => {
    if (selectedSlot && patient.name && patient.email && patient.phone) {
      onConfirm({
        doctor,
        slot: selectedSlot,
        patient,
        reason,
      });
    }
  };

  const isFormValid = patient.name && patient.email && patient.phone && patient.birthDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reservar Turno
              </h2>
              <p className="text-gray-600 mt-1">
                {doctor.name} - {doctor.specialty}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'slots' ? (
            /* Selección de horarios */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Selecciona un horario
              </h3>
              
              <div className="space-y-4">
                {Object.entries(groupedSlots).slice(0, 7).map(([date, slots]) => (
                  <div key={date} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">
                      {formatDate(date)}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          className="p-2 text-sm border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors text-center"
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Formulario de datos del paciente */
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Datos del Paciente
                </h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Turno seleccionado: {formatDate(selectedSlot!.date)} a las {selectedSlot!.time}
                    </span>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={patient.name}
                      onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento *
                    </label>
                    <input
                      type="date"
                      value={patient.birthDate}
                      onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={patient.email}
                      onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={patient.phone}
                      onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Obra Social / Seguro
                  </label>
                  <input
                    type="text"
                    value={patient.insurance}
                    onChange={(e) => setPatient({ ...patient, insurance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="OSDE, Swiss Medical, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Motivo de la consulta
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe brevemente el motivo de tu consulta..."
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {step === 'details' && (
              <button
                onClick={() => setStep('slots')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            {step === 'details' && (
              <button
                onClick={handleConfirm}
                disabled={!isFormValid}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar Turno
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};