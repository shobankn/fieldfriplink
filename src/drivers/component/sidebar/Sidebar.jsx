import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { LuBox } from 'react-icons/lu';
import { FiUser } from 'react-icons/fi';
import { CgFileDocument } from 'react-icons/cg';
import { GrCar } from 'react-icons/gr';
import { IoLocationOutline } from 'react-icons/io5';
import { GoPencil } from 'react-icons/go';
import { FaRegMessage } from 'react-icons/fa6';
import { FiMessageCircle } from 'react-icons/fi';
import { FaRegStar } from "react-icons/fa";
import { FaRegBell } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../../images/logo3.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';

  const menuItems = [
    { name: 'Dashboard', icon: LuBox, href: '/driverdashboard' },
    { name: 'My Profile', icon: FiUser, href: '/driverprofile' },
    { name: 'Documents', icon: CgFileDocument, href: '/documents' },
    { name: 'Available Rides', icon: IoLocationOutline, href: '/availablerides' },
    { name: 'My Rides', icon: GrCar, href: '/myrides' },
    { name: 'My Proposals', icon: GoPencil, href: '/proposals' },
    { name: 'School Responses', icon: FaRegMessage, href: '/schoolresponse' },
    { name: 'Chat', icon: FiMessageCircle, href: '/chat' },
    { name: 'Reviews', icon: FaRegStar, href: '/driverreviews' },
    { name: 'Notifications', icon: FaRegBell, href: '/notifications' },
  ];

  // Fetch driver profile
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get(`${BaseUrl}/driver/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { user } = response.data;
        setProfileData({
          name: user.name || 'John Doe',
          profileImage: user.profileImage || '',
        });
      } catch (err) {
        console.error('Error fetching driver profile:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          setProfileData(null);
          navigate('/login');
        }
      }
    };

    fetchDriverProfile();
  }, [navigate]);

  // Token validation to sync logout across tabs
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.get(`${BaseUrl}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          setProfileData(null);
          navigate('/login');
        }
      }
    };

    validateToken();
    const intervalId = setInterval(validateToken, 10000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Handle ESC key and prevent background scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowConfirmModal(false);
      }
    };

    if (showConfirmModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  // Show confirmation modal
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  // Actual logout function
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setProfileData(null);
    setShowConfirmModal(false);
    toggleSidebar();
    navigate('/login');
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  // Portal Modal Component - Fully Responsive
  const ConfirmationModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md transition-all duration-500 ease-out"
        onClick={cancelLogout}
        style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
      ></div>
      
      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-3 sm:mx-4 border border-white/20 overflow-hidden"
        style={{
          animation: 'slideInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          transformOrigin: 'center center'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 opacity-60"></div>
        
        <div className="relative flex items-center justify-between p-4 sm:p-6 md:p-8 pb-3 sm:pb-4 md:pb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w- Preformatted text4 sm:h-4 md:w-5 md:h-5 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                Logout Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                Security verification required
              </p>
            </div>
          </div>
          <button
            onClick={cancelLogout}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group hover:scale-105 backdrop-blur-sm flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 cursor-pointer sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        <div className="relative px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100/50 shadow-sm">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 font-medium">
              Are you sure you want to end your session? You'll need to sign in again to access your account.
            </p>
            
            {profileData?.name && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative flex-shrink-0">
                    {profileData?.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt={profileData.name}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-yellow-400 flex items-center justify-center border-2 border-white shadow-md">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {profileData?.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full animate-pulse flex-shrink-0"></span>
                      <span className="truncate">Active session will be terminated</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 p-4 sm:p-6 md:p-8 pt-2 sm:pt-3 md:pt-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
          <button
            onClick={cancelLogout}
            className="cursor-pointer w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 bg-white/90 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm order-2 sm:order-1"
          >
            Stay Logged In
          </button>
          <button
            onClick={confirmLogout}
            className="cursor-pointer w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 mb-2 sm:mb-0 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-500 hover:border-red-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg order-1 sm:order-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Logout Now</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInScale {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @media (max-width: 640px) {
          @keyframes slideInScale {
            from { 
              opacity: 0;
              transform: translateY(10px) scale(0.98);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#7676767a] bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:fixed top-0 left-0 h-screen w-[80%] lg:w-[17%] bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-50 overflow-y-auto hide-scrollbar`}
        style={{ scrollbarWidth: 'none' }}
      >
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="py-0 h-full flex flex-col">
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            onClick={toggleSidebar}
          >
            ✕
          </button>

          {/* Logo/Title */}
          <div className="mb-0 mt-0 pl-[20px]">
            <h2 className="text-[18px] max-[1320px]:text-[15px] interbold text-gray-800 flex items-center gap-[10px]">
              <img src={logo} alt="FieldTripLink Logo" className="h-18.5 w-18.5 max-[1320px]:h-[15] max-[1320px]:w-[15]" /> FieldTripLink
            </h2>
          </div>

          {/* Menu Items */}
          <nav className=" space-y-1 flex flex-col flex-1 px-4">
            <div className="flex-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center rounded-[5px] space-x-3 px-3 py-2 mt-4 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#ea4444] text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    <Icon className="ml-2 w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="flex-shrink-0 pb-4">
              <button
                onClick={handleLogoutClick}
                className="flex cursor-pointer items-center content-center mx-auto justify-start space-x-3 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 bg-white hover:bg-gray-50 group w-full text-left"
              >
                <div className="flex flex-row ml-3">
                  <LogOut className="w-5 h-5 mr-2 text-red-500 group-hover:text-red-700 transition-colors duration-200" />
                  <span className="text-[14px] inter-semibold text-red-600 flex items-center">
                    Logout
                  </span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Portal Modal - Renders Outside Sidebar */}
        {showConfirmModal && createPortal(<ConfirmationModal />, document.body)}
      </div>
    </>
  );
};

export default Sidebar;