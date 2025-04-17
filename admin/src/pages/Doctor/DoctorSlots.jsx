import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [newDate, setNewDate] = useState(new Date()); // Using JS Date
  const [newTime, setNewTime] = useState('10:00');    // Using HH:mm format
  const [newDescription, setNewDescription] = useState('');

  // Fetched slots
  const [slots, setSlots] = useState([]);

  // Editing states
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
        { docId: '' }, // Let backend figure out doc from token
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

    // Format date to dd_mm_yyyy
    const dd = String(newDate.getDate()).padStart(2, '0');
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const yyyy = newDate.getFullYear();
    const slotDate = `${dd}_${mm}_${yyyy}`;

    // newTime is already in "HH:mm" format from TimePicker
    const slotTime = newTime;

    try {
      setIsLoading(true);
      const payload = {
        slotDate,
        slotTime,
        description: newDescription,
        docId: '', // Let backend infer docId from token
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
        docId: '', // Let backend infer doctor from token
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

  return (
    <div className="p-5 w-full">

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-center">Manage Your Slots</h2>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={fetchSlots} 
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Refresh Slots
        </button>
      </div>

      {/* Create New Slot */}
      <div className="bg-white border rounded p-4 shadow mb-8 max-w-xl">
        <h3 className="text-xl font-medium mb-4">Create New Slot</h3>
        <form onSubmit={createSlotHandler} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Select Date</label>
            <DatePicker
              selected={newDate}
              onChange={(date) => date && setNewDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border rounded px-3 py-2 w-full"
              minDate={new Date()} // Disallow past dates
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Select Time</label>
            <TimePicker
              onChange={setNewTime}
              value={newTime}
              disableClock={true}
              clearIcon={null}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description (optional)</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows="2"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Additional info about the slot..."
            />
          </div>
          <button type="submit" className="bg-primary text-white py-2 rounded hover:opacity-90 transition">
            Create Slot
          </button>
        </form>
      </div>

      {/* Existing Slots */}
      <div className="bg-white border rounded p-4 shadow max-w-xl">
        <h3 className="text-xl font-medium mb-3">Your Created Slots</h3>
        {slots.length === 0 ? (
          <p className="text-gray-500">No slots created yet.</p>
        ) : (
          <div className="space-y-4">
            {slots.map((slot) => (
              <div key={slot._id} className="border p-4 rounded flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-sm">
                    <span className="text-gray-600">Date:</span> {slot.slotDate}
                  </p>
                  <p className="font-medium text-sm">
                    <span className="text-gray-600">Time:</span> {slot.slotTime}
                  </p>
                  <p className="font-medium text-sm">
                    <span className="text-gray-600">Status:</span> {slot.status}
                  </p>
                  {slot.description && (
                    <p className="font-medium text-sm">
                      <span className="text-gray-600">Description:</span> {slot.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  {editingSlotId === slot._id ? (
                    <>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Coming Soon">Coming Soon</option>
                      </select>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Update description"
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => updateSlotHandler(slot._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(slot)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      {/* If slot not cancelled, allow quick cancel */}
                      {slot.status !== 'Cancelled' && (
                        <button
                          onClick={() => cancelSlotHandler(slot._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSlots;
