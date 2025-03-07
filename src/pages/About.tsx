import React from 'react';
import { Calendar, Heart, Shield, Award, Users, Smile } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SAVAYAS HEALS</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dedicated to improving mental and physical wellness through accessible healthcare services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            SAVAYAS HEALS was founded in 2020 with a simple mission: to make quality healthcare accessible to everyone. 
            Our founder, Dr. Amara Patel, recognized the growing need for convenient access to healthcare professionals, 
            especially in the areas of mental health and wellness.
          </p>
          <p className="text-gray-600 mb-4">
            What began as a small network of therapists and counselors has grown into a comprehensive platform 
            connecting individuals with a diverse range of healthcare professionals, from therapists and counselors 
            to wellness coaches and meditation instructors.
          </p>
          <p className="text-gray-600">
            Today, SAVAYAS HEALS serves thousands of clients nationwide, helping them on their journey to better health 
            and well-being through our easy-to-use appointment booking system and dedicated professionals.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Healthcare professionals in a meeting" 
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="bg-teal-50 rounded-xl p-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're guided by a commitment to excellence, compassion, and accessibility in healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Compassionate Care</h3>
            <p className="text-gray-600">
              We believe in treating every individual with dignity, respect, and understanding. Our professionals are selected not just for their qualifications, but for their empathy and dedication to patient care.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
            <p className="text-gray-600">
              Your privacy and data security are paramount. We implement rigorous verification processes for all professionals and use advanced security measures to protect your information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <p className="text-gray-600">
              We're committed to making healthcare accessible to everyone. Our platform is designed to be user-friendly, with flexible scheduling options and a range of professionals to meet diverse needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in everything we do, from the quality of our platform to the professionals we partner with. We continuously seek feedback and improve our services to better serve you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-gray-600">
              We believe in the power of community to support healing and wellness. We foster connections between clients and professionals, creating a supportive environment for growth and healing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Smile className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Holistic Approach</h3>
            <p className="text-gray-600">
              We recognize that wellness encompasses both mental and physical health. Our platform offers a range of services to address the whole person, supporting your journey to complete well-being.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals behind SAVAYAS HEALS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" 
                alt="Dr. Amara Patel" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Dr. Amara Patel</h3>
            <p className="text-teal-600 mb-3">Founder & CEO</p>
            <p className="text-gray-600">
              With over 15 years of experience in clinical psychology, Dr. Patel founded SAVAYAS HEALS to bridge the gap between patients and healthcare professionals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Michael Chen" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
            <p className="text-teal-600 mb-3">Chief Technology Officer</p>
            <p className="text-gray-600">
              Michael brings over a decade of experience in healthcare technology, ensuring our platform is secure, reliable, and user-friendly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80" 
                alt="Sarah Johnson" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
            <p className="text-teal-600 mb-3">Head of Professional Relations</p>
            <p className="text-gray-600">
              Sarah works closely with our network of healthcare professionals, ensuring they meet our high standards and have the resources they need to provide excellent care.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-teal-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Whether you're seeking care or are a professional looking to join our network, we invite you to be part of the SAVAYAS HEALS community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="/user/register" className="bg-white text-teal-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300">
            Create an Account
          </a>
          <a href="/contact" className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium text-lg hover:bg-teal-700 transition duration-300">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;