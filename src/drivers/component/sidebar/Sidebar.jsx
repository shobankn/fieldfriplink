import React from 'react';
import { LuBox } from 'react-icons/lu';
import { FiUser } from 'react-icons/fi';
import { CgFileDocument } from 'react-icons/cg';
import { GrCar } from 'react-icons/gr';
import { IoLocationOutline } from 'react-icons/io5';
import { GoPencil } from 'react-icons/go';
import { FaRegMessage } from 'react-icons/fa6';
import { FiMessageCircle } from 'react-icons/fi';
import { CiStar } from 'react-icons/ci';
import { FaRegBell } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import top1 from '../../../images/top.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LuBox, href: '/driverdashboard' },
    { name: 'My Profile', icon: FiUser, href: '/driverprofile' },
    { name: 'Documents', icon: CgFileDocument, href: '/documents' },
    { name: 'Available Rides', icon: IoLocationOutline, href: '/availablerides' },
    { name: 'My Rides', icon: GrCar, href: '/myrides' },
    { name: 'My Proposals', icon: GoPencil, href: '/proposals' },
    { name: 'School Responses', icon: FaRegMessage, href: '/schoolresponse' },
    { name: 'Chat', icon: FiMessageCircle, href: '/chat' },
    { name: 'Reviews', icon: CiStar, href: '/driverreviews' },
    { name: 'Notifications', icon: FaRegBell, href: '/notifications' },
  ];

  return (
    <div
      className={`fixed lg:fixed top-0 left-0 h-screen w-[80%] lg:w-[20%] bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-20 overflow-hidden`}
    >
      <div className="py-4 h-full flex flex-col">
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
          onClick={toggleSidebar}
        >
          ✕
        </button>

        {/* Logo/Title */}
        <div className="mb-8">
          <h2 className="text-[18px] interbold text-gray-800 flex ps-[10px] gap-[10px]">
            <img src={top1} alt="FieldTripLink Logo" /> FieldTripLink
          </h2>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-0 transition-colors duration-200 relative ${
                        isActive
                          ? 'bg-[#ea4444] text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    <div className="absolute inset-0 bg-inherit z-[-1]" />
                    <div className="flex items-center gap-3 pl-[25px]">
                      <Icon className="text-lg" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
         
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-0 transition-colors duration-200 relative ${
                isActive
                  ? 'bg-[#ea4444] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
            onClick={toggleSidebar}
          >
            <div className="absolute inset-0 bg-inherit z-[-1]" />
            <div className="flex items-center gap-3 pl-[25px]">
              <IoIosLogOut className="text-lg" />
              <span className="font-medium">Logout</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;