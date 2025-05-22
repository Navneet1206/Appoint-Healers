import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AllTransactions = () => {
  const { aToken } = useContext(AdminContext);
  const { backendUrl } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axios.get(`${backendUrl}/api/admin/all-transactions`, {
        headers: { aToken },
      });
      if (data.success) {
        // Ensure transactions is an array and filter out invalid entries
        const validTransactions = Array.isArray(data.transactions)
          ? data.transactions.filter(txn => txn && typeof txn === 'object')
          : [];
        setTransactions(validTransactions);
      } else {
        toast.error(data.message || "Failed to load transactions");
      }
    } catch (error) {
      setError("Error loading transactions: " + error.message);
      toast.error("Error loading transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchTransactions();
    }
  }, [aToken]);

  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      (txn.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (txn.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (txn.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (txn.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (txn.doctorId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle transaction click to open modal
  const handleTransactionClick = (txn) => {
    setSelectedTransaction(txn);
  };

  // Close modal
  const closeModal = () => {
    setSelectedTransaction(null);
  };

  // Format amount safely
  const formatAmount = (amount) => {
    return typeof amount === 'number' && !isNaN(amount) ? `₹${amount.toFixed(2)}` : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 font-sans">
      <div className="max-w-full mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          All Transactions
        </h1>

        {/* Search and Filter Controls */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by ID, user, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[65vh]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Transaction ID</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">User</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">User Email</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Doctor</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Doctor Email</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Amount</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Status</th>
                      <th className="p-2 sm:p-3 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn, index) => (
                      <tr
                        key={txn._id}
                        onClick={() => handleTransactionClick(txn)}
                        className={`border-t ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors cursor-pointer`}
                      >
                        <td className="p-2 sm:p-3 truncate max-w-[100px] sm:max-w-[120px]">
                          {txn.transactionId || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 truncate max-w-[100px]">{txn.userId?.name || "N/A"}</td>
                        <td className="p-2 sm:p-3 truncate max-w-[120px] sm:max-w-[150px)">
                          {txn.userId?.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 truncate max-w-[100px]">{txn.doctorId?.name || "N/A"}</td>
                        <td className="p-2 sm:p-3 truncate max-w-[120px] sm:max-w-[150px]">
                          {txn.doctorId?.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3">{formatAmount(txn.amount)}</td>
                        <td className="p-2 sm:p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              txn.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : txn.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {txn.status || "N/A"}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3">
                          {txn.timestamp ? new Date(txn.timestamp).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn._id}
                  onClick={() => handleTransactionClick(txn)}
                  className="bg-white p-3 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-700 truncate max-w-[60%]">
                      ID: {txn.transactionId || "N/A"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status || "N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-medium">User:</span> {txn.userId?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-medium">User Email:</span> {txn.userId?.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-medium">Doctor:</span> {txn.doctorId?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-medium">Doctor Email:</span> {txn.doctorId?.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Amount:</span> {formatAmount(txn.amount)}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {txn.timestamp ? new Date(txn.timestamp).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-gray-500 text-sm">No transactions found.</p>
          </div>
        )}

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Transaction Details
              </h2>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {selectedTransaction.transactionId || "N/A"}
                </p>
                <p>
                  <span className="font-medium">User:</span>{" "}
                  {selectedTransaction.userId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">User Email:</span>{" "}
                  {selectedTransaction.userId?.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  {selectedTransaction.doctorId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Doctor Email:</span>{" "}
                  {selectedTransaction.doctorId?.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {formatAmount(selectedTransaction.amount)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTransaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : selectedTransaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTransaction.status || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {selectedTransaction.timestamp
                    ? new Date(selectedTransaction.timestamp).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;