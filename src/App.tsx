import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Doctor, SearchFilters, TimeSlot, Patient } from './types/medical';
import { doctors } from './data/doctors';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { DoctorCard } from './components/DoctorCard';
import { AppointmentModal } from './components/AppointmentModal';
import { SuccessModal } from './components/SuccessModal';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    specialty: 'Todas las especialidades',
    gender: 'Cualquier género',
    insurance: 'Todos los seguros',
    location: '',
  });
  const [sortBy, setSortBy] = useState('Relevancia');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    doctor: Doctor;
    slot: TimeSlot;
    patient: Patient;
    appointmentId: string;
  } | null>(null);

  // Filtrar doctores basado en búsqueda y filtros
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = 
      filters.specialty === 'Todas las especialidades' || 
      doctor.specialty === filters.specialty;

    const matchesGender = 
      filters.gender === 'Cualquier género' || 
      (filters.gender === 'Masculino' && doctor.gender === 'male') ||
      (filters.gender === 'Femenino' && doctor.gender === 'female');

    const matchesInsurance = 
      filters.insurance === 'Todos los seguros' || 
      doctor.acceptsInsurance;

    const matchesLocation = 
      !filters.location || 
      doctor.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesSpecialty && matchesGender && matchesInsurance && matchesLocation;
  });

  // Ordenar doctores
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'Rating':
        return b.rating - a.rating;
      case 'Experiencia':
        return (b.experience || 0) - (a.experience || 0);
      case 'Precio':
        return 0; // Placeholder para ordenamiento por precio
      default:
        return 0; // Relevancia (orden original)
    }
  });

  const handleBookAppointment = (doctor: Doctor) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleAppointmentConfirm = (appointment: {
    doctor: Doctor;
    slot: TimeSlot;
    patient: Patient;
    reason: string;
  }) => {
    const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

    setAppointmentDetails({
      doctor: appointment.doctor,
      slot: appointment.slot,
      patient: appointment.patient,
      appointmentId,
    });

    setShowAppointmentModal(false);
    setShowSuccessModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Encuentra a tu Médico
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Busca especialistas, clínicas y hospitales.
          </p>
          
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredDoctors.length}
            />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                <span className="font-medium">
                  {filteredDoctors.length} médicos encontrados
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Relevancia</option>
                    <option>Rating</option>
                    <option>Experiencia</option>
                    <option>Precio</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-6">
              {sortedDoctors.length > 0 ? (
                sortedDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookAppointment={handleBookAppointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m6 0V7a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v4.306z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron médicos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedDoctor(null);
          }}
          onConfirm={handleAppointmentConfirm}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && appointmentDetails && (
        <SuccessModal
          doctor={appointmentDetails.doctor}
          slot={appointmentDetails.slot}
          patient={appointmentDetails.patient}
          appointmentId={appointmentDetails.appointmentId}
          onClose={() => {
            setShowSuccessModal(false);
            setAppointmentDetails(null);
          }}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default App;