import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';

const ForgetPassword = () => {
  const [userType, setUserType] = useState('School');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  // Set userType based on state from navigation
  useEffect(() => {
    const userTypeFromState = location.state?.userType;
    if (userTypeFromState === 'School' || userTypeFromState === 'Driver') {
      setUserType(userTypeFromState);
    }
  }, [location.state]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Email is required to reset password.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://fieldtriplinkbackend-production.up.railway.app/api/auth/reset-password', {
        email,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.data.message === 'Password reset successful') {
        toast.success('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 2000); // Redirect after 2 seconds
      } else {
        toast.error('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Password reset failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Reset Your Password</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">
          Enter your new password to reset
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

        <form onSubmit={handleSubmit} className="mt-5 lg:mt-[20px]">
          <div className="mb-4">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">New Password</label>
            <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="flex-1 outline-none border-none bg-transparent text-sm lg:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  {showPassword ? (
                    <>
                      <path
                        d="M14.9373 6.59766C15.3383 7.04766 15.6623 7.48866 15.9113 7.86766C16.3613 8.55066 16.3613 9.44966 15.9113 10.1327C14.8933 11.6757 12.6493 14.2507 8.99927 14.2507C8.45027 14.2507 7.93327 14.1927 7.44727 14.0887"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.9555 13.043C3.5995 12.167 2.6535 10.99 2.0875 10.131C1.6375 9.44805 1.6375 8.54905 2.0875 7.86605C3.1055 6.32305 5.3495 3.74805 8.9995 3.74805C10.6195 3.74805 11.9625 4.25505 13.0435 4.95405"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 16L16 2"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M14.9373 6.59766C15.3383 7.04766 15.6623 7.48866 15.9113 7.86766C16.3613 8.55066 16.3613 9.44966 15.9113 10.1327C14.8933 11.6757 12.6493 14.2507 8.99927 14.2507C8.45027 14.2507 7.93327 14.1927 7.44727 14.0887"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.9555 13.043C3.5995 12.167 2.6535 10.99 2.0875 10.131C1.6375 9.44805 1.6375 8.54905 2.0875 7.86605C3.1055 6.32305 5.3495 3.74805 8.9995 3.74805C10.6195 3.74805 11.9625 4.25505 13.0435 4.95405"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.5781 9.95508C11.3001 10.7051 10.7051 11.3001 9.95508 11.5781"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.055 10.945C6.557 10.447 6.25 9.76 6.25 9C6.25 7.481 7.481 6.25 9 6.25C9.759 6.25 10.447 6.558 10.945 7.055"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-1">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Confirm Password</label>
            <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="flex-1 outline-none border-none bg-transparent text-sm lg:text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="ml-2 cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  {showConfirmPassword ? (
                    <>
                      <path
                        d="M14.9373 6.59766C15.3383 7.04766 15.6623 7.48866 15.9113 7.86766C16.3613 8.55066 16.3613 9.44966 15.9113 10.1327C14.8933 11.6757 12.6493 14.2507 8.99927 14.2507C8.45027 14.2507 7.93327 14.1927 7.44727 14.0887"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.9555 13.043C3.5995 12.167 2.6535 10.99 2.0875 10.131C1.6375 9.44805 1.6375 8.54905 2.0875 7.86605C3.1055 6.32305 5.3495 3.74805 8.9995 3.74805C10.6195 3.74805 11.9625 4.25505 13.0435 4.95405"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 16L16 2"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M14.9373 6.59766C15.3383 7.04766 15.6623 7.48866 15.9113 7.86766C16.3613 8.55066 16.3613 9.44966 15.9113 10.1327C14.8933 11.6757 12.6493 14.2507 8.99927 14.2507C8.45027 14.2507 7.93327 14.1927 7.44727 14.0887"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.9555 13.043C3.5995 12.167 2.6535 10.99 2.0875 10.131C1.6375 9.44805 1.6375 8.54905 2.0875 7.86605C3.1055 6.32305 5.3495 3.74805 8.9995 3.74805C10.6195 3.74805 11.9625 4.25505 13.0435 4.95405"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.5781 9.95508C11.3001 10.7051 10.7051 11.3001 9.95508 11.5781"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.055 10.945C6.557 10.447 6.25 9.76 6.25 9C6.25 7.481 7.481 6.25 9 6.25C9.759 6.25 10.447 6.558 10.945 7.055"
                        stroke="#0F0F0F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center mt-6 lg:mt-[60px] cursor-pointer ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
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
                Processing...
              </>
            ) : (
              'Reset Password'
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

export default ForgetPassword;