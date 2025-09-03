import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoChatbubbleOutline, IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';

const SchoolResponse = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [schoolResponseData, setSchoolResponseData] = useState({
    stats: {
      totalResponses: 0,
      approved: 0,
      rejected: 0
    },
    proposals: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle phone call
  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== 'N/A') {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Fetch both accepted and rejected proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch accepted proposals
        const acceptedResponse = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal?status=accepted&page=1&limit=10',
          {
            method: 'GET',
            headers,
          }
        );

        if (!acceptedResponse.ok) {
          throw new Error('Failed to fetch accepted proposals');
        }

        // Fetch rejected proposals
        const rejectedResponse = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal?status=rejected&page=1&limit=10',
          {
            method: 'GET',
            headers,
          }
        );

        if (!rejectedResponse.ok) {
          throw new Error('Failed to fetch rejected proposals');
        }

        const acceptedData = await acceptedResponse.json();
        const rejectedData = await rejectedResponse.json();

         console.log("✅ Accepted API Response:", acceptedData);

        // Combine proposals from both responses
        const allProposals = [...acceptedData.proposals, ...rejectedData.proposals];

        const mappedProposals = allProposals.map((proposal) => {
          const trip = proposal.tripId || {};
          const school = trip.schoolId || {};
          const responseDate = new Date(proposal.acceptedAt || proposal.rejectedAt || proposal.updatedAt);
          const dateStr = responseDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });




          return {
            id: proposal._id,
            school: trip.tripName || 'Unknown Trip',
            area: trip.destination?.address || 'N/A',
            status: proposal.status === 'accepted' ? 'Proposal Accepted' : 'Proposal Rejected',
            statusType: proposal.status,
            route: trip.pickupPoints && trip.pickupPoints[0]?.address && trip.destination?.address
              ? `${trip.pickupPoints[0].address} → ${trip.destination.address}`
              : 'N/A',
            students: trip.numberOfStudents || 0,
            responseDate: dateStr,
            proposal: proposal.schoolNote || 'No additional notes provided by the school.',
            contactInfo: {
              phone: trip.schoolId?.phoneNumber || 'N/A',
              email: 'transport@school.edu.pk'
            },
              congratulations: proposal.status === 'accepted',
              creatorId: school._id,             // ✅ now this works
              creatorName: school.schoolName,    // ✅ school name
              creatorPic: school.avatar || null, // if avatar exists in API
              createdAt: proposal.createdAt,
                      };
        });

        const stats = {
          totalResponses: acceptedData.total + rejectedData.total,
          approved: acceptedData.proposals.length,
          rejected: rejectedData.proposals.length
        };

        setSchoolResponseData({ stats, proposals: mappedProposals });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Shimmer effect component for loading state
  const ShimmerCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6 animate-pulse">
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
          <div className="w-full sm:w-auto">
            <div className="flex gap-2 items-center">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24"></div>
            </div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mt-2"></div>
          </div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-28 sm:w-32 mt-2 sm:mt-0"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-2">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="p-3 sm:p-4 mx-3 sm:mx-4 mb-2">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="p-3 sm:p-4 md:p-5 mx-3 sm:mx-4 mb-2 bg-gray-100">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/4 mb-2 sm:mb-3"></div>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex gap-2 sm:gap-3">
            <div className="h-7 sm:h-8 bg-gray-200 rounded-md w-16 sm:w-20"></div>
            <div className="h-7 sm:h-8 bg-gray-200 rounded-md w-16 sm:w-20"></div>
          </div>
        </div>
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
        <div className="fixed inset-0 z-40 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div
            className="absolute left-0 top-0 h-full w-[75%] sm:w-[60%] md:w-[40%] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-4 sm:px-6 md:px-8 lg:px-[33px] bg-gray-50">
          <div className="max-w-full mx-auto py-4 sm:py-6">
            <h1 className="archivobold text-xl sm:text-2xl md:text-[24px] mt-4 sm:mt-[18px]">School Responses</h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">View responses to your trip proposals</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-black rounded-lg p-3 sm:p-4 bg-white border border-[#E0E0E0]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className='bg-[#FFFBE5] h-10 w-10 sm:h-12 sm:w-12 rounded-[8px] flex items-center justify-center'>
                    <IoChatbubbleOutline className='text-[#FBC02D] text-lg sm:text-xl' />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{schoolResponseData.stats.totalResponses}</div>
                    <div className="text-xs sm:text-sm">Total Responses</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-3 sm:p-4 bg-white border border-[#E0E0E0]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className='bg-[#E8F5E9] h-10 w-10 sm:h-12 sm:w-12 rounded-[8px] flex items-center justify-center'>
                    <IoMdCheckmarkCircleOutline className='text-[#4CAF50] text-lg sm:text-xl' />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{schoolResponseData.stats.approved}</div>
                    <div className="text-xs sm:text-sm">Approved</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E0E0E0] rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className='bg-[#FFEBEE] h-10 w-10 sm:h-12 sm:w-12 rounded-[8px] flex items-center justify-center'>
                    <RxCrossCircled className='text-[#F44336] text-lg sm:text-xl' />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{schoolResponseData.stats.rejected}</div>
                    <div className="text-xs sm:text-sm">Rejected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* School Response Cards */}
            {loading ? (
              <div className="space-y-4 sm:space-y-6">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {schoolResponseData.proposals.map((response) => (
                  <div key={response.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                        <div className="w-full sm:w-auto">
                          <div className='flex gap-2 sm:gap-[5px] items-center flex-wrap'>
                            <h2 className="text-lg sm:text-xl font-semibold">{response.school}</h2>
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                              response.statusType === 'accepted'
                                ? 'bg-green-100 text-[#4CAF50]'
                                : 'bg-red-100 text-[#F44336]'
                            }`}>
                              {response.statusType === 'accepted' ? (
                                <><FaCheckCircle className="inline mr-1 text-sm" /> {response.status}</>
                              ) : (
                                <><FaTimesCircle className="inline mr-1 text-sm" /> {response.status}</>
                              )}
                            </span>
                          </div>
                          <p className="text-gray-600 interregular text-xs sm:text-sm md:text-[14px] flex items-center gap-2 mt-1 sm:mt-2">
                            <IoLocationOutline className="text-base sm:text-lg" /> {response.area}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                          {response.congratulations && (
                            <span className="bg-[#E8F5E9] text-[#4CAF50] px-2 sm:px-3 py-1 sm:py-2 rounded-[8px] text-xs sm:text-[12px] interregular text-center">
                              Congratulations! <br />Trip Confirmed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:gap-3 mt-2 sm:mt-3">
                        <p className="text-gray-600 interregular text-xs sm:text-sm md:text-[14px] flex items-center gap-2">
                          <IoLocationOutline className="text-base sm:text-lg" /> {response.route}
                        </p>
                        <p className="text-gray-600 interregular text-xs sm:text-sm md:text-[14px] flex items-center gap-2">
                          <SlCalender className="text-base sm:text-lg" /> {response.statusType === 'accepted' ? 'Scheduled' : response.responseDate}
                        </p>
                      </div>
                    </div>

                    {/* School Response */}
                    <div className={`p-3 sm:p-4 mx-3 sm:mx-4 rounded-[8px] mb-2 ${
                      response.statusType === 'accepted' ? 'bg-[#E8F5E9]' : 'bg-red-50'
                    }`}>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: response.statusType === 'accepted' ? '#4CAF50' : '#F44336' }}>
                        School Response:
                      </h3>
                      <p className="text-xs sm:text-sm" style={{ color: response.statusType === 'accepted' ? '#4CAF50' : '#F44336' }}>
                        {response.proposal}
                      </p>
                    </div>

                    {/* Contact Information (only for accepted) */}
                    {response.statusType === 'accepted' && (
                      <div className="p-3 sm:p-4 md:p-5 mx-3 sm:mx-4 rounded-[8px] mb-2 bg-[#FFFBE5] flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                        <div>
                          <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-[#98690C]">School Contact Information:</h3>
                          <div className="flex flex-wrap gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 interregular text-xs sm:text-sm md:text-[14px] text-[#98690C]">
                              Phone: <span>{response.contactInfo.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3 sm:mt-4">
                          <button 
                            onClick={() => handleCall(response.contactInfo.phone)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex items-center justify-center interregular px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm"
                            disabled={response.contactInfo.phone === 'N/A'}
                          >
                            <IoCallOutline className='me-1 text-base sm:text-lg' />
                            Call
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md text-sm flex items-center justify-center">
                            <IoChatbubbleOutline className='me-1' />
                            Chat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && schoolResponseData.proposals.length === 0 && (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <FaEnvelope className="text-3xl sm:text-4xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No Responses Yet</h3>
                <p className="text-gray-500 text-sm sm:text-base">School responses to your proposals will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchoolResponse;