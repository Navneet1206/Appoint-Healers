import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfessionals } from '../services/professionalService';
import { Professional } from '../types';
import { Search, Filter, Star, Calendar, User, Clock } from 'lucide-react';

const Professionals: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [specializations, setSpecializations] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProfessionals();
        setProfessionals(data);
        
        // Extract unique specializations
        const uniqueSpecializations = Array.from(
          new Set(data.map((professional: any) => professional.specialization))
        );
        setSpecializations(uniqueSpecializations as string[]);
      } catch (err: any) {
        console.error('Error fetching professionals:', err);
        setError(err.response?.data?.error || 'Failed to fetch professionals');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          professional.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          professional.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === '' || 
                                 professional.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Healthcare Professionals</h1>
        <p className="mt-2 text-gray-600">
          Find and book appointments with our verified healthcare professionals
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name, specialization, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading professionals...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
          <p className="text-gray-600">
            No professionals match your search criteria. Please try different keywords or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{professional.name}</h2>
                    <p className="text-indigo-600">{professional.specialization}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5" />
                    <span className="ml-2 text-gray-600 text-sm">4.0 (24 reviews)</span>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{professional.bio}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>60 min session</span>
                    </div>
                    <div className="text-gray-900 font-semibold">₹{professional.hourlyRate}/hr</div>
                  </div>
                  
                  <Link
                    to={`/book-appointment?professional=${professional.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Professionals;