import React from 'react';
import { ArrowLeft, Clock, MapPin, Users, Edit2, Trash2, DollarSign, Edit, Calendar, User, User2, MapIcon, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import proposalsData from './ProposalData';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Required CSS
import { confirmAlert } from 'react-confirm-alert';




const ProposalDetailsPage = () => {
      const [trip, setTrip] = useState(null);
      const [loading, setLoading] = useState(true);
      const { id } = useParams();
      const navigate = useNavigate();
  
    const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';



       const proposal = proposalsData.find((p) => p.id === parseInt(id));

  // if (!proposal) {
  //   return (
  //      <div className="text-center py-12">
  //           <div className="text-gray-400 mb-4">
  //             <Search className="w-12 h-12 mx-auto" />
  //           </div>
  //           <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
  //           <p className="text-gray-500">Try adjusting your search criteria</p>
  //         </div>
  //   );
  // }
const fetchTripDetails = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error('You must be logged in to view trip details.');
    navigate('/login'); // or redirect to login if needed
    return;
  }

  try {
    const response = await axios.get(`${BaseUrl}/school/trip-by/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTrip(response.data.trip)
    console.log(response.data.trip);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      navigate('/login'); // or handle logout
    } else {
      toast.error('Failed to fetch trip details');
    }
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchTripDetails();
}, [id]);


const handleDeleteTrip = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Please log in to delete this trip.');
    return;
  }

  confirmAlert({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this trip? This action cannot be undone.',
    buttons: [
      {
        label: 'Yes, Delete',
        onClick: async () => {
          try {
            setLoading(true);
            const response = await axios.delete(`${BaseUrl}/school/trip/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            toast.success('Trip deleted successfully!');
            navigate(-1); // Navigate back
          } catch (error) {
            console.error('Error deleting trip:', error);
            toast.error('Failed to delete the trip.');
          } finally {
            setLoading(false);
          }
        },
        className: '!bg-red-600 !text-white !hover:bg-red-700', // Changed from black to red
      },
      {
        label: 'No',
        className: '!bg-red-600 !text-white !inter-bold !hover:bg-red-700',
        onClick: () => {
          // Optional: add toast or nothing
        },
      },
    ],
  });
};


  const handleEdit = () => {
    navigate(`/post-trip-update/${trip._id}`);
  };





   if (!trip && !loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trip found</h3>
        <p className="text-gray-500">Try again later</p>
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
            <button
             onClick={handleEdit}
             className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Edit className="w-4 h-4" />
              Edit Post
            </button>
            <button   onClick={handleDeleteTrip} className="flex items-center cursor-pointer  gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
              <h2 className=" text-[20px] sm:text-2xl inter-semibold capitalize text-gray-900 mb-4"> {loading ? <Skeleton width={200} /> : trip.tripName}</h2>
              <div className="flex flex-wrap gap-3">
                <span className=" capitalize px-3 py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-full text-sm font-medium">
                 {loading ? <Skeleton width={50} /> : trip.tripType}
                </span>
                <span className="px-3 py-1 capitalize bg-[#D1FAE5] text-[#18BC85] rounded-full text-sm font-medium">
                   {loading ? <Skeleton width={50} /> : trip.tripStatus}
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
                <span className="text-lg c inter-medium text-gray-900">
                  {loading ? (
                    <Skeleton width={80} />
                  ) : trip.tripType === 'recurring' ? (
                    trip.recurringDays?.join(', ').toUpperCase() || 'N/A'
                  ) : (
                    trip.tripDate?.split('T')[0] || 'N/A'
                  )}
                </span>
</div>

                <div>
                  <span className="text-sm inter-regular text-gray-500 block mb-1">Pickup Time</span>
                  <span className="text-lg inter-medium text-gray-900">

                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        new Date(trip.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'UTC', // <- shows exactly as stored in backend (UTC)
                        })
                      )}
                     
                     </span>
                </div>
                <div>
                  <span className="text-sm inter-regular text-gray-500 block mb-1">Return Time</span>
                  <span className="text-lg inter-medium text-gray-900">  
                     {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        new Date(trip.returnTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'UTC',
                        })
                      )}
                     
                     </span>
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

                      {loading ? (
                      <Skeleton count={1} height={24} />
                    ) : (
                    trip.pickupPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm inter-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 inter-regular">{point.address}</span>
                      </div>
                    ))
                  )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-sm inter-medium text-gray-700 block mb-2">Destination</span>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0">
                      <MapPin className='w-5 h-5 text-[#39C597]'/>
                    </div>
                    <span className="text-[#39C597] capitalize inter-regular">{loading ? <Skeleton width={100} /> : trip.destination.address}</span>
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
                  <span className="text-lg inter-medium text-gray-900">{loading ? <Skeleton width={40} /> : trip.numberOfStudents}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Bus Capacity Required</span>
                  <span className="text-lg inter-medium text-gray-900">{loading ? <Skeleton width={40} /> : trip.numberOfBuses}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-sm text-gray-500 block mb-1">Preferred Driver Gender</span>
                <span className="text-lg inter-medium capitalize text-gray-900">{loading ? <Skeleton width={40} /> : trip.preferredDriverGender}</span>
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
                <p className="text-gray-800 capitalize  inter-regular text-sm leading-relaxed">    {loading ? <Skeleton count={2} /> : trip.instructions || 'No instructions provided'}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg inter-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Distance</span>
                  <span className="inter-semibold text-gray-900">
              {loading ? <Skeleton width={50} /> : trip.tripDistanceMeta?.distance || 'Not available'} </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Duration</span>
                  <span className="font-semibold text-gray-900">
           {loading ? <Skeleton width={50} /> : trip.tripDistanceMeta?.duration || 'Not available'}                    </span>
                </div>
              </div>
            </div>

{/* 
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg inter-semibold text-gray-900 mb-4">Ride's Feedback</h3>
              <div className="bg-[#FFFDE7] border border-yellow-200 rounded-lg p-4">
                <h3 className='text-lg inter-semibold text-gray-900'>Beacon House School</h3>
                <span>2025-01-15</span>
                <p>Very punctual and safe driving. Students felt comfortable throughout the journey.</p>
                <div className='flex text-[#FFC107] '>
                  <Star className='w-5 h-5 mr-1'/><Star className='w-5 h-5 mr-1'/><Star className='w-5 h-5 mr-1'/><Star className='w-5 h-5 mr-1'/>
                  <Star className='w-5 h-5 mr-1'/> <span className='text-gray-700' >4.5</span>
          
                </div>
                <button className='bg-[#EFB034] py-1.5 px-3 rounded-full'>Punctuality</button>
                
              </div>
            </div> */}

          
            <div className=' flex justify-end content-end items-end'>
               <button onClick={()=> navigate('/job-post/invite-drivers')} className='flex bg-red-600 cursor-pointer  inter-semibold text-white py-2 px-3 rounded-[10px] justify-center items-center'> <User2 className='w-5 h-5 mr-2'/>Invite Driver</button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsPage;