import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Star,
  Eye,
  CheckCircle,
  CheckSquare,
  AlertCircle,
  PlayCircle,
  MessageCircle,
  Trash,
  Edit,
  Bus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api'

const filterIcons = {
  All: Eye,
  Active: CheckSquare,
  Scheduled: Calendar,
  Pending: Clock,
  Completed: CheckCircle,
};

const TripManagementBody = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
          toast.error('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/school/my-trips',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('API Response:', res.data);

        // Check if res.data.trips is an array
        if (!Array.isArray(res.data.trips)) {
          console.error('Expected an array in res.data.trips, got:', res.data.trips);
          toast.error('Invalid data format from server');
          setTrips([]);
          return;
        }

        const formattedTrips = res.data.trips.map(trip => ({
          id: trip._id || 'unknown',
          title: trip.tripName,

          status: trip.tripStatus
  ? trip.tripStatus.toLowerCase() === 'published'
    ? 'Pending'
    : trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1).toLowerCase()
  : 'Unknown',



          type: trip.tripType === 'onetime' ? 'One-time' : 'Recurring',
          date: trip.tripDate
            ? new Date(trip.tripDate).toLocaleDateString()
            : 'N/A',
          time: trip.startTime
            ? new Date(trip.startTime).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC'
              })
            : 'N/A',
              returnTime: trip.returnTime
            ? new Date(trip.returnTime).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC',
              })
            : 'N/A',


          students: trip.numberOfStudents || 0,
          route: trip.pickupPoints?.length && trip.destination
          ? `${trip.pickupPoints[0]?.address || 'Unknown'} → ${trip.destination.address || 'Unknown'}`
          : 'Unknown Route',


            assignedDrivers: trip.assignedDrivers || [], 

           driver: trip.assignedDrivers && trip.assignedDrivers.length > 0
          ? trip.assignedDrivers.map(driver => ({
              id: driver._id,
              name: driver.name || 'Unknown',
              profileImage: driver.profileImage || null,
              rating: driver.averageRating || null,
              address: driver.address || 'N/A',
              role: driver.role || 'assigned'
            }))
          : [], // empty array if no drivers
      }));


        console.log('Formatted Trips:', formattedTrips);
        setTrips(formattedTrips);
      } catch (err) {
        console.error('Error fetching trips:', err.response || err.message);
        toast.error(err.response?.data?.message || 'Failed to load trips');
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);


  const handleDeleteTrip = async (id) => {
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
              await axios.delete(`${BaseUrl}/school/trip/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
  
              // ✅ Remove deleted trip from UI
              setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
  
              toast.success('Trip deleted successfully!');
            } catch (error) {
              console.error('Error deleting trip:', error);
              toast.error('Failed to delete the trip.');
            } finally {
              setLoading(false);
            }
          },
          className: '!bg-red-600 !text-white !hover:bg-red-700',
        },
        {
          label: 'No',
          className: '!bg-red-600 !text-white !inter-bold !hover:bg-red-700',
        },
      ],
    });
  };

  

  const filterButtons = ['All', 'Active', 'Scheduled', 'Pending', 'Completed'];

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    return type === 'Recurring' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  const filteredTrips = activeFilter === 'All' 
    ? trips 
    : trips.filter(trip => trip.status === activeFilter);

  // 1. Default Card - for 'All'
  const DefaultTripCard = ({ trip }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
          <h3 className="text-[20px] archivo-semibold text-gray-900 break-words">
            {loading ? <Skeleton width={120} /> : trip.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 inter-medium rounded-full text-[12px] font-medium ${getStatusColor(trip.status)}`}>
            {loading ? <Skeleton width={60} /> : trip.status}
          </span>
          <span className={`px-2 py-1 inter-medium rounded-full text-xs ${getTypeColor(trip.type)}`}>
            {loading ? <Skeleton width={60} /> : trip.type}
          </span>
        </div>
      </div>

      {/* Trip Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[#808080]">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : trip.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="text-[14px] inter-regular">
  {loading ? (
    <Skeleton width={60} />
  ) : (
    <>
      {trip.time} → {trip.returnTime}
    </>
  )}
</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 shrink-0" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : `${trip.students} students`}</span>
        </div>
        <div className="flex items-center space-x-2 min-w-0">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-[14px] whitespace-normal break-words inter-regular">{loading ? <Skeleton width={150} /> : trip.route}</span>
        </div>
      </div>

      {/* Driver Info */}
    {loading ? (
  <div className="pt-4 border-t border-gray-100">
    <Skeleton height={40} width={200} />
  </div>
) : trip.driver && trip.driver.length > 0 ? (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-4">
    <div className="flex items-center flex-wrap gap-3">
      {trip.driver.map((drv) => (
        <div key={drv.id} className="flex items-center gap-3">
          {drv.profileImage ? (
            <img
              src={drv.profileImage}
              alt={drv.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-[#808080]">
                {drv.name
                  ? drv.name.split(' ').map(n => n[0]).join('')
                  : 'N/A'}
              </span>
            </div>
          )}

          <div>
            <p className="text-sm inter-medium text-gray-900">{drv.name}</p>
            <p className="text-xs text-[#808080] inter-regular">{drv.address}</p>
          </div>

          <div className="flex items-center space-x-1">
            <span className="ml-0 sm:ml-6 text-sm text-[#808080] inter-regular">
              Overall Rating
            </span>
            <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{drv.rating}</span>
          </div>
        </div>
      ))}
    </div>

    <button className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-[#EEF3FE] text-[#0A41A0] rounded-[6px] text-sm font-medium hover:bg-green-200 transition-colors">
      <Eye className="w-4 h-4" />
      <span>Live Track</span>
    </button>
  </div>
) : (
  <div className="pt-4 border-t border-gray-100">
    <p className="text-sm text-gray-500 italic">Driver not assigned yet</p>
  </div>
)}

    </div>
  );

  // 2. Active Tab Card - slight changes: added 'PlayCircle' icon, shows time prominently
  const ActiveTripCard = ({ trip }) => (
    <div className="bg-white rounded-lg border border-green-200 p-6 shadow-md transition-shadow hover:shadow-lg">
      {/* Top section: Title, status, type, message icon */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 max-w-full">
          <h3 className="text-[20px] archivo-semibold text-gray-900 break-words">
            {loading ? <Skeleton width={120} /> : trip.title}
          </h3>
          <span className={`px-2 py-1 text-center inter-medium rounded-full text-[12px] font-medium ${getStatusColor(trip.status)}`}>
            {loading ? <Skeleton width={60} /> : trip.status}
          </span>
          <span className={`px-2 py-1 text-center inter-medium rounded-full text-xs ${getTypeColor(trip.type)}`}>
            {loading ? <Skeleton width={60} /> : trip.type}
          </span>
        </div>
        <div className="flex-shrink-0">
          {loading ? <Skeleton width={20} height={20} /> : <MessageCircle />}
        </div>
      </div>

      {/* Middle section: Date, time, students, route */}
      <div className="mb-4 text-[#505050] flex flex-col sm:flex-row sm:flex-wrap gap-4">
        <div className="flex items-center space-x-2 min-w-[140px]">
          <Calendar className="w-4 h-4" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : trip.date}</span>
          <Clock className="ml-2 mr-2 w-4 h-4" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={60} /> : trip.time}</span>
        </div>
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Users className="w-4 h-4" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : `${trip.students} students`}</span>
        </div>
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <MapPin className="w-4 h-4" />
          <span className="inter-regular whitespace-normal break-words">{loading ? <Skeleton width={150} /> : trip.route}</span>
        </div>
      </div>

      {/* Driver section or fallback message */}
    {loading ? (
  <div className="pt-4 border-t border-green-200">
    <Skeleton height={40} width={200} />
  </div>
) : trip.assignedDrivers && trip.assignedDrivers.length > 0 ? (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-green-200 gap-3">
    <div className="flex flex-wrap items-center gap-3">
      {trip.assignedDrivers.map((driver, index) => (
        <div key={index} className="flex items-center gap-3">
          {driver.profileImage ? (
            <img
              src={driver.profileImage}
              alt={driver.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-green-700">
                {driver.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm inter-medium text-green-900">{driver.name}</p>
            <p className="text-xs text-green-700 inter-regular">{driver.address || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="flex items-center space-x-1 justify-start md:justify-end mt-2 md:mt-0">
      <span className="text-sm text-[#808080] inter-regular">Current Rating</span>
      <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
      <span className="text-sm font-medium text-gray-900">
        {trip.assignedDrivers.map(d => d.rating || 0).join(", ")}
      </span>
    </div>
  </div>
) : (
  <p className="text-sm text-green-600 italic pt-4 border-t border-green-200">
    Driver not assigned yet
  </p>
)}

    </div>
  );

  // 3. Scheduled Tab Card - vertical stack of date/time, smaller font, blue tone
  const ScheduledTripCard = ({ trip }) => (
    <div className="bg-white rounded-lg border border-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: title, status, type, message icon */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <h3 className="text-lg archivo-semibold text-[#1F2633]">
            {loading ? <Skeleton width={120} /> : trip.title}
          </h3>
          <div className="flex flex-wrap gap-2 ml-0 sm:ml-3">
            <span className={`px-2 py-1 inter-medium rounded-full text-[12px] font-medium ${getStatusColor(trip.status)}`}>
              {loading ? <Skeleton width={60} /> : trip.status}
            </span>
            <span className={`px-2 py-1 inter-medium rounded-full text-xs ${getTypeColor(trip.type)}`}>
              {loading ? <Skeleton width={60} /> : trip.type}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {loading ? <Skeleton width={20} height={20} /> : <MessageCircle />}
        </div>
      </div>

      {/* Date, time, students */}
      <div className="text-[#6C727F] mb-3 text-sm inter-regular space-y-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{loading ? <Skeleton width={80} /> : trip.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{loading ? <Skeleton width={60} /> : trip.time}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : `${trip.students} students`}</span>
          </div>
        </div>
      </div>

      {/* Route and buses */}
      <div className="flex flex-col sm:flex-row sm:items-center text-[#6C727F] mb-3 space-y-1 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-1 flex-1 min-w-0">
          <MapPin className="w-4 h-4" />
          <span className="whitespace-normal break-words inter-regular">{loading ? <Skeleton width={150} /> : trip.route}</span>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Bus className="w-4 h-4" />
          <span className="truncate inter-regular">{loading ? <Skeleton width={80} /> : '10 Buses'}</span>
        </div>
      </div>

      {/* Driver info or fallback */}
    {loading ? (
  <div className="pt-3 border-t border-blue-100">
    <Skeleton height={30} width={150} />
  </div>
) : trip.assignedDrivers && trip.assignedDrivers.length > 0 ? (
  <div className="flex flex-wrap sm:flex-row sm:items-center gap-3 border-t border-blue-100 pt-3">
    {trip.assignedDrivers.map((driver, index) => (
      <div key={index} className="flex items-center gap-2">
        {driver.profileImage ? (
          <img
            src={driver.profileImage}
            alt={driver.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-[#6C727F]">
              {driver.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
        )}
        <div>
          <p className="text-xs inter-medium text-[#6C727F]">{driver.name}</p>
          <p className="text-[10px] text-[#6C727F] inter-regular">{driver.address || 'N/A'}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-xs text-blue-400 italic border-t border-blue-100 pt-2">
    Driver not assigned yet
  </p>
)}

    </div>
  );

  // 4. Pending Tab Card - alert icon + less details, yellow tone
  const PendingTripCard = ({ trip,handleDeleteTrip }) => (
    <div className="bg-white rounded-lg border border-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="justify-between flex items-center mb-4 gap-3">
        <h3 className="text-[20px] archivo-semibold text-gray-900 break-words">
          {loading ? <Skeleton width={120} /> : trip.title}
        </h3>
        <div className="flex">
          {loading ? <Skeleton width={40} height={20} /> : (
           <>
          <Edit
            onClick={() => navigate(`/post-trip-update/${trip.id}`)}
            className="w-7 h-7 mr-3 cursor-pointer text-[#707070] transition-transform duration-200 ease-in-out hover:text-[#27AE60] hover:scale-110 hover:bg-gray-200 rounded-full p-1"
          />
          <Trash
            onClick={() => handleDeleteTrip(trip.id)}
            className="w-7 h-7 cursor-pointer text-red-500 transition-transform duration-200 ease-in-out hover:text-red-700 hover:scale-110 hover:bg-red-100 rounded-full p-1"
          />
        </>

          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[#707070]">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : trip.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={60} /> : trip.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span className="text-[14px] inter-regular">{loading ? <Skeleton width={80} /> : `${trip.students} students`}</span>
        </div>
        <div className="flex items-center space-x-2 min-w-0">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-[14px] whitespace-normal break-words inter-regular">{loading ? <Skeleton width={150} /> : trip.route}</span>
        </div>
      </div>
    </div>
  );

  // 5. Completed Tab Card - gray tone, compact, shows rating bigger


const CompletedTripCard = ({ trip }) => {

  // Normalize driver data
  const drivers = trip.assignedDrivers?.length > 0
    ? trip.assignedDrivers.map(driver => ({
        id: driver._id , // Fallback unique ID
        name: driver.name || 'Unknown',
        profileImage: driver.profileImage || null,
        rating: driver.averageRating ?? null, // Use nullish coalescing for cleaner default
        address: driver.address || 'N/A',
      }))
    : [];

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-5 shadow transition-shadow hover:shadow-md">
      {/* Header: Icon, Title, Status, Type */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-2 mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg archivo-semibold text-gray-900">
            {loading ? <Skeleton width={120} /> : trip.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-auto">
          <span className={`px-2 py-1 inter-medium rounded-full text-[12px] font-medium ${getStatusColor(trip.status)}`}>
            {loading ? <Skeleton width={60} /> : trip.status}
          </span>
          <span className={`px-2 py-1 inter-medium rounded-full text-xs ${getTypeColor(trip.type)}`}>
            {loading ? <Skeleton width={60} /> : trip.type}
          </span>
        </div>
      </div>

      {/* Trip info: date, time, students, route */}
      <div className="text-gray-700 mb-3 text-sm inter-regular">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex items-center space-x-2 min-w-[120px]">
            <Calendar className="w-4 h-4" />
            <span>{loading ? <Skeleton width={80} /> : trip.date}</span>
          </div>
          <div className="flex items-center space-x-2 min-w-[120px]">
            <Clock className="w-4 h-4" />
            <span>{loading ? <Skeleton width={60} /> : trip.time}</span>
          </div>
          <div className="flex items-center space-x-2 min-w-[120px]">
            <Users className="w-4 h-4" />
            <span>{loading ? <Skeleton width={80} /> : `${trip.students} students`}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 min-w-0 flex-1">
          <MapPin className="w-4 h-4" />
          <span className="whitespace-normal break-words">{loading ? <Skeleton width={150} /> : trip.route}</span>
        </div>
      </div>

      {/* Driver info or fallback */}
      {loading ? (
        <div className="pt-3 border-t border-gray-200">
          <Skeleton height={40} width={200} />
        </div>
      ) : drivers.length > 0 ? (
        drivers.map((driver) => (
          <div key={driver.id} className="flex flex-col md:flex-row md:items-center gap-3 border-t border-gray-200 pt-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {driver.profileImage ? (
                <img
                  src={driver.profileImage}
                  alt={`${driver.name}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {driver.name.split(' ').map((n) => n[0]).join('')}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm inter-medium text-gray-900">{driver.name}</p>
              <p className="text-xs text-gray-700 inter-regular">{driver.address}</p>
            </div>
            <div className="md:ml-auto">
              {driver.rating != null && driver.rating !== '' ? (
                <div className="flex items-center space-x-1 text-gray-700 text-sm font-semibold">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>{driver.rating}</span>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/trip-management/feedback/${trip.id}/${driver.id}`)}
                  className="px-3 py-2 bg-red-600 text-white text-sm inter-medium rounded-md hover:bg-red-700 cursor-pointer transition-colors"
                >
                  Give Feedback
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic border-t border-gray-200 pt-3">
          Driver not assigned yet
        </p>
      )}
    </div>
  );
};

  // Main dynamic card renderer
  const TripCard = ({ trip }) => {
    switch (activeFilter) {
      case 'Active':
        return <ActiveTripCard trip={trip} />;
      case 'Scheduled':
        return <ScheduledTripCard trip={trip} />;
      case 'Pending':
        return <PendingTripCard  handleDeleteTrip={handleDeleteTrip} trip={trip} />;
      case 'Completed':
        return <CompletedTripCard trip={trip} />;
      case 'All':
      default:
        return <DefaultTripCard trip={trip} />;
    }
  };

  return (
   <div className="min-h-screen p-4 lg:px-6 py-0 overflow-x-hidden">
  <div className="">
    <div className="max-w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-0">
        <div>
          <h1 className="text-2xl md:text-3xl inter-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base mb-2">
            Manage and monitor all your transportation requests.
          </p>
        </div>
        <button
          onClick={() => navigate('/post-trip')}
          className="cursor-pointer mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red-600 transition duration-200"
        >
          Post New Trip
        </button>
      </div>
    </div>
  </div>

  <div className="max-w-full mx-auto">
    {/* Filter Buttons */}
    <div className="mb-6">
      <div className="flex overflow-x-auto bg-white shadow-sm p-4 gap-2 scrollbar-thin">
        {filterButtons.map((filter) => {
          const Icon = filterIcons[filter];
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer inter-medium text-sm transition-colors ${
                activeFilter === filter
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter}
            </button>
          );
        })}
      </div>
    </div>

    {/* Trips List */}
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill()
            .map((_, index) => (
              <Skeleton key={index} height={150} />
            ))}
        </div>
      ) : filteredTrips.length > 0 ? (
        filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500">No trips match the selected filter.</p>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default TripManagementBody;