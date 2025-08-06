import React from 'react';
import logo from '../images/logo.png';

const EmailVarification = () => {
  return (
    <div className="min-h-screen flex">
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
        <div className="flex mb-6 w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[5px]">
          <div className="relative flex w-full">
            <div className="absolute w-1/2 h-full bg-[#DE3B40] rounded-[8px]" />
            <button
              className="relative w-1/2 py-2 text-[14px] font-semibold z-10 text-white"
            >
              School
            </button>
            <button
              className="relative w-1/2 py-2 text-[14px] font-semibold z-10 text-[#DE3B40]"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-[14px]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#DE3B40] hover:bg-[#DE3B40] text-white h-[48px] rounded-[8px] font-medium mb-4 mt-[55px] text-[14px]"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVarification;