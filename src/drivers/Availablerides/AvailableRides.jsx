import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaExclamationTriangle, FaTimes, FaCommentDots, FaCheckCircle } from 'react-icons/fa';
import { CiFilter } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { LuBus } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";

const AvailableRides = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState({});
  const [isClosingModal, setIsClosingModal] = useState(false);

  const MAX_WORDS = 500;

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleProposalMessageChange = (e) => {
    const text = e.target.value;
    const wordCount = countWords(text);
    if (wordCount <= MAX_WORDS) {
      setProposalMessage(text);
    } else {
      toast.error(`Proposal message cannot exceed ${MAX_WORDS} words.`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch driver profile
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Driver Profile Response:', response.data);
        setDriverProfile(response.data);
      } catch (err) {
        console.error('Error fetching driver profile:', err);
        const errorMessage = err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Failed to load driver profile.';
        toast.error(errorMessage);
        if (err.response?.status === 401) {
          // Optionally redirect to login page
          // window.location.href = '/login';
        }
      }
    };

    fetchDriverProfile();
  }, []);

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        setLoading(true);
        setError(null);

        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=published', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response:', response.data);

        let trips = [];
        if (response.data?.trips && Array.isArray(response.data.trips)) {
          trips = response.data.trips;
        } else if (Array.isArray(response.data)) {
          trips = response.data;
        } else if (response.data && typeof response.data === 'object') {
          trips = [response.data];
        } else {
          throw new Error('Unexpected API response format');
        }

        const mappedData = trips.map(trip => ({
          id: trip._id || Math.random().toString(36).substr(2, 9),
          school: trip.tripName || 'Unknown Trip',
          pickup: trip.pickupPoints?.map(point => point.address).join(', ') || 'Not specified',
          drop: trip.destination?.address || 'Not specified',
          date: trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'Not specified',
          time: trip.startTime ? new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not specified',
          students: trip.numberOfStudents || 0,
          note: trip.instructions || '',
          buses: trip.numberOfBuses || 'TBD',
        }));

        setAvailableRides(mappedData);
        setLoading(false);
        if (mappedData.length === 0) {
          toast.info('No available trips found.');
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
        const errorMessage = err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || err.message || 'Failed to load trips. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        if (err.response?.status === 401) {
          // Optionally redirect to login page
          // window.location.href = '/login';
        }
      }
    };

    fetchTrips();
  }, []);

  const handleSendProposal = (ride) => {
    setSelectedRide(ride);
    setProposalMessage('');
    setIsProposalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setIsProposalModalOpen(false);
      setSelectedRide(null);
      setProposalMessage('');
      setIsClosingModal(false);
    }, 500); // Simulate a short delay for the spinner
  };

  const handleSubmitProposal = async (rideId) => {
    try {
      setIsSubmittingProposal(prev => ({ ...prev, [rideId]: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal/send',
        {
          tripId: selectedRide.id,
          driverNote: proposalMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(response.data.message || 'Proposal sent successfully!');
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting proposal:', err);
      const errorMessage = err.response?.status === 401
        ? 'Session expired. Please log in again.'
        : err.response?.data?.message || 'Failed to send proposal. Please try again.';
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    } finally {
      setIsSubmittingProposal(prev => ({ ...prev, [rideId]: false }));
    }
  };

  const handleCardClick = (ride) => {
    console.log('Card clicked:', ride);
  };

  // Shimmer effect component for loading state
  const ShimmerCard = () => (
    <div className="bg-white shadow-sm rounded-lg p-5 mb-4 border border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[17%]">
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
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-[40px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div className="w-[90%]">
                <h1 className="text-[24px] archivobold mt-[18px]">Available Rides</h1>
                <p className="text-gray-600 interregular">Browse and send proposals for school transportation routes</p>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading ? (
              <div className="space-y-4">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : availableRides.length === 0 ? (
              <p className="text-gray-600">No available trips found.</p>
            ) : (
              availableRides.map((ride) => (
                <div 
                  key={ride.id} 
                  className="bg-white rounded-lg shadow p-5 mb-4 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleCardClick(ride)}
                >
                  <div className="flex justify-between items-center mb-[18px]">
                    <div>
                      <h2 className="text-[18px] archivosemibold">{ride.school}</h2>
                    </div>
                    <button 
                      className={`flex items-center justify-center gap-2 bg-[#EE5B5B] text-white font-medium px-4 py-1.5 rounded hover:bg-red-600 ${
                        isSubmittingProposal[ride.id] ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendProposal(ride);
                      }}
                      disabled={isSubmittingProposal[ride.id]}
                    >
                      {isSubmittingProposal[ride.id] ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Proposal'
                      )}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div>
                      <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                        <CiLocationOn className='text-[#EE5B5B] text-[16px]'/>
                        <span className="text-[#606060] text-[16px] archivomedium">Pickup:</span> {ride.pickup}
                      </p>
                      <p className="flex items-center gap-2 text-sm mt-1 text-[#606060] text-[16px] mb-[8px]">
                        <CiLocationOn className='text-[#EE5B5B] text-[16px]'/>
                        <span className="font-medium">Drop:</span> {ride.drop}
                      </p>
                      <p className="flex items-center gap-2 text-sm mt-1 text-[#606060] text-[16px] mb-[8px]">
                        <LuUser className='text-[#EE5B5B] text-[16px]' />
                        {ride.students} students
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm text-[#606060] text-[16px] mb-[8px]">
                        <SlCalender className='text-[#EE5B5B] text-[16px]'/>
                        <span className="font-medium">Date:</span> {ride.date}
                      </p>
                      <p className="flex items-center gap-2 text-sm mt-1 text-[#606060] text-[16px] mb-[8px]">
                        <CiClock2 className='text-[#EE5B5B] text-[16px]'/>
                        <span className="font-medium">Time:</span> {ride.time}
                      </p>
                      <p className="flex items-center gap-2 text-sm mt-1 text-[#606060] text-[16px] mb-[8px]">
                        <LuBus className='text-[#EE5B5B] text-[16px]'/>
                        <span className="font-medium">Number of Buses:</span> {ride.buses}
                      </p>
                    </div>
                  </div>

                  {ride.note && (
                    <div className="bg-[#DEE1E6] text-black text-sm p-2 mt-3 rounded flex items-center gap-2">
                      <FaCheckCircle />
                      <span className='interregular text-[14px]'>{ride.note}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Proposal Modal */}
      {isProposalModalOpen && selectedRide && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Proposal</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className={`flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                  isClosingModal ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isClosingModal}
              >
                {isClosingModal ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Closing...
                  </>
                ) : (
                  <FaTimes className="text-gray-500" />
                )}
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{driverProfile?.user?.name?.charAt(0) || 'F'}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{driverProfile?.user?.name || 'Unknown Driver'}</h4>
                    <p className="text-gray-600">{driverProfile?.user?.email || 'No email available'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">CNIC Number:</span>
                    <p className="text-gray-600">{driverProfile?.profile?.cnicNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Joined Date:</span>
                    <p className="text-gray-600">{driverProfile?.profile?.joinedDate ? new Date(driverProfile.profile.joinedDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-600">{driverProfile?.profile?.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">City:</span>
                    <p className="text-gray-600">{driverProfile?.profile?.address || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaCommentDots className="text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Proposal Message</label>
                </div>
                <textarea
                  value={proposalMessage}
                  onChange={handleProposalMessageChange}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder={`Enter your proposal message (max ${MAX_WORDS} words)...`}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Word count: {countWords(proposalMessage)}/{MAX_WORDS}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-md transition-colors duration-200 ${
                  isClosingModal ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isClosingModal}
              >
                {isClosingModal ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Closing...
                  </>
                ) : (
                  'Cancel'
                )}
              </button>
              <button
                onClick={() => handleSubmitProposal(selectedRide.id)}
                className={`flex items-center justify-center gap-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors duration-200 ${
                  isSubmittingProposal[selectedRide.id] ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmittingProposal[selectedRide.id]}
              >
                {isSubmittingProposal[selectedRide.id] ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Proposal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AvailableRides;