import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { Calendar, CalendarHeart, CalendarHeartIcon, CircleCheckIcon, MessageSquare, Star, Users } from 'lucide-react';
import { SlCalender } from 'react-icons/sl';

const Driverdashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <div className="max-w-full mx-auto py-6 px-0 sm:px-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl archivo-bold text-gray-800">Welcome back, Ahmed Khan!</h1>
              <p className="text-gray-600 inter-regular  mt-1">Here is your driving dashboard overview</p>
            </div>

            {/* Verified Driver Alert */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 inter-semibold">Verified Driver</p>
                <p className="text-green-700 inter-regular text-sm">You have been verified and approved for rides</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Rating Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FFFBEB] rounded-full flex items-center justify-center mr-4">
                   
                    <Star className='text-[#FBBF24]'/>
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Rating</p>
                    <p className="text-2xl font-bold text-gray-800">4.7</p>
                  </div>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    
                    <CalendarHeartIcon className='text-red-500'/>
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-800">2</p>
                  </div>
                </div>
              </div>

              {/* Available Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    
                    <MessageSquare className='text-red-500'/>
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Proposals</p>
                    <p className="text-2xl font-bold text-gray-800">7</p>
                  </div>
                </div>
              </div>

              {/* Approved Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  
                    <Calendar className='text-red-500'/>
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Schedule</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Ride */}
            <div className="bg-red-500 text-white rounded-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                  <h3 className="text-lg inter-semibold mb-1">Active Ride</h3>
                  <p className="text-red-100 inter-regular mb-2">Elite International School</p>
                  <p className="text-red-100 inter-regular  text-sm">Distance: 5.2 km | Expected: 15 mins</p>
                </div>
                <button className="bg-white mt-4 whitespace-nowrap inter-regular text-red-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  View Live
                </button>
              </div>
            </div>

            {/* Upcoming Rides */}
            <div className="bg-white rounded-lg shadow-sm  p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {/* Ride 1 */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Beacon House School</p>
                      <p className="text-sm text-gray-600">2024-03-25 at 08:00</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                   
                    <Users className='mr-1 w-4 h-4'/>
                    <span className="text-sm">25 students</span>
                  </div>
                </div>

                {/* Ride 2 */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Oxford Grammar School</p>
                      <p className="text-sm text-gray-600">2024-03-25 at 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className='mr-1 w-4 h-4'/>
                    <span className="text-sm">18 students</span>
                  </div>
                </div>

                {/* Ride 3 */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Elite International School</p>
                      <p className="text-sm text-gray-600">2024-03-26 at 07:30</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                   <Users className='mr-1 w-4 h-4'/>
                    <span className="text-sm">30 students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Ride Offers */}
             <div className="bg-white mb-6 p-6 rounded-lg shadow-md border border-gray-200 flex  flex-col sm:flex-row justify-between items-center w-full">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">New Ride Offers</h3>
                <p className="text-gray-600 text-sm">3 new ride offers available in your area</p>
                <p className="text-gray-600 text-sm">Send proposals now to secure these routes</p>
              </div>
              <button className="bg-red-500 mt-4 whitespace-nowrap text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                View Offers
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm  p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {/* Activity 1 */}
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#ECFDF5] rounded-full flex items-center justify-center mr-4 mt-1">
                  
                    <CircleCheckIcon className='h-4 w-4 text-[#10B981]'/>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Proposal accepted by Green Valley School</p>
                    <p className="text-gray-600 text-sm">2 days ago</p>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#FFFBEB] rounded-full flex items-center justify-center mr-4 mt-1">
                    <MessageSquare className='w-4 h-4 text-[#FBBF24]'/>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">New proposal to City Public School</p>
                    <p className="text-gray-600 text-sm">3 days ago</p>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#FEF2F2] rounded-full flex items-center justify-center mr-4 mt-1">
                   
                    <Star className='h-4 w-4 text-red-500'/>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Received 5 star review from Beacon House</p>
                    <p className="text-gray-600 text-sm">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Driverdashboard;