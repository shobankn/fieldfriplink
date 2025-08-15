



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapPin, Eye, Users, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveTripSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
};


const ActiveTrips = () => {
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!Array.isArray(res.data.trips)) {
          toast.error('Invalid data format from server');
          setTrips([]);
          return;
        }

        const activeTrips = res.data.trips
          .map(trip => ({
            id: trip._id || 'unknown',
            title: trip.tripName,
            status: trip.tripStatus?.toLowerCase() || 'unknown',
            location: trip.currentLocation || 'N/A',
            students: `${trip.numberOfStudents || 0} students`,
            driver: trip.assignedDrivers?.[0]?.name || 'Unknown'
          }))
          .filter(trip => trip.status === 'active'); 

        setTrips(activeTrips);
      } catch (err) {
        console.error('Error fetching active trips:', err.response || err.message);
        toast.error(err.response?.data?.message || 'Failed to load active trips');
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] archivo-semibold text-gray-900">Active Trips</h3>
        <button className="text-[#4B5563] archivo-semibold text-sm font-medium hover:text-blue-600 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Live Tracking
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, idx) => (
            <ActiveTripSkeleton key={idx} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <p className="text-gray-500">No active trips found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="inter-medium text-[16px] text-gray-900">{trip.title}</h3>
                <span className="px-2 py-1 inter-medium text-[14px] bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p className="flex items-center inter-medium text-[14px]">
                  <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                  Current: {trip.location}
                </p>
                <p className="inter-medium text-[14px] flex">
                  <Users className="w-4 h-4 mr-2" />{trip.students}
                </p>
                <p className="inter-medium text-[14px] flex">
                  <User2 className="w-4 h-4 mr-2" />Driver: {trip.driver}
                </p>
              </div>
              <button  onClick={()=> navigate('/live-tracking')} className="w-full inter-medium text-[14px] bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                View Live Map
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveTrips;
