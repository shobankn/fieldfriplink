import React from 'react';
import { ArrowLeft, Clock, MapPin, Users, Edit2, Trash2, DollarSign, Edit, Calendar, User, User2, MapIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import proposalsData from './ProposalData';

const ProposalDetailsPage = () => {
    const { id } = useParams();
     const navigate = useNavigate();

       const proposal = proposalsData.find((p) => p.id === parseInt(id));

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Proposal not found
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className=" px-4 md:px-6 py-4">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
           
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Trip Details</h1>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Edit className="w-4 h-4" />
              Edit Post
            </button>
            <button className="flex items-center cursor-pointer  gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto  md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className=" text-[20px] sm:text-2xl inter-semibold text-gray-900 mb-4">{proposal.title}</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-full text-sm font-medium">
                  {proposal.type}
                </span>
                <span className="px-3 py-1 bg-[#D1FAE5] text-[#18BC85] rounded-full text-sm font-medium">
                  {proposal.status}
                </span>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-red-500" />
                <h3 className="text-lg inter-semibold text-gray-900">Schedule</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm inter-regular text-gray-500 block mb-1">Trip Date</span>
                  <span className="text-lg inter-medium text-gray-900">{proposal.schedule.tripDate}</span>
                </div>
                <div>
                  <span className="text-sm inter-regular text-gray-500 block mb-1">Pickup Time</span>
                  <span className="text-lg inter-medium text-gray-900">{proposal.schedule.pickupTime}</span>
                </div>
                <div>
                  <span className="text-sm inter-regular text-gray-500 block mb-1">Return Time</span>
                  <span className="text-lg inter-medium text-gray-900">{proposal.schedule.returnTime}</span>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-red-500" />
                <h3 className="text-lg inter-semibold text-gray-900">Location Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm inter-medium text-gray-700 block mb-3">Pickup Addresses</span>
                  <div className="space-y-2">
                    {proposal.pickupAddresses?.map((address, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm inter-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 inter-regular">{address}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-sm inter-medium text-gray-700 block mb-2">Destination</span>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0">
                      <MapPin className='w-5 h-5 text-[#39C597]'/>
                    </div>
                    <span className="text-[#39C597] inter-regular">{proposal.destination}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">No. of Students</span>
                  <span className="text-lg inter-medium text-gray-900">{proposal.requirements?.students}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Bus Capacity Required</span>
                  <span className="text-lg inter-medium text-gray-900">{proposal.requirements?.busCapacity}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-sm text-gray-500 block mb-1">Preferred Driver Gender</span>
                <span className="text-lg inter-medium text-gray-900">{proposal.requirements?.driverGender}</span>
              </div>
              
              <div>
                {/* <span className="text-sm inter-medium text-gray-700 block mb-2">Other Requests</span>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{proposal.requirements?.otherRequests}</p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
           

            {/* Extra Instructions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg inter-semibold text-gray-900 mb-4">Extra Instructions</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-800 inter-regular text-sm leading-relaxed">{proposal.extraInstructions}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg inter-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Distance</span>
                  <span className="inter-semibold text-gray-900">{proposal.quickStats?.totalDistance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Duration</span>
                  <span className="font-semibold text-gray-900">{proposal.quickStats?.estimatedDuration}</span>
                </div>
              </div>
            </div>
            <div className=' flex justify-end content-end items-end'>
               <button className='flex bg-red-600 inter-semibold text-white py-2 px-3 rounded-[10px] justify-center items-center'> <User2 className='w-5 h-5 mr-2'/>Invite Driver</button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsPage;