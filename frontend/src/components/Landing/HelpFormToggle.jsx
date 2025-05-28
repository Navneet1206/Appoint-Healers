import React, { useState } from "react";

const HelpFormToggle = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-10">
      {/* Left Side (Text & Form) */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Need help for someone you care about?
        </h2>
        <p className="text-gray-700 mb-6">
          We know how hard it is to watch someone you care about struggling.
          Finding the right care is the first step. If you want guidance on the
          best mental health support for yourself or a loved one, a Savayas Heal
          Care Consultant can help you.
        </p>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#D20424] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700"
          >
            CONNECT WITH US
          </button>
        ) : (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Your Email*"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <div className="flex gap-2">
              <div className="w-1/4">
                <input
                  type="text"
                  value="+91"
                  disabled
                  className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <input
                type="tel"
                placeholder="Mobile Number*"
                className="w-3/4 p-3 border border-gray-300 rounded"
              />
            </div>
            <input
              type="number"
              placeholder="Age of Patient"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-[#D20424] text-white py-3 rounded-full font-semibold hover:bg-red-700"
            >
              SUBMIT
            </button>
          </form>
        )}
      </div>

      {/* Right Side (Image) */}
      <div className="md:w-1/2 mb-6 md:mb-0">
        <img
          src="https://via.placeholder.com/500x350?text=Support+Image"
          alt="Support"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default HelpFormToggle;
