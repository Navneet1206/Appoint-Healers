import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext'; // Adjust path as needed
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserTransactions = () => {
  const { uToken } = useContext(UserContext); // Assuming uToken for user auth
  const { backendUrl } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/transactions`, {
        headers: { uToken },
      });
      if (data.success) {
        setTransactions(data.transactions || []);
      } else {
        toast.error(data.message || 'Failed to load transactions');
      }
    } catch (error) {
      toast.error('Error loading transactions');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uToken) {
      fetchTransactions();
    }
  }, [uToken]);

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Transactions</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Transaction ID</th>
                  <th className="p-2">Doctor Name</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-t">
                    <td className="p-2">{txn.transactionId}</td>
                    <td className="p-2">{txn.doctorId?.name || 'N/A'}</td>
                    <td className="p-2">${txn.amount.toFixed(2)}</td>
                    <td className="p-2">{txn.status}</td>
                    <td className="p-2">{new Date(txn.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No transactions found.</p>
      )}
    </div>
  );
};

export default UserTransactions;