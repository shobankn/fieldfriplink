import React from 'react';
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaCar,
  FaRoute,
  FaClipboardList,
  FaSchool,
  FaStar,
  FaBell,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, href: '/driverdashboard' },
    { name: 'My Profile', icon: FaUser, href: '/driverprofile' },
    { name: 'Documents', icon: FaFileAlt, href: '/documents' },
    { name: 'Available Rides', icon: FaCar, href: '/availablerides' },
    { name: 'My Rides', icon: FaRoute, href: '/myrides' },
    { name: 'My Proposals', icon: FaClipboardList, href: '/proposals' },
    { name: 'School Responses', icon: FaSchool, href: '/schoolresponse' },
    { name: 'Reviews', icon: FaStar, href: '/driverreviews' },
    { name: 'Notifications', icon: FaBell, href: '/notifications' },
  ];

  const currentPath = window.location.pathname;

  return (
    <div
      className={`fixed lg:fixed top-0 left-0 h-screen w-[80%] lg:w-[20%] bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-20 overflow-hidden`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
          onClick={toggleSidebar}
        >
          ✕
        </button>

        {/* Logo/Title */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Driver Panel</h2>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#ea4444] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2025 Transport Service
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;