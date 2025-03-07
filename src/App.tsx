import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import UserLogin from './pages/UserLogin';
import ProfessionalRegister from './pages/ProfessionalRegister';
import Dashboard from './pages/Dashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import Home from './pages/Home';
import ServiceDetails from './pages/ServiceDetails';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Services from './pages/Services';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import AppointmentDetails from './pages/AppointmentDetails';
import Verify from './pages/Verify';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import Professionals from './pages/Professionals';
import Navbar from './components/Navbar';
import Register from './pages/Register';
function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="service/:id" element={<ServiceDetails />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="about" element={<About />} />
          <Route path="appointment/:id" element={<AppointmentDetails />} />
          <Route path="verify" element={<Verify />} />
          <Route path="verify/:token" element={<Verify />} />
          <Route path="verify/:token/:role" element={<Verify />} />
          <Route path="verify/:token/:role/:id" element={<Verify />} />
          <Route path="verify/:token/:role/:id/:email" element={<Verify />} />
          <Route path="verify/:token/:role/:id/:mobile" element={<Verify />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="professionals" element={<Professionals />} />
          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="register" element={<ProfessionalRegister />} />
          </Route>
          <Route path="user">
            <Route path="login" element={<UserLogin />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="professional/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['professional', 'admin']}>
                <ProfessionalDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Alias routes for login and register */}
          <Route path="login" element={<UserLogin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
