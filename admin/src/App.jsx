import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorSlots from './pages/Doctor/DoctorSlots';
import TestManagement from './pages/Admin/TestManagement';
import CouponManagement from './pages/Admin/CouponManagement';
import AdminReviewManagement from './pages/Admin/AdminReviewManagement'

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className='bg-rose-50'>
      <ToastContainer />
      {dToken || aToken ? (
        <>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              <Route path='/' element={<></>} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllAppointments />} />
              <Route path='/test-management' element={<TestManagement />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorsList />} />
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointments' element={<DoctorAppointments />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
              <Route path='/doctor-slots' element={<DoctorSlots />} />
              <Route path="/coupon-management" element={<CouponManagement />} />
              <Route path="/managereview" element={<AdminReviewManagement/>}/>
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      )}
    </div>
  );
};

export default App;