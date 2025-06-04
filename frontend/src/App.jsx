import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Test = lazy(() => import('./pages/Test'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Appointment = lazy(() => import('./pages/Appointment'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Verify = lazy(() => import('./pages/Verify'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const JoinProfessional = lazy(() => import('./pages/JoinProfessional'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TermsandConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyandPolicy = lazy(() => import('./pages/PrivacyandPolicy'));
const App = () => {
  return (
    <>
      <div className="mb-20">
        <Navbar />
        <ScrollToTop />

        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/professional" element={<Doctors />} />
              <Route path="/service" element={<Navigate to="/professional" replace />} />
              <Route path="/services" element={<Navigate to="/professional" replace />} />
              <Route path="/professional/:speciality" element={<Doctors />} />
              <Route path="/mental-health-test" element={<Test />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appointment/:docId" element={<Appointment />} />
              <Route path="/profile/:docId" element={<Appointment />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/reset-password/:userId" element={<ResetPassword />} />
              <Route path="/join-professional" element={<JoinProfessional />} />
              <Route path="/terms-and-conditions" element={<TermsandConditions />} />   
              <Route path="/privacy-and-policy" element={<PrivacyandPolicy />} />       
              {/* Catch-all route for 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>

      <Footer />
    </>
  );
};

export default App;
