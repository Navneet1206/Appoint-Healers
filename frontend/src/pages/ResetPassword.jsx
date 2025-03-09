import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { token, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">Reset Password</p>
        <p>Enter your new password</p>
        <div className="w-full">
          <p>New Password</p>
          <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="password" required />
        </div>
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;