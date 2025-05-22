import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Edit, X, Save, Trash, Filter } from 'lucide-react';

// Date & Time pickers
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const DoctorSlots = () => {
  const { backendUrl } = useContext(AppContext);
  const { dToken } = useContext(DoctorContext);

  // Loader state
  const [isLoading, setIsLoading] = useState(false);

  // State for new slot creation
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState('10:00');
  const [newDescription, setNewDescription] = useState('');

  // State for bulk slot creation
  const [bulkStartDate, setBulkStartDate] = useState(new Date());
  const [bulkEndDate, setBulkEndDate] = useState(new Date());
  const [bulkStartTime, setBulkStartTime] = useState('09:00');
  const [bulkEndTime, setBulkEndTime] = useState('17:00');
  const [bulkDays, setBulkDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });
  const [bulkDescription, setBulkDescription] = useState('');

  // Fetched slots and filter
  const [slots, setSlots] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  // Editing states
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Filter options
  const statusOptions = ['All', 'Active', 'Booked', 'Cancelled', 'Coming Soon'];

  // On load, fetch the slots
  useEffect(() => {
    if (dToken) {
      fetchSlots();
    }
  }, [dToken]);

  // Function to fetch all slots
  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/slots`,
        { docId: '' },
        { headers: { dToken } }
      );
      setIsLoading(false);
      if (data.success) {
        setSlots(data.slots);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Error fetching slots');
    }
  };

  // Create new slot
  const createSlotHandler = async (e) => {
    e.preventDefault();

    if (!newDate || !newTime) {
      toast.error('Please select both date and time');
      return;
    }

    const dd = String(newDate.getDate()).padStart(2, '0');
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const yyyy = newDate.getFullYear();
    const slotDate = `${dd}_${mm}_${yyyy}`;
    const slotTime = newTime;

    try {
      setIsLoading(true);
      const payload = {
        slotDate,
        slotTime,
        description: newDescription,
        docId: '',
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/create-slot`, payload, { headers: { dToken } });
      setIsLoading(false);

      if (data.success) {
        toast.success(data.message);
        setNewDate(new Date());
        setNewTime('10:00');
        setNewDescription('');
        fetchSlots();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Error creating slot');
    }
  };

  // Create bulk slots
  const createBulkSlotsHandler = async (e) => {
    e.preventDefault();

    if (!bulkStartDate || !bulkEndDate || !bulkStartTime || !bulkEndTime) {
      toast.error('Please select start date, end date, start time, and end time');
      return;
    }

    // Validate dates
    if (bulkStartDate < new Date().setHours(0, 0, 0, 0)) {
      toast.error('Start date cannot be before today');
      return;
    }

    if (bulkEndDate < bulkStartDate) {
      toast.error('End date cannot be before start date');
      return;
    }

    // Validate at least one day is selected
    const selectedDays = Object.values(bulkDays).some(day => day);
    if (!selectedDays) {
      toast.error('Please select at least one day');
      return;
    }

    // Parse times
    const startHour = parseInt(bulkStartTime.split(':')[0]);
    const startMinute = parseInt(bulkStartTime.split(':')[1]);
    const endHour = parseInt(bulkEndTime.split(':')[0]);
    const endMinute = parseInt(bulkEndTime.split(':')[1]);

    // Convert times to minutes for easier calculation
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;

    if (endTimeMinutes <= startTimeMinutes) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setIsLoading(true);
      const slotsToCreate = [];

      // Loop through each date
      let currentDate = new Date(bulkStartDate);
      while (currentDate <= bulkEndDate) {
        const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
        if (bulkDays[dayName]) {
          let currentTime = startTimeMinutes;
          while (currentTime + 45 <= endTimeMinutes) {
            const hours = Math.floor(currentTime / 60);
            const minutes = currentTime % 60;
            const slotTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            
            const dd = String(currentDate.getDate()).padStart(2, '0');
            const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
            const yyyy = currentDate.getFullYear();
            const slotDate = `${dd}_${mm}_${yyyy}`;

            slotsToCreate.push({
              slotDate,
              slotTime,
              description: bulkDescription,
              docId: '',
            });

            currentTime += 55; // 45 min slot + 10 min gap
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Send all slots to backend
      for (const slot of slotsToCreate) {
        await axios.post(`${backendUrl}/api/doctor/create-slot`, slot, { headers: { dToken } });
      }

      setIsLoading(false);
      toast.success(`${slotsToCreate.length} slots created successfully`);
      setBulkStartDate(new Date());
      setBulkEndDate(new Date());
      setBulkStartTime('09:00');
      setBulkEndTime('17:00');
      setBulkDescription('');
      setBulkDays({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      });
      fetchSlots();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Error creating bulk slots');
    }
  };

  // Start editing a slot
  const startEdit = (slot) => {
    setEditingSlotId(slot._id);
    setEditStatus(slot.status);
    setEditDescription(slot.description);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditStatus('');
    setEditDescription('');
  };

  // Update slot
  const updateSlotHandler = async (slotId) => {
    try {
      setIsLoading(true);
      const payload = {
        docId: '',
        slotId,
        status: editStatus,
        description: editDescription,
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-slot`, payload, { headers: { dToken } });
      setIsLoading(false);
      if (data.success) {
        toast.success(data.message);
        cancelEdit();
        fetchSlots();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Error updating slot');
    }
  };

  // Cancel slot (set status to "Cancelled")
  const cancelSlotHandler = async (slotId) => {
    try {
      setIsLoading(true);
      const payload = {
        docId: '',
        slotId,
        status: 'Cancelled',
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-slot`, payload, { headers: { dToken } });
      setIsLoading(false);
      if (data.success) {
        toast.success('Slot cancelled');
        fetchSlots();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Error cancelling slot');
    }
  };

  // Filter slots by status
  const filteredSlots = filterStatus === 'All' ? slots : slots.filter(slot => slot.status === filterStatus);

  // Animation variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-purple-50 p-6 md:p-8">
      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 text-center mb-8"
        >
          Manage Your Availability
        </motion.h2>

        {/* Create New Slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-rose-500 mr-2" />
            Create Single Slot
          </h3>
          <form onSubmit={createSlotHandler} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <DatePicker
                selected={newDate}
                onChange={(date) => date && setNewDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                minDate={new Date()}
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <TimePicker
                onChange={setNewTime}
                value={newTime}
                disableClock={true}
                clearIcon={null}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows="2"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Additional info (e.g., session type, notes)"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Slot
              </button>
            </div>
          </form>
        </motion.div>

        {/* Create Bulk Slots */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-rose-500 mr-2" />
            Create Multiple Slots (45 min with 10 min gaps)
          </h3>
          <form onSubmit={createBulkSlotsHandler} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={bulkStartDate}
                onChange={(date) => date && setBulkStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                minDate={new Date()}
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <DatePicker
                selected={bulkEndDate}
                onChange={(date) => date && setBulkEndDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                minDate={bulkStartDate}
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows="2"
                value={bulkDescription}
                onChange={(e) => setBulkDescription(e.target.value)}
                placeholder="Additional info for all slots"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <TimePicker
                onChange={setBulkStartTime}
                value={bulkStartTime}
                disableClock={true}
                clearIcon={null}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <TimePicker
                onChange={setBulkEndTime}
                value={bulkEndTime}
                disableClock={true}
                clearIcon={null}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(bulkDays).map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={bulkDays[day]}
                      onChange={() => setBulkDays({ ...bulkDays, [day]: !bulkDays[day] })}
                      className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Multiple Slots
              </button>
            </div>
          </form>
        </motion.div>

        {/* Slots Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 text-rose-500 mr-2" />
              Your Slots
            </h3>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-600 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchSlots}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {filteredSlots.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No slots found for the selected filter.</p>
          ) : (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              <AnimatePresence>
                {filteredSlots.map((slot) => (
                  <motion.div
                    key={slot._id}
                    variants={cardVariant}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {editingSlotId === slot._id ? (
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span> {slot.slotDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Time:</span> {slot.slotTime}
                          </p>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Booked">Booked</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Coming Soon">Coming Soon</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Update description"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                              rows="2"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => updateSlotHandler(slot._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={cancelEdit}
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span> {slot.slotDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Time:</span> {slot.slotTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                slot.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : slot.status === 'Booked'
                                  ? 'bg-blue-100 text-blue-700'
                                  : slot.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {slot.status}
                            </span>
                          </p>
                          {slot.description && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span> {slot.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => startEdit(slot)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </motion.button>
                          {slot.status !== 'Cancelled' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => cancelSlotHandler(slot._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Cancel
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;