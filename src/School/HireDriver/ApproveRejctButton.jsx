import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DriverActions = ({ driverId }) => {
  const [loading, setLoading] = useState(false);
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';
  let navigate = useNavigate();

  const handleVerifyDriver = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to verify driver.');
        setLoading(false);
        return;
      }

      await axios.patch(
        `${BaseUrl}/school/driver/${driverId}/status`, // Placeholder; replace with your actual API route
        { status: 'approved' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Driver verified successfully!');

       setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000); // 1.5s delay so popup is visible

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify driver.');
      console.error('Verification Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectDriver = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to reject driver.');
        return;
      }

      await axios.patch(
        `${BaseUrl}/school/driver/${driverId}/status`, // Placeholder; replace with your actual API route
        { status: 'rejected' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Driver rejected successfully!');

       setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 3000); // 1.5s delay so popup is visible

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject driver.');
      console.error('Rejection Error:', err);
    }
  };

  return (
    <>
    <ToastContainer/>
        <div className="flex gap-3">
      {/* Accept Driver */}
      <motion.button
        onClick={handleVerifyDriver}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        className={`flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-green-400 rounded-[10px] inter-medium transition-colors ${
          loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-500'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-1 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Verifying...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto" />
            Verify Driver
          </>
        )}
      </motion.button>

      {/* Reject Driver */}
      <motion.button
        onClick={handleRejectDriver}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="content-center flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-red-500 rounded-[10px] inter-medium transition-colors hover:bg-red-600"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto" />
        Reject
      </motion.button>
    </div>
    
    </>

  );
};

export default DriverActions;