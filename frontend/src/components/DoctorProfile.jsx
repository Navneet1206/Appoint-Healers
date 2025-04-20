import React from "react";
import DoctorReviews from "./DoctorReviews";
import ReviewForm from "./ReviewForm";

const DoctorProfile = ({ doctor, appointment, userId }) => {
  const showReviewForm = appointment && appointment.status === "completed";

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-6">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{doctor.name}</h2>
          <p className="text-gray-600 mb-2">{doctor.speciality}</p>
          <p className="text-gray-600 mb-2">{doctor.degree}</p>
          <p className="text-gray-600 mb-4">{doctor.experience} years of experience</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.languages?.map((lang, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialists?.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-gray-600">
              <span className="font-medium">Mobile:</span> {doctor.mobile}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {doctor.email}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-600">{doctor.about}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-gray-600">{doctor.address}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Consultation Fee</h3>
            <p className="text-gray-600">₹{doctor.fees}</p>
          </div>
        </div>
      </div>

      <DoctorReviews doctorId={doctor._id} />

      {showReviewForm && (
        <div className="mt-8">
          <ReviewForm
            appointmentId={appointment._id}
            doctorId={doctor._id}
            userId={userId}
            onReviewSubmitted={() => window.location.reload()}
          />
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;