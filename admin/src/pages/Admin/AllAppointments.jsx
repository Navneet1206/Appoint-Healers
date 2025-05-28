import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments, completeAppointment, sendMeetingLink } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Filter appointments based on status and date range
  const filteredAppointments = appointments.filter((item) => {
    const appointmentDate = new Date(item.slotDate);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Scheduled' && !item.cancelled && !item.isCompleted) ||
      (filterStatus === 'Completed' && item.isCompleted) ||
      (filterStatus === 'Cancelled' && item.cancelled);

    const matchesDate =
      (!startDate || appointmentDate >= startDate) &&
      (!endDate || appointmentDate <= endDate);

    return matchesStatus && matchesDate;
  });

  // Calculate user appointment statistics
  const getUserAppointmentStats = () => {
    const userStats = {};
    filteredAppointments.forEach((item) => {
      const userId = item.userData._id;
      if (!userStats[userId]) {
        userStats[userId] = {
          name: item.userData.name,
          image: item.userData.image,
          total: 0,
          completed: 0,
          cancelled: 0,
          appointments: [],
        };
      }
      userStats[userId].total += 1;
      if (item.isCompleted) userStats[userId].completed += 1;
      if (item.cancelled) userStats[userId].cancelled += 1;
      userStats[userId].appointments.push({
        date: item.slotDate,
        time: item.slotTime,
        status: item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled',
        professional: item.docData.name,
      });
    });
    return Object.values(userStats).sort((a, b) => b.total - a.total);
  };

  const userStats = getUserAppointmentStats();

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setMeetingLink(appointment.meetingLink || '');
    setMeetingPassword(appointment.meetingPassword || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setMeetingLink('');
    setMeetingPassword('');
  };

  const handleSendMeetingLink = async () => {
    if (!meetingLink) {
      toast.error('Meeting link is required');
      return;
    }
    try {
      const response = await sendMeetingLink(selectedAppointment._id, meetingLink, meetingPassword);
      if (response.success) {
        toast.success('Meeting link sent successfully');
        getAllAppointments();
        closeModal();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error sending meeting link');
      console.error(error);
    }
  };

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
    } else if (item.isCompleted) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Scheduled</span>;
    }
  };

  const getStatsSummary = () => {
    const total = filteredAppointments.length;
    const completed = filteredAppointments.filter(item => item.isCompleted).length;
    const cancelled = filteredAppointments.filter(item => item.cancelled).length;
    const scheduled = filteredAppointments.filter(item => !item.cancelled && !item.isCompleted).length;
    
    return { total, completed, cancelled, scheduled };
  };

  const stats = getStatsSummary();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Appointments Dashboard</h1>
              <p className='mt-2 text-sm text-gray-600'>Manage and track all appointments</p>
            </div>
            <div className='mt-4 sm:mt-0 flex gap-3'>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D20424] transition-colors'
              >
                {viewMode === 'list' ? (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
                {viewMode === 'list' ? 'Grid View' : 'List View'}
              </button>
              <button
                onClick={() => setShowFilterPage(!showFilterPage)}
                className='inline-flex items-center px-4 py-2 bg-[#D20424] text-white rounded-lg hover:bg-[#b8031f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D20424] transition-colors shadow-sm'
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showFilterPage ? 'Back to Appointments' : 'User Statistics'}
              </button>
            </div>
          </div>
        </div>

        {!showFilterPage ? (
          <>
            {/* Stats Cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-2 bg-blue-100 rounded-lg'>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Total</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-2 bg-green-100 rounded-lg'>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Completed</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.completed}</p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-2 bg-yellow-100 rounded-lg'>
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Scheduled</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.scheduled}</p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-2 bg-red-100 rounded-lg'>
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Cancelled</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filters</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                  >
                    <option value='All'>All Status</option>
                    <option value='Scheduled'>Scheduled</option>
                    <option value='Completed'>Completed</option>
                    <option value='Cancelled'>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Start Date</label>
                  <input
                    type='date'
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>End Date</label>
                  <input
                    type='date'
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                  />
                </div>
              </div>
            </div>

            {/* Appointments List/Grid */}
            {viewMode === 'list' ? (
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Patient</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Age</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date & Time</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Professional</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fees</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Meeting</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {filteredAppointments.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-50 transition-colors'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{index + 1}</td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <img className='h-10 w-10 rounded-full object-cover' src={item.userData.image} alt='' />
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>{item.userData.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{calculateAge(item.userData.dob)}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{slotDateFormat(item.slotDate)}, {item.slotTime}</td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <img className='h-8 w-8 rounded-full object-cover bg-gray-200' src={item.docData.image} alt='' />
                              <div className='ml-3'>
                                <div className='text-sm font-medium text-gray-900'>{item.docData.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{currency}{item.discountedAmount ? item.discountedAmount : item.originalAmount}</td>
                          <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(item)}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm'>
                            {item.meetingLink ? (
                              <a
                                href={item.meetingLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-[#D20424] hover:text-[#b8031f] font-medium'
                              >
                                Join Meeting
                              </a>
                            ) : (
                              <span className='text-gray-400'>Not Set</span>
                            )}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm'>
                            <div className='flex items-center space-x-2'>
                              {item.cancelled ? (
                                <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                              ) : item.isCompleted ? (
                                <span className='text-green-500 text-xs font-medium'>Completed</span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => completeAppointment(item._id)}
                                    className='text-green-600 hover:text-green-900 font-medium'
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className='text-red-600 hover:text-red-900'
                                  >
                                    <img className='w-5 h-5' src={assets.cancel_icon} alt='Cancel' />
                                  </button>
                                  <button
                                    onClick={() => openModal(item)}
                                    className='text-[#D20424] hover:text-[#b8031f] font-medium'
                                  >
                                    {item.meetingLink ? 'Edit' : 'Add'} Link
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredAppointments.map((item, index) => (
                  <div key={index} className='bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center space-x-3'>
                        <img className='h-10 w-10 rounded-full object-cover' src={item.userData.image} alt='' />
                        <div>
                          <h3 className='text-sm font-medium text-gray-900'>{item.userData.name}</h3>
                          <p className='text-xs text-gray-500'>Age: {calculateAge(item.userData.dob)}</p>
                        </div>
                      </div>
                      {getStatusBadge(item)}
                    </div>
                    
                    <div className='space-y-3'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {slotDateFormat(item.slotDate)}, {item.slotTime}
                      </div>
                      
                      <div className='flex items-center text-sm text-gray-600'>
                        <img className='h-6 w-6 rounded-full object-cover bg-gray-200 mr-2' src={item.docData.image} alt='' />
                        {item.docData.name}
                      </div>
                      
                      <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-gray-900'>
                          {currency}{item.discountedAmount ? item.discountedAmount : item.originalAmount}
                        </div>
                        {item.meetingLink && (
                          <a
                            href={item.meetingLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[#D20424] hover:text-[#b8031f] text-xs font-medium'
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {!item.cancelled && !item.isCompleted && (
                      <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200'>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className='text-green-600 hover:text-green-900 text-sm font-medium'
                        >
                          Complete
                        </button>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => openModal(item)}
                            className='text-[#D20424] hover:text-[#b8031f] text-sm font-medium'
                          >
                            {item.meetingLink ? 'Edit' : 'Add'} Link
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            <img className='w-4 h-4' src={assets.cancel_icon} alt='Cancel' />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* User Statistics Page */
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>User Statistics</h2>
              <div className='flex space-x-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Start Date</label>
                  <input
                    type='date'
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>End Date</label>
                  <input
                    type='date'
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                  />
                </div>
              </div>
            </div>
            
            <div className='space-y-6 max-h-[70vh] overflow-y-auto'>
              {userStats.length > 0 ? (
                userStats.map((user, index) => (
                  <div key={index} className='border border-gray-200 rounded-lg p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center space-x-4'>
                        <img className='h-12 w-12 rounded-full object-cover' src={user.image} alt='' />
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>{user.name}</h3>
                          <div className='flex space-x-4 text-sm text-gray-600'>
                            <span>Total: <span className='font-medium text-gray-900'>{user.total}</span></span>
                            <span>Completed: <span className='font-medium text-green-600'>{user.completed}</span></span>
                            <span>Cancelled: <span className='font-medium text-red-600'>{user.cancelled}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className='text-sm font-medium text-gray-900 mb-3'>Appointment History</h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {user.appointments.map((appt, idx) => (
                          <div key={idx} className='bg-gray-50 rounded-lg p-3'>
                            <div className='text-sm'>
                              <p className='font-medium text-gray-900'>{slotDateFormat(appt.date)} at {appt.time}</p>
                              <p className='text-gray-600'>with {appt.professional}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-12'>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>No appointments found</h3>
                  <p className='mt-1 text-sm text-gray-500'>No appointments found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for sending/editing meeting link */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    {selectedAppointment?.meetingLink ? 'Edit Meeting Details' : 'Send Meeting Details'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedAppointment && (
                  <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                    <div className='flex items-center space-x-3'>
                      <img className='h-10 w-10 rounded-full object-cover' src={selectedAppointment.userData.image} alt='' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>{selectedAppointment.userData.name}</h3>
                        <p className='text-xs text-gray-500'>
                          {slotDateFormat(selectedAppointment.slotDate)}, {selectedAppointment.slotTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Meeting Link <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='url'
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                      placeholder='https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Meeting Password (Optional)
                    </label>
                    <input
                      type='text'
                      value={meetingPassword}
                      onChange={(e) => setMeetingPassword(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D20424] focus:border-transparent'
                      placeholder='Enter meeting password if required'
                    />
                  </div>
                </div>

                <div className='flex justify-end space-x-3 mt-8'>
                  <button
                    onClick={closeModal}
                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMeetingLink}
                    disabled={!meetingLink}
                    className='px-4 py-2 text-sm font-medium text-white bg-[#D20424] hover:bg-[#b8031f] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {selectedAppointment?.meetingLink ? 'Update Meeting' : 'Send Meeting Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showFilterPage && filteredAppointments.length === 0 && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900'>No appointments found</h3>
            <p className='mt-1 text-sm text-gray-500'>No appointments match your current filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;