import React, { useEffect, useState } from 'react';
import profile from '../images/profile/profile4.jpeg';
import { Clock, Menu } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdPending } from 'react-icons/md';

const HeaderTopBar = ({ onMenuClick }) => {
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required. Please log in.');
          return;
        }

        const res = await axios.get(`${BaseUrl}/school/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setProfileData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error(err.response?.data?.message || 'Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 p-2">
      {/* Left Section */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden lg:block w-12"></div>
      </div>

      {/* Profile Section */}
      <div className="flex mr-4 sm:mr-8 pr-18 py-2 pl-1 items-center space-x-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors duration-200">
  <img
    src={profileData?.school?.logo}
    alt={profileData?.user?.name}
    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
  />
  <div className="flex flex-col items-start">
    <span className="text-sm mb-1 font-semibold text-gray-900 leading-none">
      {profileData?.user?.name}
    </span>

    {profileData?.user?.accountStatus === "active" ? (
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
    ) : (
      <span className="flex items-center text-yellow-500 text-xs font-medium leading-none">
        Pending
        <Clock className="w-3.4 h-3.5 ml-0.5" />
      </span>
    )}
  </div>
</div>

    </div>
  );
};

export default HeaderTopBar;
