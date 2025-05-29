import React, { useState } from "react";

const contentData = [
  {
    title: "Personalized Care",
    short: "We listen, we understand, we personalize your healing journey.",
    full: "We listen, we understand, and we personalize your healing journey using modern therapeutic techniques tailored to your emotional and psychological needs.",
  },
  {
    title: "Safe & Secure",
    short: "Because healing needs trust—your safety is never compromised here.",
    full: "Because healing needs trust—your safety is never compromised here. Our platform is encrypted, and your sessions remain completely private and confidential.",
  },
  {
    title: "Affordable",
    short: "We believe everyone deserves care that’s affordable and effective.",
    full: "We believe everyone deserves care that’s affordable and effective. Our pricing is transparent and designed to be accessible for individuals from all walks of life.",
  },
  {
    title: "Certified & Professional Team",
    short: "Expert care from certified professionals you can trust completely.",
    full: "Expert care from certified professionals you can trust completely. Our team is composed of licensed therapists and counselors with years of real-world experience.",
  },
];

const WhySavayas = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <section className="w-full bg-[#f9f6f6] py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
      {/* Left Content */}
      <div className="md:w-1/2 animate-slideInLeft">
        <h2 className="text-[#D20424] text-4xl font-bold mb-4">Why Savayas?</h2>
        <p className="text-xl font-semibold text-gray-800 mb-10">
          Because at Savayas, your well-being is our priority—anytime, anywhere.
        </p>

        <div className="space-y-8">
          {contentData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border">
              <h3 className="text-xl font-bold text-blue-800">{item.title}</h3>
              <p className="text-gray-700 mt-1">
                {expanded === index ? item.full : item.short}{" "}
                <span
                  onClick={() => toggleExpand(index)}
                  className="text-[#D20424] font-medium cursor-pointer ml-2"
                >
                  {expanded === index ? "show less ←" : "see more →"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center animate-slideInRight">
        <img
          src="https://picsum.photos/seed/picsum/700/700"
          alt="Why Savayas"
          className="max-w-full h-auto rounded-2xl shadow-lg border border-gray-300"
        />
      </div>
    </section>
  );
};

export default WhySavayas;
