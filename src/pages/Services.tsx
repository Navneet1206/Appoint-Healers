import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Brain, Users, Coffee, Bot as Lotus, Cog as Yoga } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      id: 'therapy',
      title: 'Therapy Sessions',
      description: 'Connect with licensed therapists for individual, couples, or family therapy sessions to address mental health concerns.',
      icon: <Brain className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Professional guidance for mental health challenges',
        'Confidential and secure environment',
        'Personalized treatment plans',
        'Evidence-based therapeutic approaches'
      ]
    },
    {
      id: 'counseling',
      title: 'Counseling',
      description: 'Get guidance and support from professional counselors for personal, career, or educational challenges.',
      icon: <Users className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Clarity on personal or professional challenges',
        'Improved decision-making skills',
        'Enhanced self-awareness',
        'Practical strategies for growth'
      ]
    },
    {
      id: 'wellness',
      title: 'Wellness Programs',
      description: 'Join structured programs designed to improve your overall well-being, including stress management and healthy lifestyle choices.',
      icon: <Heart className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
      benefits: [
        'Comprehensive approach to health',
        'Structured guidance for lifestyle changes',
        'Community support and accountability',
        'Measurable progress tracking'
      ]
    },
    {
      id: 'coaching',
      title: 'Life Coaching',
      description: 'Work with certified life coaches to set and achieve personal and professional goals, overcome obstacles, and create positive change.',
      icon: <Coffee className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Goal setting and achievement strategies',
        'Accountability and motivation',
        'Personal growth and development',
        'Improved work-life balance'
      ]
    },
    {
      id: 'meditation',
      title: 'Meditation Classes',
      description: 'Learn meditation techniques from experienced instructors to reduce stress, improve focus, and enhance mental clarity.',
      icon: <Lotus className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Reduced stress and anxiety',
        'Improved focus and concentration',
        'Enhanced emotional well-being',
        'Better sleep quality'
      ]
    },
    {
      id: 'yoga',
      title: 'Yoga Sessions',
      description: 'Practice yoga with certified instructors to improve flexibility, strength, and mental well-being through guided sessions.',
      icon: <Yoga className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Increased flexibility and strength',
        'Improved posture and balance',
        'Stress reduction and relaxation',
        'Mind-body connection'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the range of healthcare and wellness services available through our platform, designed to support your journey to better health and well-being.
        </p>
      </div>

      <div className="space-y-24">
        {services.map((service, index) => (
          <div key={service.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
            <div className="lg:w-1/2">
              <img 
                src={service.image} 
                alt={service.title} 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  {service.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                {service.description}
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <div className="text-teal-500 mr-2">•</div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                to={`/services/${service.id}`} 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-teal-50 rounded-xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Browse our professionals and book your first appointment today. Your journey to better health and well-being is just a click away.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/professionals"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            Browse Professionals
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;