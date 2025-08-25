import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { LogOut, AlertTriangle, X, User } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import "react-loading-skeleton/dist/skeleton.css";
import profilePlaceholder from "../images/profile/profile4.jpeg"; // fallback image
import { toast } from "react-toastify";

export default function SidebarFooter() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return; // We'll handle toast in logout
        }

        const res = await axios.get(`${BaseUrl}/school/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (res.status !== 200) throw new Error("Failed to fetch profile");

        setProfileData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Show confirmation modal
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  // ✅ Actual logout function
  const confirmLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have been logged out successfully!");
    setProfileData(null);
    setShowConfirmModal(false);
    navigate("/login");
  };

  // ✅ Cancel logout
  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  // ✅ Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowConfirmModal(false);
      }
    };

    if (showConfirmModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  // ✅ Portal Modal Component - Fully Responsive
  const ConfirmationModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Premium Backdrop with Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md transition-all duration-500 ease-out"
        onClick={cancelLogout}
        style={{
          animation: 'fadeIn 0.4s ease-out forwards'
        }}
      ></div>
      
      {/* Premium Modal Container - Responsive */}
      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-3 sm:mx-4 border border-white/20 overflow-hidden"
        style={{
          animation: 'slideInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          transformOrigin: 'center center'
        }}
      >
        {/* Gradient Header Background */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 opacity-60"></div>
        
        {/* Header - Responsive */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 md:p-8 pb-3 sm:pb-4 md:pb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-orange-400 rounded-full animate-pulse"></div>
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

        {/* Content - Responsive */}
        <div className="relative px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6">
  <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100/50 shadow-sm">
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 font-medium">
      Are you sure you want to end your session? You'll need to sign in again to access your account.
    </p>

    {profileData?.user?.name && (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative flex-shrink-0">
            {profileData?.school?.logo ? (
              <img
                src={profileData.school.logo}
                alt={profileData?.user?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-400 flex items-center justify-center border-2 border-white shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
              {profileData?.user?.name}
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


        {/* Actions - Responsive */}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 p-4 sm:p-6 md:p-8 pt-2 sm:pt-3 md:pt-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
          <button
            onClick={cancelLogout}
            className=" cursor-pointer w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3  text-sm sm:text-base font-semibold text-gray-700 bg-white/90 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm order-2 sm:order-1"
          >
            Stay Logged In
          </button>
          <button
            onClick={confirmLogout}
            className=" cursor-pointer w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 mb-2 sm:mb-0 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-500 hover:border-red-600 rounded-lg sm:rounded-xl hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg order-1 sm:order-2"
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
  <button
    onClick={handleLogoutClick}
className="flex cursor-pointer items-center content-center mx-auto justify-start space-x-3 px-4 py-4 text-sm font-medium transition-all duration-200 border-t border-gray-200 group w-full text-left"
  >
    {/* <img
      src={profileData?.school?.logo}
      alt={profileData?.user?.name || "Profile"}
      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-gray-300"
    /> */}
    <div className="flex flex-row ml-3">
      {/* If you want the name back, just uncomment this and remove Skeleton */}
      {/* <span className="text-[14px] inter-medium text-gray-700 group-hover:text-gray-900">
        {profileData?.user?.name || ""}
      </span> */}
      <LogOut className="w-5 h-5 mr-2 text-red-500 ml-auto group-hover:text-red-700 transition-colors duration-200" />
      <span className="text-[14px] inter-semibold text-red-600 flex items-center">
        Logout
      </span>
    </div>
  </button>

  {/* ✅ Portal Modal - Renders Outside Sidebar */}
  {showConfirmModal && createPortal(<ConfirmationModal />, document.body)}
</>

  );
}