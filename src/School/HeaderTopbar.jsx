import React, { useEffect, useState } from 'react';
import { Clock, Menu, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
        {/* Avatar */}
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse border-2 border-white shadow-sm" />
        ) : profileData?.school?.logo ? (
          <img
            src={profileData.school.logo}
            alt={profileData?.user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center border-2 border-white shadow-sm">
            <User className="w-6 h-6 text-white" />
          </div>
        )}

        {/* User Info */}
        <div className="flex flex-col items-start">
          {loading ? (
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="text-sm mb-1 my-auto font-semibold text-gray-900 leading-none">
              {profileData?.user?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBar;
