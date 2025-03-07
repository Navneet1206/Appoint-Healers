import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, Settings, Users, Briefcase } from 'lucide-react';

const ProfessionalDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Professional Dashboard</h1>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">
                Welcome, {user?.firstName} {user?.lastName}!
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Professional Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">Account Status</h4>
                </div>
                <p className="text-gray-600">
                  {user?.emailVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">Clients</h4>
                </div>
                <p className="text-gray-600">
                  0 active clients
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">Appointments</h4>
                </div>
                <p className="text-gray-600">
                  0 upcoming appointments
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
                <Calendar className="h-5 w-5 mr-2" />
                Manage Schedule
              </button>
              
              <button className="flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
                <Settings className="h-5 w-5 mr-2" />
                Profile Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming appointments.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No notifications to display.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
