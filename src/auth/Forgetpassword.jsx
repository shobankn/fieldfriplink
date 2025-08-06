import React, { useState } from 'react';
import logo from '../images/logo.png';

const ForgetPassword = () => {
  const [userType, setUserType] = useState('School');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-[45%] bg-white flex items-center justify-center px-[35px]">
        <img src={logo} alt="Logo" className="w-full" />
      </div>

      {/* Right Section */}
      <div className="w-[55%] bg-[#f9fafb] flex flex-col justify-center px-24">
        <h2 className="text-[32px] archivosemibold text-center mb-1">Forgot Password</h2>
        <p className="text-center text-[16px] text-[#666666] interregular mb-6">
          Enter your details to reset your password
        </p>

        {/* Toggle */}
        <div className="flex mb-6 w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[5px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#de3b40] rounded-[8px] transition-transform duration-300 ease-in-out ${
                userType === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setUserType('School')}
              className={`relative w-1/2 py-2 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                userType === 'School' ? 'text-white' : 'text-[#de3b40]'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setUserType('Driver')}
              className={`relative w-1/2 py-2 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                userType === 'Driver' ? 'text-white' : 'text-[#de3b40]'
              }`}
            >
              Driver
            </button>
          </div>
        </div>

        <form className="mt-[20px]">
          <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Password</label>
            <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="flex-1 outline-none border-none bg-transparent"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2"
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

          <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Confirm Password</label>
            <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="flex-1 outline-none border-none bg-transparent"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="ml-2"
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
            className="w-full bg-[#de3b40] hover:bg-red-600 text-white h-[48px] rounded-[8px] font-medium mb-4 mt-[55px]"
          >
            Change Password
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-gray-600 hover:underline">
            &larr; Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;