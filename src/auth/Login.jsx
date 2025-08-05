import React, { useState } from 'react';
import logo from '../images/logo.png';

const Login = () => {
  const [userType, setUserType] = useState('School');

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Left Logo Section */}
      <div className="w-1/2 flex items-center justify-center">
        <img src={logo} alt="Logo" className="max-w-[80%]" />
      </div>

      {/* Right Login Section */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-[24px] font-bold text-center mb-1">Welcome back</h2>
        <p className="text-center text-[14px] text-[#6b7280] mb-6">Sign in to your account</p>

        {/* Toggle Switch */}
        <div className="relative bg-[#f3f4f6] rounded-[10px] p-[10px] flex justify-between w-[230px] mx-auto mb-6 h-[50px] overflow-hidden">
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[10px] bg-white shadow transition-all duration-300 ${
              userType === 'Driver' ? 'translate-x-[calc(100%+1px)]' : ''
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

        {/* Google Button */}
        <button className="w-full border border-[#d1d5db] rounded-md py-2 mb-4 font-medium">
          <span className="text-sm">Continue with Google</span>
        </button>

        <div className="flex items-center mb-4">
          <div className="flex-grow h-[1px] bg-[#e5e7eb]"></div>
          <span className="px-4 text-sm text-[#6b7280]">Or continue with email</span>
          <div className="flex-grow h-[1px] bg-[#e5e7eb]"></div>
        </div>

        <form>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              {userType === 'Driver' ? 'Company Email' : 'Email'}
            </label>
            <input
              type="email"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder={userType === 'Driver' ? 'Enter company email' : 'Enter your email'}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-[#d1d5db] rounded-md px-3 py-2"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5b45ff] hover:bg-[#4937d5] text-white font-medium py-2 rounded-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
