import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Make sure the logo path is correct
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [userType, setUserType] = useState('Driver');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  const navigate = useNavigate();

 

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('https://fieldtriplinkbackend-production.up.railway.app/api/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Save token if needed
    localStorage.setItem('token', token);

    // Redirect logic based on role
    if (user.role === 'Driver') {
      toast.success('Driver login successful!');
      navigate('/driverdashboard');
    } else {
      if (user.role === 'school_admin') {
        toast.success('School Admin login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Unauthorized access: You are not a school admin.');
      }
    }
  } catch (error) {
    const msg =
      error.response?.data?.message || 'Login failed. Please check your credentials.';
    toast.error(msg);
  }
};



  // Handler for Forgot Password link
  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/emailvarification');
  };

  // Handler for Sign Up link
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/register');
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
          {/* <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div> */}

          <div className="mb-4">
            <label className="block text-[14px] inter-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right mb-[60px]">
            <button
              onClick={handleForgotPassword}
              className="text-[#de3b40] text-[14px] inter-medium hover:underline"
            >
              Forgot Password
            </button>
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
          <button
            onClick={handleSignUp}
            className="text-[#de3b40] inter-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;