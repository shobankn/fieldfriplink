import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { LuPlane, LuClock4, LuMapPin, LuUsers, LuCalendar, LuClock, LuBus } from 'react-icons/lu';
import { HiOutlineCalendarDateRange } from "react-icons/hi2";

const MyProposals = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Fixed limit as per API

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal?status=applied&page=${currentPage}&limit=${limit}`,
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }

        const data = await response.json();
        const { proposals: fetchedProposals, total, limit: responseLimit } = data;

        const dayMap = {
          mon: 'Monday',
          tue: 'Tuesday',
          wed: 'Wednesday',
          thu: 'Thursday',
          fri: 'Friday',
          sat: 'Saturday',
          sun: 'Sunday'
        };

        const mappedProposals = fetchedProposals.map((proposal) => {
          if (!proposal.tripId) {
            return {
              id: proposal._id,
              school: 'Unknown School',
              job: 'Unknown Trip',
              pickup: 'N/A',
              drop: 'N/A',
              students: 0,
              date: 'N/A',
              isRecurring: false,
              startTime: 'N/A',
              endTime: 'N/A',
              buses: 0,
              status: proposal.status,
              message: proposal.driverNote,
              submitted: calculateSubmittedTime(proposal.submittedAt),
            };
          }

          const trip = proposal.tripId;
          const startDate = new Date(trip.startTime || trip.tripDate || Date.now());
          const endDate = new Date(trip.returnTime || Date.now());
          const dateStr = trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'Not specified';
          const startTimeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const submittedStr = calculateSubmittedTime(proposal.submittedAt);

          return {
            id: proposal._id,
            school: trip.schoolId?.schoolName || 'Unknown School',
            job: trip.tripName || 'Unknown Trip',
            pickup: trip.pickupPoints?.[0]?.address || 'N/A',
            drop: trip.destination?.address || 'N/A',
            students: trip.numberOfStudents || 0,
            date: dateStr,
            isRecurring: trip.tripType === 'recurring',
            startTime: startTimeStr,
            endTime: endTimeStr,
            buses: trip.numberOfBuses || 0,
            status: proposal.status,
            message: proposal.driverNote,
            submitted: submittedStr,
          };
        });

        setProposals(mappedProposals);
        setTotalPages(Math.ceil(total / responseLimit));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setProposals([]);
        setTotalPages(1);
        setLoading(false);
      }
    };

    const calculateSubmittedTime = (submittedAt) => {
      const submittedDate = new Date(submittedAt);
      const timeDiff = Math.floor((Date.now() - submittedDate) / (1000 * 60 * 60 * 24));
      return timeDiff === 0 ? 'Today' : `${timeDiff} day${timeDiff > 1 ? 's' : ''} ago`;
    };

    fetchProposals();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const ShimmerCard = () => (
    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 mb-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="mt-2 h-3 bg-gray-200 rounded w-24"></div>
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

        <main className="flex-1 overflow-y-auto pt-16 px-[33px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <div className="mb-6">
              <h1 className="archivobold text-[24px] mt-[18px]">My Proposals</h1>
              <p className="text-gray-500">Track your sent ride proposals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white shadow-sm rounded-lg p-4 flex justify-center items-center">
                <div className="flex items-center">
                  <LuPlane className="text-yellow-500 text-2xl mr-2" />
                  <div className="">
                    <p className="text-sm text-gray-500">Total Sent</p>
                    <h2 className="text-xl font-semibold">{proposals.length}</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 flex justify-center items-center">
                <div className="flex items-center">
                  <LuClock4 className="text-pink-500 text-2xl mr-4" />
                  <div className="">
                    <p className="text-sm text-gray-500">Pending Response</p>
                    <h2 className="text-xl font-semibold">
                      {proposals.filter(p => p.status.toLowerCase() === 'pending' || p.status.toLowerCase() === 'applied').length}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : proposals.length > 0 ? (
              <>
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">{proposal.job.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="text-[16px] archivomedium">{proposal.job}</h3>
                            <p className="text-[16px] flex gap-[10px] items-center interregular text-gray-500">
                              <HiOutlineCalendarDateRange className='text-[#EF4444]' />
                              {proposal.isRecurring ? 'Days: ' : 'Date: '} {proposal.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`text-xs px-4 py-1.5 rounded font-medium text-white ${
                            proposal.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            proposal.status.toLowerCase() === 'applied' ? 'bg-[#F0B100]' :
                            proposal.status.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-800' :
                            proposal.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-[10px]">
                          <LuMapPin className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">Pickup:</span> {proposal.pickup}</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <LuMapPin className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">Drop:</span> {proposal.drop}</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <LuUsers className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">Students:</span> {proposal.students}</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <LuCalendar className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">{proposal.isRecurring ? 'Days' : 'Date'}:</span> {proposal.date}</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <LuClock className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">Start Time:</span> {proposal.startTime} </span> - 
                          <span className="interregular"><span className="font-medium">End Time:</span> {proposal.endTime}</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <LuBus className="text-[#EF4444]" />
                          <span className="interregular"><span className="font-medium">Buses:</span> {proposal.buses}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-blue-500 bg-[#EEF2FF] p-2 rounded"><span className='text-[14px] inter-medium text-[#374151]'>Proposal Message:</span> <br></br> <span className='interregular text-[14px] text-[#4B5563]'>{proposal.message}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
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
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-10 text-center">
                <div className="flex justify-center mb-4">
                  <LuPlane className="text-gray-400 text-4xl" />
                </div>
                <h2 className="text-lg font-medium mb-2">No proposals sent yet</h2>
                <p className="text-sm text-gray-500 mb-4">Start sending proposals for available rides</p>
                <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm">
                  Browse Available Rides
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProposals;