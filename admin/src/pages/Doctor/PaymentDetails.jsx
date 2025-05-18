import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentDetails = ({ dToken, doctorId }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    bankAccount: { accountNumber: "", ifscCode: "", accountHolderName: "" },
    upiId: "",
  });

  const fetchPaymentDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/payment-details`,
        { headers: { dToken } }
      );
      if (data.success && data.paymentDetails) {
        setPaymentDetails(data.paymentDetails);
      }
    } catch (error) {
      toast.error("Error fetching payment details");
    }
  };

  const updatePaymentDetails = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/update-payment-details`,
        { docId: doctorId, paymentDetails },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success("Payment details updated");
        setIsEdit(false);
        fetchPaymentDetails();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating payment details");
    }
  };

  useEffect(() => {
    if (dToken) fetchPaymentDetails();
  }, [dToken]);

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {isEdit ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bank Account Number"
              value={paymentDetails.bankAccount.accountNumber}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  bankAccount: { ...paymentDetails.bankAccount, accountNumber: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={paymentDetails.bankAccount.ifscCode}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  bankAccount: { ...paymentDetails.bankAccount, ifscCode: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Account Holder Name"
              value={paymentDetails.bankAccount.accountHolderName}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  bankAccount: { ...paymentDetails.bankAccount, accountHolderName: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="UPI ID"
              value={paymentDetails.upiId}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={updatePaymentDetails}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEdit(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p>Bank Account: {paymentDetails.bankAccount.accountNumber || "Not set"}</p>
            <p>IFSC Code: {paymentDetails.bankAccount.ifscCode || "Not set"}</p>
            <p>Holder Name: {paymentDetails.bankAccount.accountHolderName || "Not set"}</p>
            <p>UPI ID: {paymentDetails.upiId || "Not set"}</p>
            <button
              onClick={() => setIsEdit(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;