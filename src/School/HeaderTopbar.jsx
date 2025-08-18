import React from 'react';
import profile from '../images/profile/profile4.jpeg';
import { Menu } from 'lucide-react';

const HeaderTopBar = ({ onMenuClick }) => {
  return (
    <div className="flex items-center justify-between bg-white  border border-gray-200 p-2 ">
      {/* Left Section (Toggle Button on mobile, spacer on desktop) */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {/* Invisible spacer on desktop to maintain right alignment */}
        <div className="hidden lg:block w-12"></div>
      </div>

      {/* Profile Section (Always on the right) */}
      <div className="flex mr-4 sm:mr-8 pr-18 py-2 pl-1 items-center space-x-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors duration-200">
        <img
          src={profile}
          alt="Ahmed Khan"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="flex flex-col items-start">
          <span className="text-sm mb-1 font-semibold text-gray-900 leading-none">Ahmed Khan</span>
          <span className="flex items-center text-green-600 text-xs font-medium leading-none">
            Verified
            <svg
              className="w-4 h-4 ml-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBar;