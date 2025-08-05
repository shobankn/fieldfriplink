import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaPhone, FaCalendarAlt, FaClock } from 'react-icons/fa';

const schoolResponseData = {
  stats: {
    totalResponses: 10,
    approved: 8,
    rejected: 2
  },
  proposals: [
    {
      id: 1,
      school: "Beacon House School",
      area: "Defence, Karachi",
      status: "Proposal Accepted",
      statusType: "approved",
      route: "Bahadurabad → Beacon House Defence",
      students: 25,
      responseDate: "Jan 25, 2025",
      proposal: "We are pleased to accept your proposal. Please contact us for further details.",
      contactInfo: {
        phone: "+92 21 123-4567",
        email: "transport@beaconhouse.edu.pk"
      },
      congratulations: true
    },
    {
      id: 2,
      school: "Oxford Grammar School",
      area: "Gulberg, Karachi",
      status: "Proposal Accepted",
      statusType: "approved",
      route: "PECHS → Oxford Grammar School, Gulberg",
      students: 30,
      responseDate: "Jan 24, 2025",
      proposal: "Your proposal has been accepted, looking forward to working with you.",
      contactInfo: {
        phone: "+92 21 234-5678",
        email: "admin@ogs.edu.pk"
      },
      congratulations: true
    },
    {
      id: 3,
      school: "The City School",
      area: "Gulshan, Karachi",
      status: "Proposal Rejected",
      statusType: "rejected",
      route: "Johar → The City School, Gulshan",
      students: 20,
      responseDate: "Jan 23, 2025",
      proposal: "Thank you for your proposal. Unfortunately, we have selected another transport provider.",
      contactInfo: {
        phone: "+92 21 345-6789",
        email: "info@thecityschool.edu.pk"
      },
      congratulations: false
    },
    {
      id: 4,
      school: "Karachi Grammar School",
      area: "Saddar, Karachi",
      status: "Proposal Accepted",
      statusType: "approved",
      route: "Garden → Karachi Grammar School, Saddar",
      students: 35,
      responseDate: "Jan 22, 2025",
      proposal: "We are happy to work with you. Please coordinate with our transport coordinator.",
      contactInfo: {
        phone: "+92 21 456-7890",
        email: "transport@kgs.edu.pk"
      },
      congratulations: true
    }
  ]
};

const SchoolResponse = () => {
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
            <h1 className="text-2xl font-bold mb-1">School Responses</h1>
            <p className="text-gray-600 mb-6">View responses to your ride proposals</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-400 text-black rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.totalResponses}</div>
                    <div className="text-sm">Total Responses</div>
                  </div>
                  <FaEnvelope className="text-2xl opacity-70" />
                </div>
              </div>

              <div className="bg-green-100 text-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.approved}</div>
                    <div className="text-sm">Approved</div>
                  </div>
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
              </div>

              <div className="bg-red-100 text-red-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{schoolResponseData.stats.rejected}</div>
                    <div className="text-sm">Rejected</div>
                  </div>
                  <FaTimesCircle className="text-2xl text-red-600" />
                </div>
              </div>
            </div>

            {/* School Response Cards */}
            <div className="space-y-6">
              {schoolResponseData.proposals.map((response) => (
                <div key={response.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-xl font-semibold">{response.school}</h2>
                        <p className="text-gray-600">{response.area}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          response.statusType === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {response.statusType === 'approved' ? (
                            <><FaCheckCircle className="inline mr-1" /> {response.status}</>
                          ) : (
                            <><FaTimesCircle className="inline mr-1" /> {response.status}</>
                          )}
                        </span>
                        {response.congratulations && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            🎉 Congratulations!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <strong>Route:</strong> {response.route}
                        </p>
                        <p className="text-gray-600 mt-1">
                          <strong>Students:</strong> {response.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <strong>Response Date:</strong> {response.responseDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* School Response */}
                  <div className={`p-4 ${
                    response.statusType === 'approved' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <h3 className="font-semibold mb-2">School Response:</h3>
                    <p className="text-gray-700">{response.proposal}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="p-5 bg-yellow-50">
                    <h3 className="font-semibold mb-3">School Contact Information:</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-600" />
                        <span className="text-sm">{response.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-600" />
                        <span className="text-sm">{response.contactInfo.email}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md text-sm">
                        Call
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md text-sm">
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {schoolResponseData.proposals.length === 0 && (
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