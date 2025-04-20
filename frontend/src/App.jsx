// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Test from './pages/Test';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import ResetPassword from './pages/ResetPassword';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary
import JoinProfessional from './pages/JoinProfessional';
const App = () => {
  return (
    <>
    <div className='mb-20 '>
      <ToastContainer />
      <Navbar />
      <ErrorBoundary> {/* Wrap Routes with ErrorBoundary */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/professional' element={<Doctors />} />
          <Route path='/test' element={<Test />} />
          <Route path='/professional/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/reset-password/:userId' element={<ResetPassword />} />
          
          <Route path='/join-professional' element={<JoinProfessional />} />
        </Routes>
      </ErrorBoundary>
    </div>
      <Footer />
    </>
  );
};

export default App;
