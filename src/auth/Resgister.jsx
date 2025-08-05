import React, { useState } from 'react';
import logo from '../images/logo.png';

const Register = () => {
  const [userType, setUserType] = useState('School');

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Left Section with Logo */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        <img src={logo} alt="Logo" className="max-w-[80%]" />
        <p className="text-center text-[#374151] font-medium px-10">
          Shared Drivers. Connected Trips. Enriched Learning.
        </p>
      </div>

      {/* Right Section with Form */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-[24px] font-bold text-center mb-1">Create your account</h2>
        <p className="text-center text-[14px] text-[#6b7280] mb-6">
          Join thousands of content creators
        </p>

        {/* Toggle Button */}
        <div className="relative bg-[#f3f4f6] rounded-[10px] p-[10px] flex justify-between w-[220px] mx-auto mb-6 h-[50px] overflow-hidden">
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[10px] bg-white shadow transition-all duration-300 ${
              userType === 'Driver' ? 'translate-x-[calc(100%+8px)]' : ''
            }`}
          ></div>
          <button
            onClick={() => setUserType('School')}
            className={`w-1/2 z-10 text-sm font-semibold rounded-full transition-colors duration-300 ${
              userType === 'School' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            School
          </button>
          <button
            onClick={() => setUserType('Driver')}
            className={`w-1/2 z-10 text-sm font-semibold rounded-full transition-colors duration-300 ${
              userType === 'Driver' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            Driver
          </button>
        </div>

        {/* Google Sign Up */}
        <button className="w-full border border-[#d1d5db] rounded-md py-2 mb-4 font-medium flex items-center justify-center gap-2">
          <span className="text-sm">Continue with Google</span>
        </button>

        {/* OR Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow h-[1px] bg-[#e5e7eb]"></div>
          <span className="px-4 text-sm text-[#6b7280]">Or continue with email</span>
          <div className="flex-grow h-[1px] bg-[#e5e7eb]"></div>
        </div>

        {/* Register Form */}
        <form>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              {userType === 'Driver' ? 'Company Name' : 'Username'}
            </label>
            <input
              type="text"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder={
                userType === 'Driver' ? 'Enter company name' : 'Enter your username'
              }
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              {userType === 'Driver' ? 'Company Email' : 'Email'}
            </label>
            <input
              type="email"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder={
                userType === 'Driver' ? 'Enter company email' : 'Enter your email'
              }
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder="Create a strong password"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder="Confirm your password"
            />
          </div>

          <div className="flex items-start mb-6 text-sm">
            <input type="checkbox" className="mt-1 mr-2" />
            <span>
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5b45ff] hover:bg-[#4937d5] text-white font-medium py-2 rounded-md"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
