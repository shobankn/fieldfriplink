import React, { useState } from 'react';
import logo from '../images/logo.png';

const EmailVerification = () => {
  const [userType, setUserType] = useState('School');

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Section */}
      <div className="w-[45%] bg-white flex items-center justify-center px-[35px]">
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-full" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[55%] bg-[#f9f9f9] flex flex-col justify-center px-24">
        <h2 className="text-[32px] font-semibold text-center mb-1">Forgot Password</h2>
        <p className="text-center text-[16px] text-[#666666] mb-6">
          Enter your details to reset your password
        </p>

        {/* Toggle */}
        <div className="flex mb-6 w-[400px] h-[48px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[5px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#DE3B40] rounded-[6px] transition-transform duration-300 ease-in-out ${
                userType === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setUserType('School')}
              className={`relative w-1/2 py-2 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                userType === 'School' ? 'text-white' : 'text-[#DE3B40]'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setUserType('Driver')}
              className={`relative w-1/2 py-2 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                userType === 'Driver' ? 'text-white' : 'text-[#DE3B40]'
              }`}
            >
              Driver
            </button>
          </div>
        </div>

        <form className="mt-[20px]">
          <div className="mb-4">
            <label className="block text-[14px] font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-[8px] px-3 h-[48px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#DE3B40] transition-colors duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#DE3B40] hover:bg-[#B83238] text-white h-[48px] rounded-[8px] font-medium mb-4 mt-[55px] text-[14px] transition-colors duration-300 ease-in-out"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;