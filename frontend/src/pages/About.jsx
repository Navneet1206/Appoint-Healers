import React from "react";
import { Heart, Star, Clock, Award, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="relati overflow-hidden w-full py-24">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-30 -ml-40 -mb-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center bg-pink-100 p-3 rounded-full mb-6">
              <Heart className="text-pink-600 w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-rose-900 mb-6">About Savayas Heal</h1>
            <p className="text-xl text-rose-700 mb-12 max-w-3xl mx-auto">
              Discover our journey, our mission, and the passionate team committed to your mental well-being
            </p>
          </div>
        </div>
      </div>

      {/* OUR STORY SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="mb-6 inline-block">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Clock className="text-pink-600 w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-pink-800 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Savayas Heal was founded in 2018 with a simple yet powerful vision: to create a sanctuary where people could find compassionate mental health support without judgment or stigma.
                </p>
                <p className="text-gray-600 mb-4">
                  What began as a small practice with just two dedicated therapists has blossomed into a comprehensive wellness center with a team of diverse specialists united by a common purpose—to help people heal, grow, and thrive.
                </p>
                <p className="text-gray-600">
                  Our journey has been shaped by the thousands of individuals who have trusted us with their stories. Each person who walks through our doors inspires us to continually evolve our approaches while staying true to our core values of empathy, respect, and genuine care.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-pink-200 rounded-3xl overflow-hidden relative">
                  <div className="absolute inset-0 opacity-30 bg-pink-100" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-pink-800 mb-4">5+</div>
                      <p className="text-xl text-pink-600">Years of dedicated service</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-800 mb-2">2,500+</div>
                    <p className="text-pink-600">Lives touched</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION SECTION */}
      <section className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center bg-pink-100 p-3 rounded-full mb-6">
                <Star className="text-pink-600 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-pink-800 mb-6">Our Mission & Values</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                At Savayas Heal, we're guided by a clear mission and a set of values that inform everything we do.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-16">
              <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">Our Mission</h3>
              <p className="text-xl text-center text-gray-600 max-w-4xl mx-auto font-light italic">
                "To provide compassionate, accessible mental health care that empowers individuals to navigate life's challenges, foster meaningful connections, and achieve lasting well-being."
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="bg-pink-100 p-4 rounded-full inline-flex mb-6">
                  <Heart className="text-pink-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Compassion First</h3>
                <p className="text-gray-600">
                  We approach every individual with genuine empathy and understanding, creating a safe space where healing can begin.
                </p>
              </div>
              
              {/* Value 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="bg-pink-100 p-4 rounded-full inline-flex mb-6">
                  <Shield className="text-pink-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Integrity & Trust</h3>
                <p className="text-gray-600">
                  We maintain the highest ethical standards and honor the trust placed in us by treating every interaction with respect and confidentiality.
                </p>
              </div>
              
              {/* Value 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="bg-pink-100 p-4 rounded-full inline-flex mb-6">
                  <Users className="text-pink-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Inclusive Support</h3>
                <p className="text-gray-600">
                  We celebrate diversity and are committed to creating mental health services that are accessible and welcoming to people of all backgrounds and experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR TEAM SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center bg-pink-100 p-3 rounded-full mb-6">
                <Users className="text-pink-600 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-pink-800 mb-6">Meet Our Team</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our diverse team of licensed professionals brings extensive experience and specialized expertise to support your unique needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-64 bg-pink-200 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-900/50 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">Dr. Sarah Johnson</h3>
                    <p className="text-pink-100">Founder & Clinical Director</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    With over 15 years of experience in trauma-informed therapy, Dr. Johnson leads our team with compassion and expertise.
                  </p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">Trauma Recovery</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">EMDR</span>
                  </div>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-64 bg-pink-200 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-900/50 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">Michael Chen, LMFT</h3>
                    <p className="text-pink-100">Relationship Specialist</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Michael specializes in helping couples rebuild trust and strengthen communication through evidence-based approaches.
                  </p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">Couples Therapy</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">Family Systems</span>
                  </div>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-64 bg-pink-200 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-900/50 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">Amara Patterson, PhD</h3>
                    <p className="text-pink-100">Anxiety & Depression Specialist</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Dr. Patterson combines cognitive-behavioral techniques with mindfulness practices to help clients manage anxiety and depression.
                  </p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">CBT</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">Mindfulness</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button className="inline-flex items-center px-8 py-4 bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-800 font-semibold rounded-full transition-all duration-300 shadow-md">
                Meet Our Full Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OUR APPROACH SECTION */}
      <section className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="aspect-video bg-white p-8 rounded-3xl shadow-xl relative z-10">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="h-1/2 bg-pink-100 rounded-2xl p-6 flex items-center justify-center">
                          <div className="text-center">
                            <Shield className="text-pink-500 w-10 h-10 mx-auto mb-2" />
                            <p className="text-pink-700 font-medium">Safe Environment</p>
                          </div>
                        </div>
                        <div className="h-1/2 bg-pink-100 rounded-2xl p-6 flex items-center justify-center">
                          <div className="text-center">
                            <Heart className="text-pink-500 w-10 h-10 mx-auto mb-2" />
                            <p className="text-pink-700 font-medium">Personalized Care</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-1/2 bg-pink-100 rounded-2xl p-6 flex items-center justify-center">
                          <div className="text-center">
                            <Users className="text-pink-500 w-10 h-10 mx-auto mb-2" />
                            <p className="text-pink-700 font-medium">Holistic Methods</p>
                          </div>
                        </div>
                        <div className="h-1/2 bg-pink-100 rounded-2xl p-6 flex items-center justify-center">
                          <div className="text-center">
                            <Award className="text-pink-500 w-10 h-10 mx-auto mb-2" />
                            <p className="text-pink-700 font-medium">Evidence-Based</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-8 left-8 w-full h-full bg-pink-300 rounded-3xl -z-10" />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="inline-block mb-6">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Award className="text-pink-600 w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-pink-800 mb-6">Our Approach</h2>
                <p className="text-gray-600 mb-4">
                  At Savayas Heal, we believe that effective mental health care must be as unique as the individuals we serve. Our approach combines evidence-based therapeutic techniques with a deeply humanistic philosophy.
                </p>
                <p className="text-gray-600 mb-4">
                  We recognize that healing isn't one-size-fits-all, which is why we integrate various modalities—from cognitive behavioral therapy to mindfulness practices—tailored to your specific needs and goals.
                </p>
                <p className="text-gray-600 mb-8">
                  Our practitioners stay at the forefront of mental health research while remaining grounded in the timeless wisdom that human connection is at the heart of all healing.
                </p>
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full transition-all duration-300 hover:from-rose-600 hover:to-pink-600 shadow-md">
                  Learn About Our Methods
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center bg-pink-100 p-3 rounded-full mb-6">
                <Star className="text-pink-600 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-pink-800 mb-6">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The stories of transformation from those we've worked with inspire us every day.
              </p>
            </div>
            
            <div className="bg-pink-50 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                      AJ
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Alex J.</h4>
                      <div className="flex text-pink-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "Working with the team at Savayas Heal changed my life. Their compassionate approach helped me work through years of anxiety that I thought would never go away."
                  </p>
                </div>
                
                {/* Testimonial 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                      MM
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Morgan M.</h4>
                      <div className="flex text-pink-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "The relationship counseling my partner and I received was transformative. We learned communication skills that we use every day and our relationship is stronger than ever."
                  </p>
                </div>
                
                {/* Testimonial 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold mr-4">
                      KL
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Kelly L.</h4>
                      <div className="flex text-pink-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "I was hesitant to try therapy, but the team made me feel so comfortable from day one. Their non-judgmental approach was exactly what I needed."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN OUR COMMUNITY CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-pink-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -ml-40 -mb-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Begin Your Journey With Us</h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Take the first step toward healing and growth. Our compassionate team is ready to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-pink-600 font-bold rounded-full hover:bg-pink-100 transition-all duration-300 shadow-lg">
                Schedule a Consultation
              </button>
              <button className="px-8 py-4 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-700 transition-all duration-300 border border-white/30 shadow-lg">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-pink-900 text-white py-12 px-4">
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
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Meet the Team</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Our Approach</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Testimonials</a></li>
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
      </footer>
    </>
  );
}