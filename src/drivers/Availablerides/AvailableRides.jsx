import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaMoneyBillAlt, FaExclamationTriangle } from 'react-icons/fa';

const availableRides = [
  {
    id: 1,
    school: "Green Valley School",
    tag: "daily",
    pickup: "Clifton Block 2, Karachi",
    drop: "Green Valley School, DHA Phase 5",
    date: "2025-01-25",
    time: "07:10",
    students: 25,
    budget: "15,000 - 20,000",
    note: "Female conductor required",
  },
  {
    id: 2,
    school: "City Public School",
    tag: "weekly",
    pickup: "North Nazimabad, Karachi",
    drop: "City Public School, Gulshan",
    date: "2025-01-26",
    time: "07:30",
    students: 30,
    budget: "18,000 - 25,000",
    note: "Air-conditioned bus preferred",
  },
  {
    id: 3,
    school: "Sunrise Academy",
    tag: "one-time",
    pickup: "Korangi, Karachi",
    drop: "Sunrise Academy, Malir",
    date: "2025-01-27",
    time: "08:00",
    students: 20,
    budget: "10,000 - 12,000",
    note: "Field trip to museum",
  },
];

const AvailableRides = () => {
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
          <div className="max-w-5xl mx-auto py-6">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Available Rides</h1>
                <p className="text-gray-600">Browse and send proposals for school transportation routes</p>
              </div>
              <div className="flex gap-2">
                <select className="border rounded-md px-3 py-1.5 text-sm text-gray-600">
                  <option>All Types</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>One-time</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Available</p>
                <p className="text-xl font-bold mt-1">3</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-sm text-gray-600">Daily Routes</p>
                <p className="text-xl font-bold mt-1">1</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-sm text-gray-600">Avg. Budget</p>
                <p className="text-xl font-bold mt-1">PKR 18K</p>
              </div>
            </div>

            {/* Ride Cards */}
            {availableRides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-lg shadow p-5 mb-4 relative">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{ride.school}</h2>
                    <span
                      className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ml-1 ${
                        ride.tag === 'daily'
                          ? 'bg-yellow-100 text-yellow-600'
                          : ride.tag === 'weekly'
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {ride.tag.replace('-', ' ')}
                    </span>
                  </div>
                  <button className="bg-red-500 text-white font-medium px-4 py-1.5 rounded hover:bg-red-600">
                    Send Proposal
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  <div>
                    <p className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <span className="font-medium">Pickup:</span> {ride.pickup}
                    </p>
                    <p className="flex items-center gap-2 text-sm mt-1">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <span className="font-medium">Drop:</span> {ride.drop}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt className="text-gray-600" />
                      <span className="font-medium">Date:</span> {ride.date}
                    </p>
                    <p className="flex items-center gap-2 text-sm mt-1">
                      <FaClock className="text-gray-600" />
                      <span className="font-medium">Time:</span> {ride.time}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-2">
                  <p className="flex items-center gap-2"><FaUsers /> {ride.students} students</p>
                  <p className="flex items-center gap-2"><FaMoneyBillAlt /> PKR {ride.budget}</p>
                </div>

                {ride.note && (
                  <div className="bg-yellow-50 text-yellow-700 text-sm p-2 mt-3 rounded flex items-center gap-2">
                    <FaExclamationTriangle />
                    <span>{ride.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AvailableRides;