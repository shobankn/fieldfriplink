import { motion } from 'framer-motion';
import { Check, X, PauseCircle, TriangleAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DriverActions = ({ driverId }) => {
  const [loading, setLoading] = useState(true); // Start with loading as true
  const [driverStatus, setDriverStatus] = useState(null);
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';
  let navigate = useNavigate();

  // Fetch current driver status on load
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          toast.error('Please log in first.');
          return;
        }

        const { data } = await axios.get(`${BaseUrl}/school/driver/${driverId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriverStatus(data?.schoolDriver?.status);
      } catch (err) {
        console.error('Failed to fetch driver status:', err);
        toast.error('Failed to load driver status.');
      } finally {
        setLoading(false); // Stop loading once data is fetched or error occurs
      }
    };

    fetchStatus();
  }, [driverId]);

  const updateDriverStatus = async (status, successMsg, errorMsg) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in first.');
        setLoading(false);
        return;
      }

      await axios.patch(
        `${BaseUrl}/school/driver/${driverId}/status`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(successMsg);
      setDriverStatus(status);

      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || errorMsg);
      console.error(errorMsg, err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDriver = () =>
    updateDriverStatus('approved', 'Driver verified successfully!', 'Failed to verify driver.');

  const handleRejectDriver = () =>
    updateDriverStatus('rejected', 'Driver rejected successfully!', 'Failed to reject driver.');

  const handleSuspendDriver = () =>
    updateDriverStatus('suspended', 'Driver suspended successfully!', 'Failed to suspend driver.');

  // Only render buttons after loading is complete and status is available
  if (loading) {
    return (
      <div className="flex gap-3">
        <div className="flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-gray-500 bg-gray-200 rounded-[10px] inter-medium">
          <svg className="animate-spin h-5 w-5 mr-1 text-gray-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (!driverStatus) {
    return (
      <div className="flex gap-3">
        <div className="flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-gray-500 bg-gray-200 rounded-[10px] inter-medium">
          No status available
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex gap-3">
        {/* Show Verify button only if not approved */}
        {driverStatus !== 'approved' && (
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
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
        )}

        {/* Reject Button (always visible) */}
        <motion.button
          onClick={handleRejectDriver}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="content-center flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-red-500 rounded-[10px] inter-medium transition-colors hover:bg-red-600"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto" />
          Reject
        </motion.button>

        {/* Suspend Button (only if approved) */}
        {driverStatus === 'approved' && (
          <motion.button
            onClick={handleSuspendDriver}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="content-center flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-yellow-500 rounded-[10px] inter-medium transition-colors hover:bg-yellow-600"
          >
            <TriangleAlert className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto" />
            Suspend
          </motion.button>
        )}
      </div>
    </>
  );
};

export default DriverActions;