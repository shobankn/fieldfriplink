import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../images/profile/profile4.jpeg';
import logo from '../images/newlogo.png';
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
  Calendar,
} from 'lucide-react';
import { GoHome } from "react-icons/go";
import { TbCurrentLocation } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import SidebarFooter from './SideBarFooter';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: GoHome, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Post Trip', path: '/post-trip' },
    { icon: Calendar, label: 'Manage Trips', path: '/trip-management' },
    { icon: TbCurrentLocation, label: 'Live Tracking', path: '/live-tracking' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: IoDocumentTextOutline, label: 'Job Posts', path: '/job-post' },
    { icon: User, label: 'Hired Drivers', path: '/hire-driver' },
    { icon: FileText, label: 'Proposal', path: '/proposal' },
    { icon: CiSettings, label: 'Settings', path: '/setting' },
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
        className={`fixed left-0 top-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:fixed lg:top-0 lg:bottom-0 lg:h-screen lg:translate-x-0 lg:z-0 flex flex-col overflow-y-auto hide-scrollbar`}
      >
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              width: 0;
              background: transparent;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <div className=" h-auto rounded flex items-center justify-center">
                <img src={logo} className="ml-2 w-18.5 h-18.5" />
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

        <nav className="mt-2 space-y-1 flex flex-col flex-1 px-4">
          <div className="flex-1">
            {menuItems.map((item, index) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/');

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center rounded-[5px] space-x-3 px-3 py-2 mt-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-500 text-white border-l-4 border-red-500 ml-0 pl-2'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="ml-2 w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex-shrink-0 pb-4">
            <SidebarFooter />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;