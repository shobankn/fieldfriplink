import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Make sure the logo path is correct

const Login = () => {
  const [userType, setUserType] = useState('Driver');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'Driver') {
      navigate('/driverdashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-[45%] bg-white flex items-center justify-center px-[35px]">
        <img src={logo} alt="Logo" className="w-full" />
      </div>

      {/* Right Section */}
      <div className="w-[55%] bg-[#f9fafb] flex flex-col justify-center px-24">
        <h2 className="text-[32px] archivosemibold text-center mb-1">Sign In to your Account</h2>
        <p className="text-center text-[16px] text-[#666666] interregular mb-6">Join thousands of content creators</p>

        {/* Toggle */}
        <div className="flex mb-6 w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[4px]">
  <div className="relative flex w-full">
    <div
      className={`absolute w-1/2 h-full bg-[#de3b40] rounded-[8px] transition-transform duration-300 ease-in-out ${
        userType === 'School' ? 'translate-x-0' : 'translate-x-full'
      }`}
    />
    <button
      onClick={() => setUserType('School')}
      className={`relative w-1/2 py-2 text-[14px] font-semibold transition-colors duration-300 ${
        userType === 'School' ? 'text-white' : 'text-[#de3b40]'
      } z-10`}
    >
      School
    </button>
    <button
      onClick={() => setUserType('Driver')}
      className={`relative w-1/2 py-2 text-[14px] font-semibold transition-colors duration-300 ${
        userType === 'Driver' ? 'text-white' : 'text-[#de3b40]'
      } z-10`}
    >
      Driver
    </button>
  </div>
</div>

        <form onSubmit={handleSubmit} className='mt-[20px]'>
          <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mb-1">
            <label className="block text-[14px] inter-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="text-right mb-[60px]">
            <a href="#" className="text-[#de3b40] text-[14px] inter-medium hover:underline">Forgot Password</a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium mb-4 h-[48px]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-[14px] interregular">
          Don’t have an account?{' '}
          <a href="#" className="text-[#de3b40] inter-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;