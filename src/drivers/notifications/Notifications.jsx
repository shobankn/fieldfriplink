import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaBell, FaClock, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { MdMarkEmailRead } from 'react-icons/md';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiErrorWarningFill } from 'react-icons/ri';

const Notifications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Trip Confirmed',
      message: 'Your application for Green Valley School has been accepted!',
      time: '46m ago',
      type: 'success',
      read: true,
    },
    {
      id: 2,
      title: 'New Trip Available',
      message: 'A new trip opportunity is available in your area.',
      time: '1h ago',
      type: 'info',
      read: false,
    },
    {
      id: 3,
      title: 'Document Expiring',
      message: 'Your driving license will expire in 30 days.',
      time: '2h ago',
      type: 'warning',
      read: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const clearAll = () => setNotifications([]);

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-600" />;
      case 'info': return <AiOutlineInfoCircle className="text-blue-500" />;
      case 'warning': return <RiErrorWarningFill className="text-yellow-500" />;
      default: return <FaBell />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[20%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar drawer for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div
            className="absolute left-0 top-0 h-full w-[75%] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[80%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-gray-500">Stay updated with your ride activities</p>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="bg-white shadow-sm rounded-lg p-4 flex-1 text-center">
                <FaBell className="mx-auto text-yellow-500 text-xl" />
                <p className="text-sm text-gray-500">Total Notifications</p>
                <h2 className="text-xl font-semibold">{notifications.length}</h2>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 flex-1 text-center">
                <FaClock className="mx-auto text-pink-500 text-xl" />
                <p className="text-sm text-gray-500">Unread</p>
                <h2 className="text-xl font-semibold">
                  {notifications.filter((n) => !n.read).length}
                </h2>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 flex-1 text-center">
                <MdMarkEmailRead className="mx-auto text-yellow-500 text-xl" />
                <p className="text-sm text-gray-500">Read</p>
                <h2 className="text-xl font-semibold">
                  {notifications.filter((n) => n.read).length}
                </h2>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={markAllRead}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between p-4 rounded-lg shadow-sm ${
                    n.type === 'success' ? 'bg-green-50' :
                    n.type === 'info' ? 'bg-blue-50' :
                    n.type === 'warning' ? 'bg-yellow-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(n.type)}
                    <div>
                      <h4 className="font-semibold">{n.title}</h4>
                      <p className="text-sm text-gray-600">{n.message}</p>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && (
                      <button
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((item) =>
                              item.id === n.id ? { ...item, read: true } : item
                            )
                          )
                        }
                        title="Mark as read"
                      >
                        <MdMarkEmailRead className="text-green-600" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} title="Delete">
                      <FaTrash className="text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;