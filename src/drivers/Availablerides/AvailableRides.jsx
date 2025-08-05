import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaMoneyBillAlt, FaExclamationTriangle, FaTimes, FaCommentDots } from 'react-icons/fa';

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
  const [selectedRide, setSelectedRide] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendProposal = (ride) => {
    setSelectedRide(ride);
    setProposalMessage(`I specialize in school transportation and have been handling school events including sports competitions, cultural programs, and educational trips. I ensure timely pickup and drop-off with complete safety measures. I specialize in event transportation and have handled numerous school events including sports competitions, cultural programs, and educational trips. I ensure timely pickup and drop-off with complete safety measures. I specialize in event transportation and have handled numerous school events including sports competitions, cultural programs, and educational trips. I ensure timely pickup and drop-off with complete safety measures.`);
    setIsProposalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProposalModalOpen(false);
    setSelectedRide(null);
    setProposalMessage('');
  };

  const handleSubmitProposal = () => {
    // Handle proposal submission logic here
    console.log('Proposal submitted for:', selectedRide);
    console.log('Message:', proposalMessage);
    handleCloseModal();
  };

  const handleCardClick = (ride) => {
    // Handle card click - could navigate to detail view or show more info
    console.log('Card clicked:', ride);
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
          <div className="max-w-full mx-auto py-6">
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
              <div 
                key={ride.id} 
                className="bg-white rounded-lg shadow p-5 mb-4 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleCardClick(ride)}
              >
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
                  <button 
                    className="bg-red-500 text-white font-medium px-4 py-1.5 rounded hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendProposal(ride);
                    }}
                  >
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

      {/* Proposal Modal */}
      {isProposalModalOpen && selectedRide && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Proposal</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Driver Profile Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Fahad Sheikh</h4>
                    <p className="text-gray-600">fahadsheikh@gmail.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">CNIC Number:</span>
                    <p className="text-gray-600">35202-2345678-9</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Joined Date:</span>
                    <p className="text-gray-600">January 2019</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">School Partner:</span>
                    <p className="text-gray-600">Apartment 5B, Green Valley, Lahore</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">City:</span>
                    <p className="text-gray-600">Lahore</p>
                  </div>
                </div>
              </div>

              {/* Proposal Message Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaCommentDots className="text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Proposal Message</label>
                </div>
                <textarea
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Enter your proposal message..."
                />
              </div>

            
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProposal}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors duration-200"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableRides;