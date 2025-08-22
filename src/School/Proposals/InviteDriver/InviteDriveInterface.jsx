import React, { useState, useEffect } from 'react';
import { Star, MapPin, Mail } from 'lucide-react';
import Navbar from './Navbar';
import SelectJobPostPopup from './InviteDriverPopup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Skeleton Loader Component
const DriverSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const InviteDriversInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false); 

  const baseURL = 'https://fieldtriplinkbackend-production.up.railway.app/api';

useEffect(() => {
  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      console.log("Token being sent:", token); // debug
      if (!token) {
        toast.error('Please log in to view drivers.');
        setLoading(false);
        return;
      }

      const url = `${baseURL}/school/drivers?status=approved`;
      console.log("Fetching from:", url); // debug

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API response:", res.data); // debug

      if (res.data && res.data.drivers) {
        setDrivers(res.data.drivers);
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  fetchDrivers();
}, []);





  const handleInvite = (driver) => {
  setSelectedDriver(driver); // store the full driver object
  setIsPopupOpen(true);
};

const handleSendJobPost = async (trip, note = "Please accept the invitation") => {
  if (!selectedDriver?._id) {
    toast.error("Please select a driver first.", { autoClose: 3000 });
    return;
  }

  if (inviting) return;

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authentication required. Please log in.", { autoClose: 3000 });
    return;
  }

  try {
    setInviting(true);

    await axios.post(
      `${baseURL}/school/trip/${trip._id}/invite-driver`,
      {
        driverId: selectedDriver._id,
        note,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Show toast, and close popup only after toast disappears
    toast.success("Invitation sent successfully.", { 
      autoClose: 3000,
      onClose: () => {
        setIsPopupOpen(false);
        setSelectedDriver(null);
      }
    });

  } catch (err) {
    toast.warning("Driver already invited to this trip.", { 
      autoClose: 3000,
      onClose: () => {
        setIsPopupOpen(false);
        setSelectedDriver(null);
      }
    });

  } finally {
    setInviting(false);
  }
};








  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
       <h1 className="text-2xl ml-5 sm:text-3xl archivo-bold text-gray-900 mb-6">
        Invite Drivers

      </h1>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
           
            <div className="relative">
              <input
                type="text"
                placeholder="Search drivers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <DriverSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Drivers List */}
          {!loading && (
            <>
              <div className="space-y-6">
            
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 text-center sm:text-left">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          {driver.profileImage ? (
                            <img
                              src={driver.profileImage}
                              alt={driver.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-400 w-full h-full flex items-center justify-center">
                              <span className="text-white inter-bold text-lg sm:text-xl">
                                {driver.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl  capitalize  mb-1 inter-semibold text-gray-900 truncate">
                            {driver.name}
                          </h3>

                <div className="flex mb-1 items-center justify-center sm:justify-start gap-2">
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm inter-medium text-gray-900">  {(driver.averageRating ?? 0).toFixed(1)}</span>
                <span className="text-sm inter-regular text-gray-600"> 
                  ({driver.reviewCount || 0} reviews)</span>
              </div>

                          
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-sm inter-regular text-gray-600">{driver.address}</span>
                          </div>
                          {/* Completed Stats */}
                          <div className="">
                            <div className="text-sm inter-regular text-gray-600 mb-1">Completed: <span className='inter-semibold text-gray-900'>{driver.completedTripCount || 0} trips</span> </div>
                         
                          </div>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                            {driver.notes && (
                              <span className="px-3 py-1 bg-[#F3F4F6] text-[#3B4555] text-sm rounded-full inter-medium">
                                {driver.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Invite Button */}
                      <div className="flex justify-center sm:justify-end">
                        <button
                        
                          onClick={() => handleInvite(driver)}
                          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                        >
                          <Mail className="w-4 h-4" />
                          Invite
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredDrivers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No drivers found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or check back later
                  </p>
                </div>
              )}
            </>
          )}

          {/* Popup */}
          <SelectJobPostPopup
            isOpen={isPopupOpen}
            onClose={() => {
              setIsPopupOpen(false);
              setSelectedDriver(null);
            }}
            onSendJobPost={handleSendJobPost}
            driverId={selectedDriver?._id}
          />
        </div>
      </div>
    </>
  );
};

export default InviteDriversInterface;
