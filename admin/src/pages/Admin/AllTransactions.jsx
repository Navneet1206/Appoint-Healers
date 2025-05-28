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
        const validTransactions = Array.isArray(data.transactions)
          ? data.transactions.filter((txn) => txn && typeof txn === "object")
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
    console.log("Transaction:", txn); // Debug: Log each transaction to inspect structure
    const searchLower = searchTerm.trim().toLowerCase();
    const matchesSearch = searchLower === "" || (
      (txn.transactionId && String(txn.transactionId).toLowerCase().includes(searchLower)) ||
      (txn.userId && txn.userId.name && String(txn.userId.name).toLowerCase().includes(searchLower)) ||
      (txn.userId && txn.userId.email && String(txn.userId.email).toLowerCase().includes(searchLower)) ||
      (txn.doctorId && txn.doctorId.name && String(txn.doctorId.name).toLowerCase().includes(searchLower)) ||
      (txn.doctorId && txn.doctorId.email && String(txn.doctorId.email).toLowerCase().includes(searchLower))
    );
    const matchesStatus = statusFilter === "all" || (
      txn.status && String(txn.status).toLowerCase() === statusFilter.toLowerCase()
    );
    console.log("Search Term:", searchLower, "Status Filter:", statusFilter, "Matches:", { matchesSearch, matchesStatus }); // Debug: Log filter results
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
    return typeof amount === "number" && !isNaN(amount) ? `₹${amount.toFixed(2)}` : "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          All Transactions
        </h1>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Transactions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by ID, User, or Doctor
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D20424] focus:border-[#D20424] outline-none text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D20424]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 font-semibold text-gray-700">Transaction ID</th>
                      <th className="p-4 font-semibold text-gray-700">User</th>
                      <th className="p-4 font-semibold text-gray-700">User Email</th>
                      <th className="p-4 font-semibold text-gray-700">Doctor</th>
                      <th className="p-4 font-semibold text-gray-700">Doctor Email</th>
                      <th className="p-4 font-semibold text-gray-700">Amount</th>
                      <th className="p-4 font-semibold text-gray-700">Status</th>
                      <th className="p-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn, index) => (
                      <tr
                        key={txn._id}
                        onClick={() => handleTransactionClick(txn)}
                        className={`border-t ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors cursor-pointer`}
                      >
                        <td className="p-4 truncate max-w-[120px]">
                          {txn.transactionId || "N/A"}
                        </td>
                        <td className="p-4 truncate max-w-[100px]">
                          {txn.userId?.name || "N/A"}
                        </td>
                        <td className="p-4 truncate max-w-[150px]">
                          {txn.userId?.email || "N/A"}
                        </td>
                        <td className="p-4 truncate max-w-[100px]">
                          {txn.doctorId?.name || "N/A"}
                        </td>
                        <td className="p-4 truncate max-w-[150px]">
                          {txn.doctorId?.email || "N/A"}
                        </td>
                        <td className="p-4">{formatAmount(txn.amount)}</td>
                        <td className="p-4">
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
                        <td className="p-4">
                          {txn.timestamp
                            ? new Date(txn.timestamp).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn._id}
                  onClick={() => handleTransactionClick(txn)}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm text-gray-800 truncate max-w-[60%]">
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
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">User:</span> {txn.userId?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">Doctor:</span> {txn.doctorId?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Amount:</span> {formatAmount(txn.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {txn.timestamp
                      ? new Date(txn.timestamp).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-sm">No transactions found.</p>
          </div>
        )}

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto relative">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Transaction Details
              </h2>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
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
              <div className="space-y-4 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Transaction ID:</span>{" "}
                  <span className="text-gray-800">{selectedTransaction.transactionId || "N/A"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">User:</span>{" "}
                  <span className="text-gray-800">{selectedTransaction.userId?.name || "N/A"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">User Email:</span>{" "}
                  <span className="text-gray-800">{selectedTransaction.userId?.email || "N/A"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Doctor:</span>{" "}
                  <span className="text-gray-800">{selectedTransaction.doctorId?.name || "N/A"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Doctor Email:</span>{" "}
                  <span className="text-gray-800">{selectedTransaction.doctorId?.email || "N/A"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Amount:</span>{" "}
                  <span className="text-gray-800">{formatAmount(selectedTransaction.amount)}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Status:</span>{" "}
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
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  <span className="text-gray-800">
                    {selectedTransaction.timestamp
                      ? new Date(selectedTransaction.timestamp).toLocaleString()
                      : "N/A"}
                  </span>
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-[#D20424] text-white rounded-full hover:bg-[#b8031f] transition-colors duration-200 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;