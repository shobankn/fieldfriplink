import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../images/profile/profile4.jpeg';
import {
  LayoutDashboard,
  Plus,
  Route,
  MapPin,
  MessageSquare,
  CreditCard,
  FileText,
  Settings,
  Bus,
  X,
  User,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Post Trip', path: '/post-trip' },
    { icon: Route, label: 'Manage Trips', path: '/trip-management' },
    { icon: MapPin, label: 'Live Tracking', path: '/live-tracking' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: CreditCard, label: 'Job Posts', path: '/job-post' },
    { icon: User, label: 'Hired Drivers', path: '/hire-driver' },
    { icon: FileText, label: 'Proposal', path: '/proposal' },
    { icon: Settings, label: 'Settings', path: '/setting' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 min-h-screen top-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:fixed lg:top-0 lg:bottom-0 lg:h-screen lg:translate-x-0 lg:z-0 flex flex-col`}
      >
        <div className="p-[17px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">FieldTrip Link</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-6 space-y-1 flex flex-col flex-1">
          <div className="flex-1">
            {menuItems.map((item, index) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/');

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 mt-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-500 text-white border-l-4 border-red-500 ml-0 pl-2'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <Link
            to="/logout"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md border border-gray-200 hover:border-gray-300 group"
          >
            <img
              src={profile}
              alt="Ahmed Khan"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-gray-300"
            />
            <div className="flex flex-col ml-3">
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                Ahmed Khan
              </span>
              <span className="text-xs font-semibold text-red-600 flex items-center">
                Logout
              </span>
            </div>
            <LogOut className="w-5 h-5 text-red-500 ml-auto group-hover:text-red-700 transition-colors duration-200" />
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;