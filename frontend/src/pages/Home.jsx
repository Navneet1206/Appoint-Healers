import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Headphones, CalendarCheck, Compass, Footprints } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Updated with animated elements and better spacing */}
      <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full opacity-30 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200 rounded-full opacity-30 -ml-40 -mb-40" />
        
        <main className="relative z-10">
          <section className="relative h-screen flex items-center justify-center text-center px-4">
            <div className="max-w-5xl mx-auto">
              <div className="relative z-10">
                <div className="mb-4 flex justify-center">
                  <Heart className="text-rose-500 w-16 h-16 animate-pulse" />
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-rose-900 mb-6 tracking-tight">
                  Savayas Heal
                </h1>
                <p className="text-2xl md:text-4xl text-rose-700 font-light mb-12">
                  We don't judge<span className="mx-3 text-pink-400">•</span>We emphasize
                </p>
                <div className="space-y-4">
                  <Link to="/professional" >
                  <button
                    className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-semibold text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 hover:scale-105 shadow-lg shadow-pink-200"
                    >
                    Start Your Journey 
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:ml-4 transition-all" />
                  </button>
                    </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* OUR SERVICES SECTION - Updated with cleaner cards and hover effects */}
      <section className="px-4 py-24 bg-pink-50 w-full" id="services">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="text-pink-600 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-pink-800 mb-4">
            Our Compassionate Services
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-lg">
            Discover how we can support your mental and emotional well-being
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto">
          {/* Service 1: Counseling */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="h-48 bg-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/30" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Heart className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Counseling</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Expert guidance through life's challenges with compassionate support and personalized strategies.
              </p>
                <Link to="/professional/Counseling%20professional" className="ml-2 w-4 h-4" >
              <button className="w-full flex items-center justify-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
                </Link>
            </div>
          </div>

          {/* Service 2: Relationship Therapy */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="h-48 bg-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/30" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Users className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Relationship Therapy</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Strengthen bonds and build deeper connections with professional guidance and effective communication tools.
              </p>
              <Link to="/professional/Relational%20therapist" className="ml-2 w-4 h-4" >
              <button className="w-full flex items-center justify-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              </Link>
            </div>
          </div>

          {/* Service 3: Listening Services */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="h-48 bg-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/30" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Headphones className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Listening Services</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                A safe space to share your thoughts without judgment or pressure, with full confidentiality.
              </p>
              <Link to="/professional/Listeners" className="ml-2 w-4 h-4" >
              <button className="w-full flex items-center justify-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Upgraded with process flow design */}
      <section className="px-4 py-24 bg-white w-full">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Footprints className="text-pink-600 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-pink-800 mb-4">
            How It Works
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-lg">
            Simple steps to start your journey toward better mental well-being
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Steps with connecting lines */}
          <div className="relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-pink-200 -translate-x-1/2 z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center mb-16 gap-8">
              <div className="md:w-1/2 md:text-right">
                <h3 className="text-2xl font-bold text-pink-800 mb-3">Get Started</h3>
                <p className="text-gray-600">
                  Contact us to schedule your initial consultation - we'll help you find the right support for your needs.
                </p>
              </div>
              <div className="bg-white border-4 border-pink-300 rounded-full w-16 h-16 flex items-center justify-center mx-4 z-20 shadow-lg">
                <CalendarCheck className="text-pink-500 w-8 h-8" />
              </div>
              <div className="md:w-1/2">
                <Link to="/professional" >
                <button className="inline-flex items-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                  Schedule Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
                </Link>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-16 gap-8">
              <div className="md:w-1/2 md:text-left">
                <h3 className="text-2xl font-bold text-pink-800 mb-3">Choose Your Path</h3>
                <p className="text-gray-600">
                  Explore our services and select the approach that resonates most with your situation and goals.
                </p>
              </div>
              <div className="bg-white border-4 border-pink-300 rounded-full w-16 h-16 flex items-center justify-center mx-4 z-20 shadow-lg">
                <Compass className="text-pink-500 w-8 h-8" />
              </div>
              <div className="md:w-1/2 md:text-right">
                <button className="inline-flex items-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                  Explore Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <h3 className="text-2xl font-bold text-pink-800 mb-3">Begin Your Journey</h3>
                <p className="text-gray-600">
                  Start your sessions and begin building healthier patterns with our professional guidance.
                </p>
              </div>
              <div className="bg-white border-4 border-pink-300 rounded-full w-16 h-16 flex items-center justify-center mx-4 z-20 shadow-lg">
                <Footprints className="text-pink-500 w-8 h-8" />
              </div>
              <div className="md:w-1/2">
                <button className="inline-flex items-center px-6 py-3 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300">
                  Start Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - New addition */}
      <section className="px-4 py-24 bg-pink-50 w-full">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="text-pink-600 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-pink-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-lg">
            Real stories from people we've helped on their journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                JM
              </div>
              <div>
                <h4 className="font-semibold text-lg">Jamie M.</h4>
                <p className="text-gray-500 text-sm">Counseling Client</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "The compassionate approach at Savayas Heal helped me navigate through one of the most difficult periods of my life. I'm forever grateful."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                RL
              </div>
              <div>
                <h4 className="font-semibold text-lg">Rachel L.</h4>
                <p className="text-gray-500 text-sm">Relationship Therapy</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "My partner and I were on the verge of separation. The guidance we received helped us rebuild our relationship stronger than ever before."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                TK
              </div>
              <div>
                <h4 className="font-semibold text-lg">Taylor K.</h4>
                <p className="text-gray-500 text-sm">Listening Services</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Sometimes you just need someone to truly listen. The team at Savayas provided that safe space when I needed it most."
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CTA SECTION - New addition */}
      <section className="px-4 py-24 bg-white w-full">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -ml-40 -mb-40" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Healing Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take the first step towards a healthier mind and heart. Our compassionate team is here to support you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-pink-600 font-bold rounded-full hover:bg-pink-100 transition-all duration-300 shadow-lg">
                Schedule Consultation
              </button>
              <button className="px-8 py-4 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-700 transition-all duration-300 border border-white/30 shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - New addition */}
      {/* <footer className="bg-pink-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Savayas Heal</h3>
            <p className="text-pink-200 mb-4">
              Compassionate mental health services to guide you on your journey to wellness.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Counseling</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Relationship Therapy</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Listening Services</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Group Sessions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Podcasts</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Guides</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-pink-200">info@savayasheal.com</li>
              <li className="text-pink-200">(555) 123-4567</li>
              <li className="text-pink-200">123 Healing St, Wellness City</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-pink-800 text-center text-pink-300">
          <p>© {new Date().getFullYear()} Savayas Heal. All rights reserved.</p>
        </div>
      </footer> */}
    </>
  );
}