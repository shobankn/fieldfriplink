import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaExclamationTriangle, FaTimes, FaCommentDots, FaCheckCircle } from 'react-icons/fa';
import { CiFilter, CiLocationOn, CiClock2 } from "react-icons/ci";
import { LuUser, LuBus, LuCalendar } from "react-icons/lu";

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
  const [appliedProposals, setAppliedProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const MAX_WORDS = 500;

  const truncateTripName = (name) => {
    if (name.length > 20) {
      return name.substring(0, 20) + '...';
    }
    return name;
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleProposalMessageChange = (e) => {
    const text = e.target.value;
    const wordCount = countWords(text);
    if (wordCount <= MAX_WORDS) {
      setProposalMessage(text);
    } else {
      toast.dismiss();
      toast.error(`Proposal message cannot exceed ${MAX_WORDS} words.`, {
        toastId: 'proposal-word-limit',
        autoClose: 3000,
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

        setDriverProfile(response.data);
      } catch (err) {
        console.error('Error fetching driver profile:', err);
        const errorMessage = err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Failed to load driver profile.';
        toast.dismiss();
        toast.error(errorMessage, {
          toastId: 'profile-error',
          autoClose: 3000,
        });
      }
    };

    fetchDriverProfile();
  }, []);

  useEffect(() => {
    const fetchAppliedProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal?status=applied&page=1&limit=10',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.data?.proposals) {
          throw new Error('Unexpected API response format for proposals');
        }

        const appliedTripIds = response.data.proposals
          .filter(proposal => proposal.tripId && proposal.status.toLowerCase() === 'applied')
          .map(proposal => proposal.tripId._id);

        setAppliedProposals(appliedTripIds);
      } catch (err) {
        console.error('Error fetching applied proposals:', err);
        setAppliedProposals([]);
      }
    };

    fetchAppliedProposals();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=published&page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let trips = [];
        let total = 1;
        let responseLimit = limit;

        if (response.data?.trips && Array.isArray(response.data.trips)) {
          trips = response.data.trips;
          total = response.data.total || 1;
          responseLimit = response.data.limit || limit;
        } else if (Array.isArray(response.data)) {
          trips = response.data;
        } else if (response.data && typeof response.data === 'object') {
          trips = [response.data];
        } else {
          throw new Error('Unexpected API response format');
        }

        const dayMap = {
          mon: 'Monday',
          tue: 'Tuesday',
          wed: 'Wednesday',
          thu: 'Thursday',
          fri: 'Friday',
          sat: 'Saturday',
          sun: 'Sunday'
        };

        const mappedData = trips.map(trip => ({
          id: trip._id || Math.random().toString(36).substr(2, 9),
          schoolName: trip.schoolId?.schoolName || 'Unknown School',
          school: trip.tripName || 'Unknown Trip',
          pickup: trip.pickupPoints?.map(point => point.address).join(', ') || 'Not specified',
          drop: trip.destination?.address || 'Not specified',
          isRecurring: trip.tripType === 'recurring',
          date: trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'Not specified',
          startTime: trip.startTime ? new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not specified',
          endTime: trip.returnTime ? new Date(trip.returnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not specified',
          students: trip.numberOfStudents || 0,
          note: trip.instructions || '',
          buses: trip.numberOfBuses || 'TBD',
          postedDate: trip.createdAt
            ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : 'Not specified'
        }));

        setAvailableRides(mappedData);
        setTotalPages(Math.ceil(total / responseLimit));
        setLoading(false);
        if (mappedData.length === 0) {
          toast.dismiss();
          toast.info('No available trips found.', {
            toastId: 'no-trips',
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
        const errorMessage = err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || err.message || 'Failed to load trips. Please try again.';
        setError(errorMessage);
        toast.dismiss();
        toast.error(errorMessage, {
          toastId: 'trips-error',
          autoClose: 3000,
        });
        setLoading(false);
      }
    };

    fetchTrips();
  }, [currentPage]);

  const handleSendProposal = (ride) => {
    setSelectedRide(ride);
    setProposalMessage('');
    setIsProposalModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isClosingModal) return;
    setIsClosingModal(true);
    setTimeout(() => {
      setIsProposalModalOpen(false);
      setSelectedRide(null);
      setProposalMessage('');
      setIsClosingModal(false);
      toast.dismiss();
    }, 300);
  };

  const handleSubmitProposal = async (rideId) => {
    if (isSubmittingProposal[rideId]) return;
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

      toast.dismiss();
      toast.success(response.data.message || 'Proposal sent successfully!', {
        toastId: 'proposal-success',
        autoClose: 2000,
      });

      setAppliedProposals(prev => [...prev, selectedRide.id]);
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting proposal:', err);
      const errorMessage = err.response?.status === 401
        ? 'Session expired. Please log in again.'
        : err.response?.data?.message || 'Failed to send proposal. Please try again.';
      toast.dismiss();
      toast.error(errorMessage, {
        toastId: 'proposal-error',
        autoClose: 2000,
      });
    } finally {
      setIsSubmittingProposal(prev => ({ ...prev, [rideId]: false }));
    }
  };

  const handleCardClick = (ride) => {
    console.log('Card clicked:', ride);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

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
              <>
                {availableRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className="bg-white rounded-lg shadow p-5 mb-4 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => handleCardClick(ride)}
                  >
                    <div className="flex justify-between items-center mb-[18px]">
                      <div>
                        <h2 className="text-[18px] archivosemibold">{truncateTripName(ride.school)}</h2>
                        <p className="text-[16px] interregular text-gray-500">
                         {ride.schoolName} ({ride.postedDate}) 
                        </p>
                      </div>
                      <button 
                        className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded font-medium text-white ${
                          appliedProposals.includes(ride.id)
                            ? 'bg-[#F0B100] cursor-not-allowed'
                            : 'bg-[#EE5B5B] hover:bg-red-600'
                        } ${isSubmittingProposal[ride.id] ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!appliedProposals.includes(ride.id)) {
                            handleSendProposal(ride);
                          }
                        }}
                        disabled={isSubmittingProposal[ride.id] || appliedProposals.includes(ride.id)}
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
                        ) : appliedProposals.includes(ride.id) ? (
                          'Applied'
                        ) : (
                          'Send Proposal'
                        )}
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                      <div>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <CiLocationOn className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">Pickup:</span> <span className="interregular">{ride.pickup}</span>
                        </p>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <CiLocationOn className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">Drop:</span> <span className="interregular">{ride.drop}</span>
                        </p>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <LuUser className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">{ride.students} students</span> <span className="interregular"></span>
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <LuCalendar className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">{ride.isRecurring ? 'Days' : 'Date'}:</span> <span className="interregular">{ride.date}</span>
                        </p>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <CiClock2 className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">Start Time:</span> <span className="interregular">{ride.startTime}</span> - <span className="font-medium">End Time:</span> <span className="interregular">{ride.endTime}</span>
                        </p>
                        <p className="flex items-center gap-2 text-[#606060] text-[16px] mb-[8px]">
                          <LuBus className="text-[#EE5B5B] w-5 h-5 flex-shrink-0"/>
                          <span className="font-medium">Number of Buses:</span> <span className="interregular">{ride.buses}</span>
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
                ))}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#EE5B5B] text-white hover:bg-red-600'}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#EE5B5B] text-white hover:bg-red-600'}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />
    </div>
  );
};

export default AvailableRides;