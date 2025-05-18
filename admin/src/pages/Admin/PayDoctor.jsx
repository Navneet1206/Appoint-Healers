// admin/src/pages/Admin/PayDoctor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PayDoctor = ({ aToken }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching from:", `${import.meta.env.VITE_BACKEND_URL}/api/admin/pending-payments`);
      console.log("Using token:", aToken);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/pending-payments`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        toast.error(response.data.message || "Failed to fetch pending payments");
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Fetch Pending Payments Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        if (typeof error.response.data === "string" && error.response.data.startsWith("<!DOCTYPE")) {
          setError("Received HTML instead of JSON. Check backend URL or route configuration.");
        } else {
          setError(error.response.data.message || "Server error");
        }
      } else {
        setError(error.message || "Network error");
      }
      toast.error("Error fetching pending payments: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePaymentToDoctor = async (appointmentId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/initiate-payment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (response.data.success) {
        toast.success("Payment initiated successfully");
        fetchPendingPayments();
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Initiate Payment Error:", error);
      toast.error("Error initiating payment: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchPendingPayments();
    } else {
      setError("Authentication token missing");
      toast.error("Authentication token missing");
    }
  }, [aToken]);

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-4">Pending Doctor Payments</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : appointments.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Patient</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Date & Time</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="p-2">{app.userData?.name || "Unknown"}</td>
                  <td className="p-2">{app.docData?.name || "Unknown"}</td>
                  <td className="p-2">{`${app.slotDate} ${app.slotTime}`}</td>
                  <td className="p-2">₹{app.discountedAmount || app.originalAmount}</td>
                  <td className="p-2">
                    <button
                      onClick={() => initiatePaymentToDoctor(app._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                      disabled={isLoading}
                    >
                      Pay Doctor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending payments found</p>
      )}
    </div>
  );
};

export default PayDoctor;