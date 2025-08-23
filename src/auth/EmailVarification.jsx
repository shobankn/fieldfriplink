import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailVerification = () => {
  const [userType, setUserType] = useState('School');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Set userType based on state from navigation
  useEffect(() => {
    const userTypeFromState = location.state?.userType;
    if (userTypeFromState === 'School' || userTypeFromState === 'Driver') {
      setUserType(userTypeFromState);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/auth/forgot-password',
        { email, userType }
      );

      if (response.data.message === 'Verification code sent') {
        toast.success('Verification code sent successfully!');
        navigate('/pinverification', { state: { email, userType } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send verification code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-[35px] py-8">
        <div className="text-center">
          <img
            src={logo}
            alt="Logo"
            className="w-full lg:w-[100%] mx-auto"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[55%] bg-[#f9f9f9] flex flex-col justify-center px-4 sm:px-8 lg:px-24 py-8">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-center mb-1">Forgot Password</h2>
        <p className="text-center text-sm sm:text-[16px] text-[#666666] mb-6">
          Enter your details to reset your password
        </p>

        {/* Toggle */}
        <div className="flex mb-6 w-full max-w-[400px] h-[48px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[5px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#DE3B40] rounded-[6px] transition-transform duration-300 ease-in-out ${
                userType === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setUserType('School')}
              className={`relative w-1/2 py-2 text-sm sm:text-[14px] font-semibold z-10 transition-colors duration-300 cursor-pointer ${
                userType === 'School' ? 'text-white' : 'text-[#DE3B40]'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setUserType('Driver')}
              className={`relative w-1/2 py-2 text-sm sm:text-[14px] font-semibold z-10 transition-colors duration-300 cursor-pointer ${
                userType === 'Driver' ? 'text-white' : 'text-[#DE3B40]'
              }`}
            >
              Driver
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-4">
            <label className="block text-sm sm:text-[14px] font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-[8px] px-3 h-[48px] text-sm sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#DE3B40] transition-colors duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#DE3B40] hover:bg-[#B83238] text-white h-[48px] rounded-[8px] font-medium mb-4 mt-6 sm:mt-[55px] text-sm sm:text-[14px] transition-colors duration-300 ease-in-out flex items-center justify-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? 'Sending...' : 'Change Password'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmailVerification;