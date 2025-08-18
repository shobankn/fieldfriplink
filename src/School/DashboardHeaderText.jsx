import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderText = () => {
    const navigate = useNavigate();
  return (
    <div className=" p-4 ">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-[30px] md:text-3xl archivo-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Welcome back! Here's what's happening with your school transportation.</p>
          </div>
          <button onClick={()=> navigate('/post-trip')} className=" cursor-pointer mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red-600 transition duration-200">
            Post New Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderText;