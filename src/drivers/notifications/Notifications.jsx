import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { FiBell } from 'react-icons/fi';
import { RiErrorWarningFill } from 'react-icons/ri';

// Debounce function to limit rapid toast triggers
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Notifications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toast function with unique ID and debouncing
  const showToast = debounce((message, type = 'error', toastId) => {
    toast.dismiss(); // Clear all existing toasts
    toast(message, {
      toastId, // Unique ID to prevent duplicates
      type,
      autoClose: 2000, // Close after 2 seconds
      closeOnClick: true,
      pauseOnHover: false,
    });
  }, 300); // 300ms debounce to prevent rapid triggers

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('Authentication required. Please log in.', 'error', 'auth-error');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { data } = response.data;
        const mappedNotifications = data.map((notification) => {
          const notificationDate = new Date(notification.createdAt);
          const timeDiff = Math.floor((Date.now() - notificationDate) / (1000 * 60));
          const timeStr =
            timeDiff < 60
              ? `${timeDiff}m ago`
              : timeDiff < 1440
              ? `${Math.floor(timeDiff / 60)}h ago`
              : `${Math.floor(timeDiff / 1440)}d ago`;

          return {
            id: notification._id,
            title: notification.title || 'Notification',
            message: notification.body || 'No message provided.',
            time: timeStr,
            type: notification.type || 'info',
            read: notification.isRead || false,
          };
        });

        setNotifications(mappedNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error.response || error.message);
        showToast(
          error.response?.data?.message || 'Failed to fetch notifications',
          'error',
          'fetch-error'
        );
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const clearAll = async () => {
    try {
      setClearing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication required. Please log in.', 'error', 'auth-clear-error');
        setClearing(false);
        return;
      }

      await axios.delete(
        'https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications/clearall',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications([]);
      showToast('All notifications cleared', 'success', 'clear-success');
      setClearing(false);
    } catch (error) {
      console.error('Error clearing notifications:', error.response || error.message);
      showToast(
        error.response?.data?.message || 'Failed to clear notifications',
        'error',
        'clear-error'
      );
      setClearing(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication required. Please log in.', 'error', `auth-delete-${id}`);
        return;
      }

      await axios.delete(
        `https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showToast('Notification deleted', 'success', `delete-success-${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error.response || error.message);
      showToast(
        error.response?.data?.message || 'Failed to delete notification',
        'error',
        `delete-error-${id}`
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
      case 'invitation':
        return <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" />;
      case 'info':
        return <AiOutlineInfoCircle className="text-blue-500 text-xl sm:text-2xl" />;
      case 'warning':
        return <RiErrorWarningFill className="text-yellow-500 text-xl sm:text-2xl" />;
      default:
        return <FaBell className="text-xl sm:text-2xl" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        limit={1}
      />
      {/* Sidebar for large screens */}
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar drawer for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div
            className="absolute left-0 top-0 h-full w-[75%] sm:w-[60%] max-w-[300px] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-[33px] bg-gray-50 ">
          <div className="max-w-full mx-auto py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="archivobold text-[24px] mt-[18px]">Notifications</h1>
                <p className="text-xs sm:text-sm lg:text-[16px] interregular text-[#64748B]">
                  Stay updated with your ride activities
                </p>
              </div>
              <div className="flex gap-2 items-center mt-4 sm:mt-0">
                <button
                  onClick={clearAll}
                  disabled={clearing}
                  className={`bg-red-500 flex items-center gap-2 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                    clearing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {clearing ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7老.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <MdOutlineDeleteForever className="text-sm sm:text-lg" />
                  )}
                  Clear all
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="bg-white shadow-sm rounded-lg p-4 flex-1 flex items-center gap-3">
                <div className="bg-[#FFDE67] h-10 w-10 sm:h-[48px] sm:w-[48px] flex items-center justify-center rounded-full">
                  <FiBell className="text-lg sm:text-[24px]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Total Notifications</p>
                  <h2 className="text-lg sm:text-xl font-semibold text-left">{notifications.length}</h2>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 flex-1 flex items-center gap-3">
                <div className="bg-[#E0E0E0] h-10 w-10 sm:h-[48px] sm:w-[48px] flex items-center justify-center rounded-full">
                  <FaCheckCircle className="text-lg sm:text-[24px] interregular" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Read</p>
                  <h2 className="text-lg sm:text-xl font-semibold text-left">
                    {notifications.filter((n) => n.read).length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <div className="bg-white shadow-sm rounded-lg p-0 m-0 pl-[10px] sm:pl-[10px] sm:p-0 sm:m-0 lg:p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg p-0 m-0 pl-[10px] sm:pl-[10px] sm:p-0 sm:m-0 lg:p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-0 m-0 pl-[10px] sm:pl-[10px] sm:p-0 sm:m-0 lg:p-4 lg:pl-4 rounded-lg shadow-sm ${
                      n.type === 'success' || n.type === 'invitation'
                        ? 'bg-[#F7FFF7] border border-[#E6F7E6]'
                        : n.type === 'info'
                        ? 'bg-[#F7F9FF] border border-[#E0E6F7]'
                        : n.type === 'warning'
                        ? 'bg-white'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(n.type)}
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{n.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{n.message}</p>
                        <span className="text-[10px] sm:text-xs text-gray-400">{n.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => deleteNotification(n.id)}
                        title="Delete notification"
                        className="p-1 sm:p-2"
                      >
                        <MdOutlineDeleteForever className="text-[#94a3b8] text-base sm:text-lg" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-0 m-0 pl-[10px] sm:pl-[10px] sm:p-0 sm:m-0 lg:p-10 lg:pl-10 text-center">
                  <FiBell className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h2 className="text-lg font-medium mb-2">No notifications</h2>
                  <p className="text-sm text-gray-500">You’re all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;