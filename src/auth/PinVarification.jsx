import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';

const PinVerification = () => {
  const [userType, setUserType] = useState('Driver');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email = 'harisaziz840@gmail.com' } = location.state || {};

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('No email provided. Please go back and enter your email.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://fieldtriplinkbackend-production.up.railway.app/api/auth/verify-otp', {
        email,
        verificationCode: otp.join(''),
      });

      if (response.data.message === 'OTP verified successfully') {
        toast.success('OTP verified successfully! Redirecting...');
        setTimeout(() => navigate('/forgetpassword', { state: { email, userType } }), 2000);
      } else {
        toast.error(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred. Please try again later.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = (e) => {
    e.preventDefault();
    navigate('/emailvarification');
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[55%] bg-[#f9fafb] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-6 lg:py-0">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Verify OTP</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">
          Enter the OTP sent to your email
        </p>

        {/* Toggle */}
        <div className="flex mb-6 w-full sm:w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[4px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#de3b40] rounded-[8px] transition-transform duration-300 ease-in-out ${
                userType === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setUserType('School')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
                userType === 'School' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              School
            </button>
            <button
              onClick={() => setUserType('Driver')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
                userType === 'Driver' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              Driver
            </button>
          </div>
        </div>

        <form onSubmit={handleVerify} className="mt-5 lg:mt-[20px]">
          <div className="mb-4 text-center">
            <label className="block text-sm lg:text-[14px] text-[#555555] inter-semibold mb-1 text-left sm:ml-[17.5%]">
              Enter OTP
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  className="w-[60px] sm:w-[72px] h-[50px] sm:h-[67px] border border-gray-300 rounded-md text-center text-sm lg:text-[14px] mx-1 sm:me-[12px]"
                  required
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-[65%] sm:ml-[17.5%] bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center mt-[32px] ${
              loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? (
              <>
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
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </form>

        <p className="text-center text-sm lg:text-[14px] interregular mt-4">
          Don’t have an account?{' '}
          <button
            onClick={handleSignUp}
            className="text-[#de3b40] inter-semibold hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PinVerification;