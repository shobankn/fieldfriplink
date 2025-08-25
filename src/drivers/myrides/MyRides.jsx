import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { LuMapPin, LuUsers, LuCalendar, LuClock } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { LuPlane } from "react-icons/lu";
import { ImStopwatch } from "react-icons/im";
import { LuShieldPlus } from "react-icons/lu";
import { startTracking, stopTracking } from './StartRide';


const rideData = {
  Scheduled: [],
  Active: [],
  Completed: [],
  Invitations: [],
};

const MyRides = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initialTab = location.state?.activeTab || localStorage.getItem('myRidesActiveTab') || "Invitations";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [rideDataState, setRideDataState] = useState(rideData);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('myRidesActiveTab', activeTab);
  }, [activeTab]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Map for recurring days
  const dayMap = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  // Function to handle invitation response
  const handleInvitationResponse = async (invitationId, action) => {
    setButtonLoading((prev) => ({ ...prev, [invitationId + action]: true }));
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `https://fieldtriplinkbackend-production.up.railway.app/api/driver/invitations/${invitationId}/respond`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            action,
            note: action === 'accepted' ? 'Looking forward to this trip!' : 'Unable to accept this trip.',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} invitation`);
      }

      setRideDataState((prev) => ({
        ...prev,
        Invitations: prev.Invitations.filter((inv) => inv.id !== invitationId),
      }));

      toast.success(`Invitation ${action} successfully!`);
      if (action === 'accepted') {
        setActiveTab('Scheduled');
      }
    } catch (error) {
      console.error(`Error ${action} invitation:`, error);
      toast.error(`Failed to ${action} invitation. Please try again.`);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [invitationId + action]: false }));
    }
  };

  // Function to handle start ride
const handleStartRide = async (tripId, schoolId) => {
  setButtonLoading((prev) => ({ ...prev, [tripId + 'start']: true }));
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips/${tripId}/status`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'active' }),
      }
    );

    if (!response.ok) throw new Error('Failed to start ride');

    setRideDataState((prev) => {
      const rideToStart = prev.Scheduled.find((r) => r.id === tripId);
      if (!rideToStart) return prev;
      return {
        ...prev,
        Scheduled: prev.Scheduled.filter((r) => r.id !== tripId),
        Active: [...prev.Active, rideToStart],
      };
    });

    // ✅ Start tracking after success
    const ride = rideDataState.Scheduled.find(r => r.id === tripId);
    if (ride) {
      startTracking(tripId, ride.schoolId);
    }

    toast.success('Ride started successfully!');
    setActiveTab('Active');
  } catch (error) {
    console.error('Error starting ride:', error);
    toast.error('Failed to start ride. Please try again.');
  } finally {
    setButtonLoading((prev) => ({ ...prev, [tripId + 'start']: false }));
  }
};




  // Function to handle end ride
 const handleEndRide = async (tripId) => {
  setButtonLoading((prev) => ({ ...prev, [tripId + 'end']: true }));
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips/${tripId}/status`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'completed' }),
      }
    );

    if (!response.ok) throw new Error('Failed to end ride');

    setRideDataState((prev) => {
      const rideToEnd = prev.Active.find((ride) => ride.id === tripId);
      if (!rideToEnd) return prev;
      return {
        ...prev,
        Active: prev.Active.filter((ride) => ride.id !== tripId),
        Completed: [...prev.Completed, rideToEnd],
      };
    });

    // ✅ Stop tracking
    stopTracking();

    toast.success('Ride ended successfully!');
    setActiveTab('Completed');
  } catch (error) {
    console.error('Error ending ride:', error);
    toast.error('Failed to end ride. Please try again.');
  } finally {
    setButtonLoading((prev) => ({ ...prev, [tripId + 'end']: false }));
  }
};


  // Function to handle view live navigation
  const handleViewLive = (tripId) => {
    setButtonLoading((prev) => ({ ...prev, [tripId + 'view']: true }));
    navigate('/driver-live-tracking', { state: { activeTab: activeTab } });
    setTimeout(() => {
      setButtonLoading((prev) => ({ ...prev, [tripId + 'view']: false }));
    }, 1000);
  };

  // Fetch Invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/invitations?status=pending&page=1',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch invitations');
        }

        const data = await response.json();
        const mappedInvitations = data.invitations.map((inv) => {
          const trip = inv.tripId;
          const startDate = new Date(trip.startTime);
          const endDate = new Date(trip.returnTime);
          const dateStr = trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : startDate.toISOString().split('T')[0];
          const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

          return {
            id: inv._id,
            school: trip.tripName,
            schoolName: trip.schoolId?.schoolName || 'Unknown School',
            pickup: trip.pickupPoints[0]?.address || 'N/A',
            drop: trip.destination.address || 'N/A',
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            students: trip.numberOfStudents || 0,
            phone: trip.schoolId?.phoneNumber || 'N/A',
            schoolId: trip.schoolId?._id || 'N/A',
            isRecurring: trip.tripType === 'recurring',
            postedDate: trip.createdAt
              ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'N/A'
          };
        });

        setRideDataState((prev) => ({ ...prev, Invitations: mappedInvitations }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invitations:', error);
        toast.error('Failed to fetch invitations. Please try again.');
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  // Fetch Scheduled Rides
  useEffect(() => {
    const fetchScheduledRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=scheduled',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch scheduled rides');
        }

        const data = await response.json();
        const mappedScheduledRides = data.trips.map((trip) => {
          const startDate = new Date(trip.startTime);
          const endDate = new Date(trip.returnTime);
          const dateStr = trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : startDate.toISOString().split('T')[0];
          const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

          return {
            id: trip._id,
            school: trip.tripName,
            schoolName: trip.schoolId?.schoolName || 'Unknown School',
            pickup: trip.pickupPoints[0]?.address || 'N/A',
            drop: trip.destination.address || 'N/A',
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            students: trip.numberOfStudents || 0,
            phone: trip.schoolId?.phoneNumber || 'N/A',
            schoolId: trip.schoolId?._id || 'N/A',
            isRecurring: trip.tripType === 'recurring',
            postedDate: trip.createdAt
              ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'N/A'
          };
        });

        setRideDataState((prev) => ({ ...prev, Scheduled: mappedScheduledRides }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scheduled rides:', error);
        toast.error('Failed to fetch scheduled rides. Please try again.');
        setLoading(false);
      }
    };

    fetchScheduledRides();
  }, []);

  // Fetch Active Rides
  useEffect(() => {
    const fetchActiveRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=active',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch active rides');
        }

        const data = await response.json();
        const mappedActiveRides = data.trips.map((trip) => {
          const startDate = new Date(trip.startTime);
          const endDate = new Date(trip.returnTime);
          const dateStr = trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : startDate.toISOString().split('T')[0];
          const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
console.log(data);
          return {
            id: trip._id,
            school: trip.tripName,
            schoolName: trip.schoolId?.schoolName || 'Unknown School',
            pickup: trip.pickupPoints[0]?.address || 'N/A',
            drop: trip.destination.address || 'N/A',
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            students: trip.numberOfStudents || 0,
            phone: trip.schoolId?.phoneNumber || 'N/A',
            schoolId: trip.schoolId?._id || 'N/A',
            isRecurring: trip.tripType === 'recurring',
            postedDate: trip.createdAt
              ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'N/A'
          };
        });

        setRideDataState((prev) => ({ ...prev, Active: mappedActiveRides }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active rides:', error);
        toast.error('Failed to fetch active rides. Please try again.');
        setLoading(false);
      }
    };

    fetchActiveRides();
  }, []);



  // Fetch Completed Rides
  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=completed',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch completed rides');
        }

        const data = await response.json();
        const mappedCompletedRides = data.trips.map((trip) => {
          const startDate = new Date(trip.startTime);
          const endDate = new Date(trip.returnTime);
          const dateStr = trip.tripType === 'recurring' && trip.recurringDays
            ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
            : startDate.toISOString().split('T')[0];
          const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

          return {
            id: trip._id,
            school: trip.tripName,
            schoolName: trip.schoolId?.schoolName || 'Unknown School',
            pickup: trip.pickupPoints[0]?.address || 'N/A',
            drop: trip.destination.address || 'N/A',
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            students: trip.numberOfStudents || 0,
            phone: trip.schoolId?.phoneNumber || 'N/A',
            schoolId: trip.schoolId?._id || 'N/A',
            rating: trip.driverRating,
            isRecurring: trip.tripType === 'recurring',
            postedDate: trip.createdAt
              ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'N/A'
          };
        });

        setRideDataState((prev) => ({ ...prev, Completed: mappedCompletedRides }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed rides:', error);
        toast.error('Failed to fetch completed rides. Please try again.');
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, []);

  // Shimmer effect component for loading state
  const ShimmerCard = () => (
    <div className="bg-white rounded-lg shadow p-5 mb-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
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

        <main className="flex-1 overflow-y-auto pt-16 px-[33px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <h1 className="archivobold text-[24px] mt-[18px] mb-1">My Rides</h1>
            <p className="text-gray-600 mb-6">Manage your scheduled, active, and completed rides</p>

            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide border-b mb-6">
              <div className="flex gap-6">
                {[
                  { name: "Scheduled", icon: <ImStopwatch className="inline-block mr-1" /> },
                  { name: "Active", icon: <IoMdCheckmarkCircleOutline className="inline-block mr-1" /> },
                  { name: "Completed", icon: <IoMdCheckmarkCircleOutline className="inline-block mr-1" /> },
                  { name: "Invitations", icon: <LuShieldPlus className="inline-block mr-1" /> },
                ].map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`pb-2 font-medium flex items-center ${
                      activeTab === tab.name
                        ? "text-[#B00000] border-b-2 border-[#B00000]"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}{" "}
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-1">
                      {rideDataState[tab.name].length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {(activeTab === "Invitations" || activeTab === "Scheduled" || activeTab === "Active" || activeTab === "Completed") && loading ? (
              <div>
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : rideDataState[activeTab].length > 0 ? (
              rideDataState[activeTab].map((ride) => (
                <div key={ride.id} className="bg-white rounded-lg shadow p-5 mb-4 relative">
                  {activeTab === "Active" && (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      ● Live
                    </span>
                  )}

                  {activeTab === "Scheduled" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">{ride.school}</h2>
                      <p className="text-[16px] interregular text-gray-500">({ride.postedDate}) {ride.schoolName}</p>
                    </div>
                  )}

                  {(activeTab === "Completed" || activeTab === "Active" || activeTab === "Invitations") && (
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg archivosemibold text-[18px]">{ride.school}</h2>
                        <p className="text-[16px] interregular text-gray-500"> {ride.schoolName} ({ride.postedDate})</p>
                      </div>
                      {activeTab === "Completed" && (
                        <div className="flex items-center flex-col gap-2">
                          {ride.rating ? (
                            <>
                              <span className="text-yellow-500">{'★'.repeat(ride.rating)}{'☆'.repeat(5 - ride.rating)}</span>
                              <p className="text-sm text-gray-500">By {ride.schoolName}</p>
                            </>
                          ) : (
                            <span className="text-gray-500">Not Rated yet</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div>
                      <p className="flex items-center gap-2 text-[#6B7280] text-[14px] interregular mb-[12px]">
                        <LuMapPin className="text-[#EF4444]" />
                        <span className="archivomedium">Pickup:</span> <span className="interregular">{ride.pickup}</span>
                      </p>
                      <p className="flex items-center gap-2 text-[#6B7280] text-[14px] interregular mb-[12px]">
                        <LuMapPin className="text-[#EF4444]" />
                        <span className="archivomedium">Drop:</span> <span className="interregular">{ride.drop}</span>
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-[#6B7280] text-[14px] interregular mb-[12px]">
                        <LuCalendar className="text-[#EF4444]" />
                        <span className="archivomedium">{ride.isRecurring ? 'Days' : 'Date'}:</span> <span className="interregular">{ride.date}</span>
                      </p>
                      <p className="flex items-center gap-2 text-[#6B7280] text-[14px] interregular mb-[12px]">
                        <LuClock className="text-[#EF4444]" />
                        <span className="archivomedium">Start Time:</span> <span className="interregular">{ride.startTime}</span> -
                        <span className="archivomedium">End Time:</span> <span className="interregular">{ride.endTime}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-sm flex-wrap gap-2 text-[#6B7280] text-[14px]">
                    <div className='flex items-center gap-[15px] text-[#6B7280] text-[14px] interregular mb-[12px]'>
                      <p className="flex items-center gap-2">
                        <LuUsers className="text-[#EF4444]" />
                        <span className="archivomedium">{ride.students} students</span>
                      </p>
                      <p className="text-[#6B7280] text-[14px] interregular">
                        <span className="archivomedium">Phone:</span> {ride.phone}
                      </p>
                    </div>
                    {activeTab === "Completed" && (
                      <p className="text-green-600 flex items-center gap-2">
                        <IoMdCheckmarkCircleOutline /> Completed
                      </p>
                    )}
                  </div>

                  {activeTab === "Active" && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleEndRide(ride.id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 flex items-center gap-1"
                        disabled={buttonLoading[ride.id + 'end']}
                      >
                        {buttonLoading[ride.id + 'end'] ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <RxCrossCircled />
                        )}
                        End Ride
                      </button>
                      <button
                        onClick={() => handleViewLive(ride.id)}
                        className="bg-red-500 text-white flex items-center gap-1 px-4 py-1.5 rounded-md text-sm hover:bg-red-600"
                        disabled={buttonLoading[ride.id + 'view']}
                      >
                        {buttonLoading[ride.id + 'view'] ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <LuPlane />
                        )}
                        View Live
                      </button>
                    </div>
                  )}

                  {activeTab === "Invitations" && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleInvitationResponse(ride.id, 'rejected')}
                        className="bg-[#EF4444] archivomedium text-[14px] text-white px-4 py-1.5 rounded-md hover:bg-red-600 flex items-center gap-1"
                        disabled={buttonLoading[ride.id + 'rejected']}
                      >
                        {buttonLoading[ride.id + 'rejected'] ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <RxCrossCircled />
                        )}
                        Reject Invitation
                      </button>
                      <button
                        onClick={() => handleInvitationResponse(ride.id, 'accepted')}
                        className="bg-green-500 text-[#0A4D20] archivomedium px-4 py-1.5 rounded-md hover:bg-green-600 flex items-center gap-1"
                        disabled={buttonLoading[ride.id + 'accepted']}
                      >
                        {buttonLoading[ride.id + 'accepted'] ? (
                          <svg
  className="animate-spin h-5 w-5 mr-2 text-[#0A4D20]"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  ></path>
</svg>
                        ) : (
                          <FaCheck />
                        )}
                        Accept Invitation
                      </button>
                    </div>
                  )}

                  {activeTab === "Scheduled" && (
                    
                    <button
                      // onClick={() => handleStartRide(ride.id)}
                      onClick={() => handleStartRide(ride.id, ride.schoolId)}
                      className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-500 ml-auto flex items-center gap-1"
                      disabled={buttonLoading[ride.id + 'start']}
                    >
                      {buttonLoading[ride.id + 'start'] ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Start Ride
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">No {activeTab.toLowerCase()} rides found.</p>
            )}
          </div>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default MyRides;