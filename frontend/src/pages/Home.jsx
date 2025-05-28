import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Hero from '../components/Landing/Hero';
import WhySavayas from '../components/Landing/WhySavayas';
import HelpFormToggle from '../components/Landing/HelpFormToggle';
export default function Home() {
  

  return (


    <>
      <Hero />
    <WhySavayas />
    <section className="py-10 px-4 md:px-16 bg-white">
  <h2 className="text-3xl font-bold text-[#7c0a26] mb-2">What We Offer?</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    {[
      {
        icon: '👤', // Replace with your SVG or component
        title: 'Professional therapists',
        desc: 'Professionally trained therapists, here to support your mental wellness journey',
      },
      {
        icon: '👂',
        title: 'Active Listeners',
        desc: 'Compassionate listeners who understand without judgment or interruption',
      },
      {
        icon: '💞',
        title: 'Relationship Help',
        desc: 'Navigate love, conflict, and communication with professional relationship support.',
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow border p-6 text-center"
      >
        <div className="text-5xl text-[#7c0a26] mb-4">{item.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm">{item.desc}</p>
      </div>
    ))}
  </div>
</section>
<section className="py-10 px-4 md:px-16 bg-gray-50">
  <h2 className="text-3xl font-bold text-[#7c0a26] mb-2">What are you suffering with ?</h2>
  <p className="text-gray-700 text-lg mb-6">
    Our team specializes in treating a wide range of mental health conditions with evidence-based approaches.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[
      {
        title: 'Depression',
        desc: 'Persistent sadness, low energy, and loss of interest.',
        hasIcon: false,
      },
      {
        title: 'Anxiety Disorders',
        desc: 'Connect with licensed therapists from the comfort of your home through secure video sessions.',
        hasIcon: true,
      },
      {
        title: 'Bipolar Disorder',
        desc: 'Connect with licensed therapists from the comfort of your home through secure video sessions.',
        hasIcon: true,
      },
      {
        title: 'OCD',
        desc: 'Connect with licensed therapists from the comfort of your home through secure video sessions.',
        hasIcon: true,
      },
      {
        title: 'Eating Disorders',
        desc: 'Connect with licensed therapists from the comfort of your home through secure video sessions.',
        hasIcon: true,
      },
      {
        title: 'Substance Use Disorders',
        desc: 'Connect with licensed therapists from the comfort of your home through secure video sessions.',
        hasIcon: true,
      },
    ].map((item, idx) => (
      <div key={idx} className="bg-white rounded-2xl shadow border p-5 text-center">
        {item.hasIcon && (
          <div className="text-4xl text-[#7c0a26] mb-4">📹</div> // Replace with video icon SVG
        )}
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-gray-600 text-sm">{item.desc}</p>
        <p className="text-red-500 font-medium mt-2 text-sm">see more →</p>
      </div>
    ))}
  </div>
</section>
 <section className="bg-[#f9f3f3] py-12 px-4 md:px-16 lg:px-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#D20424] animate-fadeInUp">
          When they need help, you don’t have to do it alone.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <div className="text-gray-800 space-y-6 animate-fadeInLeft">
          <p>
            We understand how overwhelming and heartbreaking it can be to see
            someone you care about struggle with their mental health—whether
            it’s anxiety that makes everyday tasks feel impossible, depression
            that dims the joy in life, or a personality disorder that causes
            emotional turmoil and relationship challenges. These struggles are
            real, and no one should have to face them alone.
          </p>
          <p>
            Getting the right support is not just the first step—it’s a
            powerful move toward healing, hope, and recovery. At Savayas Heal,
            we believe in compassionate, personalized care. Whether you're
            seeking help for yourself or standing by a loved one, our dedicated
            mental health consultants are here to walk with you, offering
            expert guidance and connecting you to the best therapy, tools, and
            resources to support long-term well-being.
          </p>
          <p className="italic">
            “You’re not alone—and neither are they. Let’s take that first step
            together.”
          </p>
        </div>

        {/* Image Section */}
        <div className="flex justify-center animate-fadeInRight">
          <img
            src="/mnt/data/0cbe699f-6250-48c2-b4ee-8bd6aec75a85.png"
            alt="Support"
            className="rounded-xl shadow-lg max-h-[350px] w-auto"
          />
        </div>
      </div>
      <div className="flex justify-center mt-10 animate-bounce">
        <div className="text-[#D20424] text-3xl">⌄</div>
      </div>
    </section>
<HelpFormToggle />
    </>
  );
}