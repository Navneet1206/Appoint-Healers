// src/components/TherapistSection.jsx
import React from 'react';
import { Users } from 'lucide-react';

const specializations = [
  'Psychiatrist',
  'Therapist',
  'Sexologist',
  'Child Psychologist',
  'Relationship Counselor',
  'Active Listener',
];

export default function TherapistSection() {
  return (
    <div style={{ backgroundColor: "#F8F8E1", height: "100vh" }} className="flex flex-col">
      {/* Header with Title - Takes minimal space */}
      <div className="pt-8 pb-6 text-center">
        <button style={{ backgroundColor: "#FFE2E2", color: "#9B4444" }} 
                className="px-6 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition duration-300 tracking-wider mb-4">
          MEET OUR SPECIALISTS
        </button>
        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#9B4444" }}>
          Expert Support For Your Wellbeing
        </h2>
      </div>
      
      {/* Main Content - Takes most of the screen space */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 pb-8">
        {/* Left side - Text content */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
          <p className="text-lg mb-6" style={{ color: "#555" }}>
            Our team of certified professionals is here to support you on your journey to better mental health, offering personalized care tailored to your unique needs.
          </p>
          <button style={{ backgroundColor: "#FFAAAA", color: "#FFF" }} 
                  className="w-full py-3 rounded-lg text-base font-bold shadow-md hover:shadow-lg transition duration-300">
            Book Consultation
          </button>
        </div>
        
        {/* Right side - Specialization grid */}
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {specializations.map((specialization) => (
            <div 
              key={specialization}
              style={{ backgroundColor: "#F8EDED", borderColor: "#FFAAAA" }} 
              className="rounded-lg p-4 text-center shadow-md hover:shadow-lg transition border-2 flex flex-col items-center justify-center h-32"
            >
              <div style={{ backgroundColor: "#FFE2E2" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Users size={18} style={{ color: "#9B4444" }} />
              </div>
              <h3 className="text-base font-bold" style={{ color: "#9B4444" }}>{specialization}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Testimonial - Takes minimal space */}
      <div style={{ backgroundColor: "#F8EDED" }} className="py-4 px-6 text-center mt-auto">
        <div className="max-w-3xl mx-auto">
          <p className="text-base italic" style={{ color: "#555" }}>
            "The specialists here have been instrumental in helping me navigate through difficult times."
          </p>
          <p style={{ color: "#9B4444" }} className="text-sm font-medium mt-1">- Satisfied Client</p>
        </div>
      </div>
    </div>
  );
}