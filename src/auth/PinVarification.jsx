import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Make sure the logo path is correct

const PinVarification = () => {
  const [userType, setUserType] = useState('Driver');
  const [otp, setOtp] = useState(['', '', '', '','']);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Add OTP verification logic here
    navigate(userType === 'Driver' ? '/driverdashboard' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-[45%] bg-white flex items-center justify-center px-[35px]">
        <img src={logo} alt="Logo" className="w-full" />
      </div>

      {/* Right Section */}
      <div className="w-[55%] bg-[#f9fafb] flex flex-col justify-center px-24">
        <h2 className="text-[32px] archivosemibold text-center mb-[62px]">Forgot Password</h2>

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

        <form onSubmit={handleVerify} className="mt-[20px]">
          <div className="mb-4 text-center">
            <label className="block text-[14px] text-[#555555] inter-semibold mb-1 text-left ml-[17.5%]">Enter OTP</label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  className="w-[72px] h-[67px] border border-gray-300 rounded-md text-center me-[12px] text-[14px]"
                  required
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-[65%] ml-[17.5%] mt-[32px] bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium mb-4 h-[48px]"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinVarification;