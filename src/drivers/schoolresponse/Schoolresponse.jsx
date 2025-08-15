import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoChatbubbleOutline, IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch proposals with accepted or rejected status from API
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
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/proposal?status=accepted,rejected&page=1&limit=10',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }

        const data = await response.json();
        const mappedProposals = data.proposals.map((proposal) => {
          const trip = proposal.tripId;
          const responseDate = new Date(proposal.acceptedAt || proposal.rejectedAt || proposal.updatedAt);
          const dateStr = responseDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return {
            id: proposal._id,
            school: trip.tripName, // Using tripName as school name since API doesn't provide school name
            area: trip.destination.address,
            status: proposal.status === 'accepted' ? 'Proposal Accepted' : 'Proposal Rejected',
            statusType: proposal.status, // 'accepted' or 'rejected'
            route: `${trip.pickupPoints[0]?.address || 'N/A'} → ${trip.destination.address}`,
            students: trip.numberOfStudents,
            responseDate: dateStr,
            proposal: proposal.schoolNote || 'No additional notes provided by the school.',
            contactInfo: {
              phone: '+92 21 345-6789', // Hardcoded as API doesn't provide contact info
              email: 'transport@school.edu.pk' // Hardcoded as API doesn't provide contact info
            },
            congratulations: proposal.status === 'accepted'
          };
        });

        const stats = {
          totalResponses: data.proposals.length,
          approved: data.proposals.filter(p => p.status === 'accepted').length,
          rejected: data.proposals.filter(p => p.status === 'rejected').length
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 animate-pulse">
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="flex gap-[5px] items-center">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="p-4 mx-4 mb-2">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="p-5 mx-4 mb-2 bg-gray-100">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 rounded-md w-20"></div>
            <div className="h-8 bg-gray-200 rounded-md w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

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

        <main className="flex-1 overflow-y-auto pt-16 px-[33px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <h1 className="archivobold text-[24px] mt-[18px]">School Responses</h1>
            <p className="text-gray-600 mb-6">View responses to your ride proposals</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className=" text-black rounded-lg p-4 bg-white border border-[#E0E0E0] ">
                <div className="flex items-center gap-4">
                  <div className='bg-[#FFFBE5] h-[48px] w-[48px] rounded-[8px] flex items-center justify-center'>
                    <IoChatbubbleOutline className='text-[#FBC02D]' />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.totalResponses}</div>
                    <div className="text-sm">Total Responses</div>
                  </div>
                </div>
              </div>

              <div className=" rounded-lg p-4 bg-white border border-[#E0E0E0] ">
                <div className="flex items-center gap-4">
                  <div className='bg-[#E8F5E9] h-[48px] w-[48px] rounded-[8px] flex items-center justify-center'>
                    <IoMdCheckmarkCircleOutline className='text-[#4CAF50]' />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.approved}</div>
                    <div className="text-sm">Approved</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
                <div className="flex items-center  gap-4">
                  <div className='bg-[#FFEBEE] h-[48px] w-[48px] rounded-[8px] flex items-center justify-center'>
                    <RxCrossCircled className='text-[#F44336]' />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.rejected}</div>
                    <div className="text-sm">Rejected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* School Response Cards */}
            {loading ? (
              <div className="space-y-6">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : (
              <div className="space-y-6">
                {schoolResponseData.proposals.map((response) => (
                  <div key={response.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className='flex gap-[5px] items-center'>
                            <h2 className="text-xl font-semibold">{response.school}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              response.statusType === 'approved' 
                                ? 'bg-green-100 text-[#4CAF50]' 
                                : 'bg-red-100 text-[#F44336]'
                            }`}>
                              {response.statusType === 'approved' ? (
                                <><FaCheckCircle className="inline mr-1" /> {response.status}</>
                              ) : (
                                <><FaTimesCircle className="inline mr-1" /> {response.status}</>
                              )}
                            </span>
                          </div>
                          <p className="text-gray-600 interregular text-[14px] flex items-center gap-2">
                            <IoLocationOutline /> {response.area}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {response.congratulations && (
                            <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-2 rounded-[8px] text-[12px] interregular">
                              Congratulations! <br />Ride Confirmed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          {response.statusType === 'approved' ? (
                            <p className="text-gray-600 interregular text-[14px] flex items-center gap-2">
                              <SlCalender /> Scheduled
                            </p>
                          ) : (
                            <>
                              <p className="text-gray-600 interregular text-[14px] flex items-center gap-2">
                                <IoLocationOutline /> {response.route}
                              </p>
                              <p className="text-gray-600 interregular text-[14px] flex items-center gap-2">
                                <SlCalender /> {response.responseDate}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* School Response */}
                    <div className={`p-4 mx-4 rounded-[8px] mb-2 ${
                      response.statusType === 'approved' ? 'bg-[#E8F5E9]' : 'bg-red-50'
                    }`}>
                      <h3 className="font-semibold mb-2" style={{ color: response.statusType === 'approved' ? '#4CAF50' : '#F44336' }}>
                        School Response:
                      </h3>
                      <p style={{ color: response.statusType === 'approved' ? '#4CAF50' : '#F44336' }}>
                        {response.proposal}
                      </p>
                    </div>

                    {/* Contact Information (only for approved) */}
                    {response.statusType === 'approved' && (
                      <div className="p-5 bg-[#FFFBE5] mx-4 rounded-[8px] mb-2 flex justify-between">
                        <div>
                          <h3 className="font-medium mb-3 text-[#98690C]">School Contact Information:</h3>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 interregular text-[14px] text-[#98690C]">
                              Phone: <span className="text-sm">{response.contactInfo.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex items-center justify-center interregular px-4 py-2 rounded-md text-sm">
                            <IoCallOutline className='me-1' />
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
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Responses Yet</h3>
                <p className="text-gray-500">School responses to your proposals will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchoolResponse;