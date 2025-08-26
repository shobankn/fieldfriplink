import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800'
};

const TripCard = ({ trip }) => {
   let navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="inter-semibold text-[16px] text-gray-900">{trip.title}</h3>
        <span className={`px-2 py-1 rounded-full text-[14px] inter-medium ${statusColors[trip.status] || ''}`}>
          {trip.status}
        </span>
      </div>
     <div className="space-y-1 text-sm text-gray-600">
  <p className="flex text-[14px] inter-medium items-center">
    <Clock className="w-4 h-4 mr-1" />
    {trip.time} • {trip.students} students
  </p>

 
  {trip.drivers?.length > 0 ? (
    trip.drivers.map((driver, idx) => (
      <span key={idx} className="text-[14px] inter-medium block">
        <p className="text-[14px] inter-medium">Driver:{driver.name || 'Unknown'}</p> 
      </span>
    ))
  ) : (
    <span className="text-[14px] inter-medium">Unknown</span>
  )}
</div>

<div className="flex items-center space-x-2 mt-3">
  <button onClick={()=> navigate('/live-tracking')} className=" flex cursor-pointer items-center border-2 p-2 rounded-[6px] border-[#D1D5DB] space-x-1 text-xs text-gray-600 hover:text-gray-900">
    <MapPin className="w-4 h-4" />
    <span className="text-[14px] inter-medium">Track</span>
  </button>

  {/* Show a Call button for each driver with a phone */}
  {trip.drivers?.map((driver, idx) =>
    driver.phone ? (
      <a
        key={idx}
        href={`tel:${driver.phone}`}
        className="flex cursor-pointer items-center border-2 p-2 rounded-[6px] border-[#D1D5DB] space-x-1 text-xs text-gray-600 hover:text-gray-900"
      >
        <Phone className="w-4 h-4" />
        <span className="text-[14px] inter-medium">Call</span>
      </a>
    ) : null
  )}
</div>

    </div>
  );
};

// 🔹 Skeleton Loader Component (mimics TripCard layout)
const TripSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

const UpcomingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();

useEffect(() => {
  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const res = await axios.get(
        'https://fieldtriplinkbackend-production.up.railway.app/api/school/my-trips',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: ['active', 'scheduled']
          },
          paramsSerializer: params => {
            return Object.keys(params)
              .map(key =>
                Array.isArray(params[key])
                  ? params[key].map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')
                  : `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
              )
              .join('&');
          }
        }
      );

      console.log(res.data.trips);

      if (!Array.isArray(res.data.trips)) {
        toast.error('Invalid data format from server');
        setTrips([]);
        return;
      }

      const formattedTrips = res.data.trips
        .map(trip => ({
          id: trip._id || 'unknown',
          title: trip.tripName,
          status: trip.tripStatus?.toLowerCase() || 'unknown',
          time: trip.startTime
            ? new Date(trip.startTime).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
              })
            : 'N/A',
          students: trip.numberOfStudents || 0,
          drivers: trip.assignedDrivers?.length
      ? trip.assignedDrivers.map(driver => ({
          name: driver.name || "Unknown",
          phone: driver.phone || null
        }))
      : []
  }))
        .slice(0, 4); // just limit to 4

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




  return (
    <div className="pt-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] archivo-semibold text-gray-900">Upcoming Trips</h3>
         {trips.length > 0 && (
            <button
             onClick={() => navigate('/trip-management', { state: { tab: 'Scheduled' } })}
              className="cursor-pointer text-red-500 archivo-semibold text-sm font-medium hover:text-red-600"
            >
              View All
            </button>
          )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <TripSkeleton key={idx} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <p className="text-gray-500">No scheduled trips found.</p>
      ) : (
        <div className="space-y-4">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTrips;
