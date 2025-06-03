import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const RefundManagement = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [refundRequests, setRefundRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRefundRequests = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/refund-requests`, {
        headers: { aToken },
      });
      if (data.success) {
        setRefundRequests(data.refundRequests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching refund requests");
    }
    setIsLoading(false);
  };

  const processRefund = async (refundRequestId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/process-refund`,
        { refundRequestId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchRefundRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error processing refund");
    }
  };

  useEffect(() => {
    if (aToken) fetchRefundRequests();
  }, [aToken]);

  return (
    <div className="m-5">
      <h1 className="text-2xl font-medium">Refund Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : refundRequests.length > 0 ? (
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">User</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Date & Time</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {refundRequests.map((request) => (
              <tr key={request._id}>
                <td className="border p-2">{request.userId.name}</td>
                <td className="border p-2">{request.doctorId.name}</td>
                <td className="border p-2">{`${request.appointmentId.slotDate} ${request.appointmentId.slotTime}`}</td>
                <td className="border p-2">₹{request.amount}</td>
                <td className="border p-2">
                  <button
                    onClick={() => processRefund(request._id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Process Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending refund requests.</p>
      )}
    </div>
  );
};

export default RefundManagement;