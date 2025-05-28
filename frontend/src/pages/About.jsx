import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, Clock } from 'lucide-react';

const AboutUsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const teamMembers = [
    {
      id: 1,
      name: "ABHINAV KUSHWAHA",
      designation: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "SUPRIYA KUMARI",
      designation: "Co-Founder & COO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332fced?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "ANU KUMARI",
      designation: "CMO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "NAVNEET VISHWAKARMA",
      designation: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "PRIYANSHU PANDEY",
      designation: "COO",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, teamMembers.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, teamMembers.length - 2)) % Math.max(1, teamMembers.length - 2));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="about-savayas" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Heart className="w-16 h-16 text-[#D20424] mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Founded with <span className="text-[#D20424]">Heart</span>. Built for <span className="text-blue-600">Healing</span>.
            </h1>
          </div>
          
          <div className="space-y-6 text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            <p>
              Founded in 2025 by Abhinav Kushwaha and co-founded by Supriya Kumari, Savayas Heal 
              was created to make mental health care accessible, compassionate, and stigma-free.
            </p>
            <p>
              Rooted in a vision that began in 2018 as a small practice, it has grown into a holistic 
              wellness platform connecting individuals with certified clinical psychologists.
            </p>
            <p>
              We specialize in supporting students and professionals facing stress, anxiety, burnout, 
              depression, and personality disorders. Through personalized therapy plans, awareness 
              programs, and digital tools, we aim to help people heal, grow, and thrive—guided by 
              empathy, respect, and genuine care.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Approach Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Problem Section */}
            <div>
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-[#D20424] mr-3" />
                <h2 className="text-3xl font-bold text-blue-600">What's The Problem</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-8">
                Many mental health companies in India predominantly focus on tier 1 cities, overlooking the critical need for mental health services in tier 2 & tier 3 cities. These areas often suffer from a lack of access to quality care, compounded by the same challenges of stigma, limited awareness, and inadequate resources. As a result, individuals in tier 2 & tier 3 cities face significant barriers in receiving the mental health support they need, creating a gap in service availability and support across the country.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h3 className="font-semibold text-blue-600 mb-2">Safe Environment</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h3 className="font-semibold text-blue-600 mb-2">Holistic Methods</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h3 className="font-semibold text-blue-600 mb-2">Personalized Care</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h3 className="font-semibold text-blue-600 mb-2">Evidence-Based</h3>
                </div>
              </div>
            </div>

            {/* Approach Section */}
            <div>
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-[#D20424] mr-3" />
                <h2 className="text-3xl font-bold text-blue-600">Our Approach</h2>
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  At Savayas Heal, we believe that effective mental health care must be as unique as 
                  the individuals we serve. Our approach combines evidence-based therapeutic 
                  techniques with a deeply humanistic philosophy.
                </p>
                <p>
                  We recognize that healing isn't one-size-fits-all, which is why we integrate various 
                  modalities—from cognitive behavioral therapy to mindfulness practices—tailored to 
                  your specific needs and goals.
                </p>
                <p>
                  Our practitioners stay at the forefront of mental health research while remaining 
                  grounded in the timeless wisdom that human connection is at the heart of all healing.
                </p>
                <button className="bg-[#D20424] text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors duration-300">
                  Learn About Our Methods
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Mission <span className="text-[#D20424]">&</span> <span className="text-blue-600">Values</span>
          </h2>
          <p className="text-xl text-center text-gray-700 mb-16 max-w-4xl mx-auto">
            "To provide compassionate, accessible mental health care that empowers individuals to navigate life's challenges, foster meaningful connections, and achieve lasting well-being."
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#D20424]" />
              </div>
              <h3 className="text-xl font-bold text-[#D20424] mb-4">Compassion First</h3>
              <p className="text-gray-600 leading-relaxed">
                We approach every individual with genuine empathy and understanding, creating a safe space where healing can begin.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-[#D20424] mb-4">Integrity & Trust</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest ethical standards and honor the trust placed in us by treating every interaction with respect and confidentiality.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#D20424]" />
              </div>
              <h3 className="text-xl font-bold text-[#D20424] mb-4">Compassion First</h3>
              <p className="text-gray-600 leading-relaxed">
                We celebrate diversity and are committed to creating mental health services that are accessible and welcoming to people of all backgrounds and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#D20424] mb-4">Meet Our Team</h2>
          <p className="text-xl text-center text-gray-700 mb-16">
            Our diverse team of licensed professionals brings extensive experience and specialized expertise to support your unique needs.
          </p>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="w-1/3 flex-shrink-0 px-4">
                    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                          <p className="text-gray-200">{member.designation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.max(1, teamMembers.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentSlide === index ? 'bg-[#D20424]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section id="media" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#D20424] mb-8">Media</h2>
          <p className="text-xl text-gray-700 mb-8">
            Stay updated with our latest news, press releases, and media coverage.
          </p>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-600">Media content will be updated soon.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#D20424] mb-8">Contact</h2>
          <p className="text-xl text-gray-700 mb-8">
            Get in touch with us for any inquiries or support.
          </p>
          <div className="bg-white rounded-lg p-12">
            <p className="text-gray-600">Contact information will be updated soon.</p>
          </div>
        </div>
      </section>

      {/* Work With Us Section */}
      <section id="work-with-us" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#D20424] mb-8">Work With Us</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join our team and make a difference in mental health care.
          </p>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-600">Career opportunities will be posted soon.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;