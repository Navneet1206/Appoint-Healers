// src/components/WhySavayas.jsx
import React from "react";

const WhySavayas = () => {
  return (
    <section className="w-full bg-[#f9f6f6] py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
      {/* Left Text Content */}
      <div className="md:w-1/2 animate-slideInLeft">
        <h2 className="text-[#D20424] text-4xl font-bold mb-4">Why Savayas?</h2>
        <p className="text-xl font-semibold text-gray-800 mb-10">
          Because at Savayas, your well-being is our priority—anytime, anywhere.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-blue-800">Personalized Care</h3>
            <p className="text-gray-700">
              We listen, we understand, we personalize your healing journey{" "}
              <span className="text-[#D20424] cursor-pointer">see more→</span>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800">Safe & Secure</h3>
            <p className="text-gray-700">
              Because healing needs trust—your safety is never compromised here{" "}
              <span className="text-[#D20424] cursor-pointer">see more→</span>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800">Affordable</h3>
            <p className="text-gray-700">
              We believe everyone deserves care that’s affordable and effective{" "}
              <span className="text-[#D20424] cursor-pointer">see more→</span>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800">Certified & professional team</h3>
            <p className="text-gray-700">
              Expert care from certified professionals you can trust completely{" "}
              <span className="text-[#D20424] cursor-pointer">see more→</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center animate-slideInRight">
        <img
          src="#"
         alt="Why Savayas"
          className="max-w-full h-auto rounded-xl shadow-md"
        />
      </div>
    </section>
  );
};

export default WhySavayas;
