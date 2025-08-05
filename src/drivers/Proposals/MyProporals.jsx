import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaPaperPlane, FaClock, FaDollarSign } from 'react-icons/fa';

const MyProposals = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Proposals</h1>
              <p className="text-gray-500">Track your sent ride proposals</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <FaPaperPlane className="text-yellow-500 text-2xl mx-auto mb-1" />
                <p className="text-sm text-gray-500">Total Sent</p>
                <h2 className="text-xl font-semibold">0</h2>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <FaClock className="text-pink-500 text-2xl mx-auto mb-1" />
                <p className="text-sm text-gray-500">Pending Response</p>
                <h2 className="text-xl font-semibold">0</h2>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <FaDollarSign className="text-yellow-500 text-2xl mx-auto mb-1" />
                <p className="text-sm text-gray-500">Total Proposed</p>
                <h2 className="text-xl font-semibold">PKR 0</h2>
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-white shadow-sm rounded-lg p-10 text-center">
              <div className="flex justify-center mb-4">
                <FaPaperPlane className="text-gray-400 text-4xl" />
              </div>
              <h2 className="text-lg font-medium mb-2">No proposals sent yet</h2>
              <p className="text-sm text-gray-500 mb-4">Start sending proposals for available rides</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm">
                Browse Available Rides
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProposals;