import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';

const rideData = {
  Scheduled: [
    {
      id: 101,
      school: "Beacon House School",
      area: "Defence, Karachi",
      pickup: "Bahadurabad, Karachi",
      drop: "Beacon House Defence",
      date: "2025-01-28",
      time: "08:00",
      students: 20,
      phone: "+92 21 123-4567",
    },
    {
      id: 102,
      school: "Oxford Grammar School",
      area: "Gulberg, Karachi",
      pickup: "PECHS, Karachi",
      drop: "Oxford Grammar School, Gulberg",
      date: "2025-01-29",
      time: "07:45",
      students: 28,
      phone: "+92 21 234-5678",
    },
    {
      id: 103,
      school: "Beaconhouse School System",
      area: "DHA Phase 6, Karachi",
      pickup: "Phase 4, Karachi",
      drop: "Beaconhouse School System, Phase 6",
      date: "2025-01-30",
      time: "07:20",
      students: 27,
      phone: "+92 21 234-5678",
    },
  ],
  Active: [
    {
      id: 4,
      school: "Elite International School",
      area: "Clifton, Karachi",
      pickup: "DHA Phase 2, Karachi",
      drop: "Elite International School, Clifton",
      date: "2025-01-22",
      time: "07:30",
      students: 22,
      phone: "+92 21 345-6789",
    },
  ],
  Completed: [
    {
      id: 1,
      school: "Al-Huda School",
      area: "Nazimabad, Karachi",
      pickup: "Federal B Area, Karachi",
      drop: "Al-Huda School, Nazimabad",
      date: "2025-01-15",
      time: "07:00",
      students: 18,
      phone: "+92 21 456-7890",
    },
    {
      id: 2,
      school: "Karachi Grammar School",
      area: "Saddar, Karachi",
      pickup: "Garden, Karachi",
      drop: "Karachi Grammar School, Saddar",
      date: "2025-01-14",
      time: "08:00",
      students: 35,
      phone: "+92 21 567-8901",
    },
    {
      id: 3,
      school: "The City School",
      area: "Gulshan, Karachi",
      pickup: "Johar, Karachi",
      drop: "The City School, Gulshan",
      date: "2025-01-13",
      time: "09:00",
      students: 40,
      phone: "+92 21 678-9012",
    },
  ],
};

const MyRIdes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Completed");

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
            <h1 className="text-2xl font-bold mb-1">My Rides</h1>
            <p className="text-gray-600 mb-6">Manage your scheduled, active, and completed rides</p>

            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6">
              {["Scheduled", "Active", "Completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-medium ${
                    activeTab === tab
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {tab}{" "}
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-1">
                    {rideData[tab].length}
                  </span>
                </button>
              ))}
            </div>

            {/* Ride Cards */}
            {rideData[activeTab].length > 0 ? (
              rideData[activeTab].map((ride) => (
                <div key={ride.id} className="bg-white rounded-lg shadow p-5 mb-4 relative">
                  {/* Live badge for Active tab */}
                  {activeTab === "Active" && (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      ● Live
                    </span>
                  )}

                  <h2 className="text-lg font-semibold">{ride.school}</h2>
                  <p className="text-sm text-gray-500">{ride.area}</p>

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

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-600 flex-wrap gap-2">
                    <p>{ride.students} students</p>
                    <p className="flex items-center gap-2">
                      <FaPhoneAlt className="text-gray-600" /> {ride.phone}
                    </p>

                    {activeTab === "Completed" && (
                      <p className="text-green-600 flex items-center gap-2">
                        <FaCheckCircle /> Completed
                      </p>
                    )}

                    {activeTab === "Active" && (
                      <button className="bg-red-500 text-white flex items-center gap-1 px-4 py-1.5 rounded-md text-sm hover:bg-red-600 ml-auto">
                        <FiPlay /> View Live
                      </button>
                    )}

                    {activeTab === "Scheduled" && (
                      <button className="bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-500 ml-auto">
                        Start Ride
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">No {activeTab.toLowerCase()} rides found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyRIdes;