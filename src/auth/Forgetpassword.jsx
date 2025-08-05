import React from 'react';
import logo from '../images/logo.png';

const ForgetPassword = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Logo Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="text-center px-6">
          <img src={logo} alt="Logo" className="max-w-[80%] mx-auto mb-4" />
          
        </div>
      </div>

      {/* Right Reset Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <h2 className="text-xl font-bold mb-2 text-center">Forgot Password?</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your email to receive a reset link
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5b45ff] hover:bg-[#4937d5] text-white font-medium py-2 rounded-md"
            >
              Send Reset Link
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-600 hover:underline">
              &larr; Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
