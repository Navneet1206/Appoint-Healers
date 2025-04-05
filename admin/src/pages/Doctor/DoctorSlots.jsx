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
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState('10:00');
  const [newDescription, setNewDescription] = useState('');
  const [newSessionType, setNewSessionType] = useState('video');

  // Fetched slots
  const [slots, setSlots] = useState([]);

  // Editing states
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSessionType, setEditSessionType] = useState('');

  // Session type options
  const sessionTypes = [
    {
      value: 'video', label: 'Video Call', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      value: 'phone', label: 'Phone Call', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      value: 'in-person', label: 'In-Person', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    if (dToken) {
      fetchSlots();
    }
  }, [dToken]);

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

    try {
      setIsLoading(true);
      const payload = {
        slotDate,
        slotTime: newTime,
        description: newDescription,
        sessionType: newSessionType,
        docId: ''
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/create-slot`, payload, { headers: { dToken } });
      setIsLoading(false);

      if (data.success) {
        toast.success(data.message);
        setNewDate(new Date());
        setNewTime('10:00');
        setNewDescription('');
        setNewSessionType('video');
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

  const startEdit = (slot) => {
    setEditingSlotId(slot._id);
    setEditStatus(slot.status);
    setEditDescription(slot.description || '');
    setEditSessionType(slot.sessionType || 'video');
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditStatus('');
    setEditDescription('');
    setEditSessionType('');
  };

  const updateSlotHandler = async (slotId) => {
    try {
      setIsLoading(true);
      const payload = {
        docId: '',
        slotId,
        status: editStatus,
        description: editDescription,
        sessionType: editSessionType
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

  const cancelSlotHandler = async (slotId) => {
    try {
      setIsLoading(true);
      const payload = {
        docId: '',
        slotId,
        status: 'Cancelled'
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

  // Format date from "dd_mm_yyyy" to "DD Mon YYYY"
  const formatDate = (dateStr) => {
    const [d, m, y] = dateStr.split('_').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Manage Your Slots</h2>
        <button
          onClick={fetchSlots}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Create New Slot */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Create New Slot</h3>
        <form onSubmit={createSlotHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <DatePicker
                selected={newDate}
                onChange={date => setNewDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <TimePicker
                value={newTime}
                onChange={setNewTime}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                disableClock={true}
                format="HH:mm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessionTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setNewSessionType(type.value)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${newSessionType === type.value
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Add any additional information about the slot..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Create Slot
          </button>
        </form>
      </div>

      {/* Slots List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Your Slots</h3>
        </div>
        <div className="divide-y">
          {slots.map(slot => (
            <div key={slot._id} className="p-6 hover:bg-gray-50 transition-colors">
              {editingSlotId === slot._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                      <select
                        value={editSessionType}
                        onChange={e => setEditSessionType(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        {sessionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 h-24 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateSlotHandler(slot._id)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-gray-900">
                      <div className="font-medium">{formatDate(slot.slotDate)}</div>
                      <div className="text-sm text-gray-500">{slot.slotTime}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${slot.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : slot.status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {slot.status}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      {sessionTypes.find(type => type.value === (slot.sessionType || 'video'))?.icon}
                      <span className="text-sm">
                        {sessionTypes.find(type => type.value === (slot.sessionType || 'video'))?.label}
                      </span>
                    </div>
                    {slot.description && (
                      <div className="text-sm text-gray-500">{slot.description}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(slot)}
                      className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                      title="Edit Slot"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {slot.status !== 'Cancelled' && (
                      <button
                        onClick={() => cancelSlotHandler(slot._id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Cancel Slot"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {slots.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No slots found. Create your first slot above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;
