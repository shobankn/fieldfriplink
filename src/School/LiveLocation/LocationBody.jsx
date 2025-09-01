import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Clock, Users, Bus, Navigation, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

// Assume toast is imported elsewhere or add: import { toast } from 'react-hot-toast'; // or react-toastify

const SOCKET_URL = 'https://fieldtriplinkbackend-production.up.railway.app';
const API_URL = 'https://fieldtriplinkbackend-production.up.railway.app/api/school/my-trips?status=active';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCFPBHuJfrROgkSCPySDf7c3uCETWpQGfU';

// Helper function to generate progress timeline from trip data (pickup points + destination)
const generateProgress = (trip) => {
  const progress = trip.pickupPoints.map((point, index) => ({
    id: index + 1,
    name: point.address,
    time: 'TBD',
    status: index === 0 ? 'current' : 'pending',
    icon: index === 0 ? MapPin : Clock,
  }));
  progress.push({
    id: progress.length + 1,
    name: trip.destination.address,
    time: 'TBD',
    status: 'pending',
    icon: Clock,
  });
  return progress;
};

const LiveTrackingComponent = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripLocations, setTripLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schoolId, setSchoolId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Fetch active trips
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const activeTrips = response.data.trips
          .filter(trip => trip.tripStatus === 'active')
          .map(trip => ({
            id: trip._id,
            name: trip.tripName,
            driver: trip.assignedDrivers.length > 0
              ? trip.assignedDrivers.map(d => d.name).join(', ')
              : 'Unassigned',
            students: trip.numberOfStudents,
            eta: 'Calculating...',
            status: trip.tripStatus,
            currentLocation: 'Fetching...',
            nextStop: trip.pickupPoints.length > 0 ? trip.pickupPoints[1]?.address || trip.destination.address : 'N/A',
            speed: '0 km/h',
            progress: generateProgress(trip),
            totalStudents: trip.numberOfStudents,
            totalBuses: trip.numberOfBuses,
          }));
        setTrips(activeTrips);
        if (activeTrips.length > 0) {
          setSelectedTrip(activeTrips[0]);
          setSchoolId(response.data.trips[0].schoolId);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⏳ No token found, skipping socket connection...");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      console.log("📌 Extracted schoolId from token:", decoded.userId);
    } catch (err) {
      console.error("❌ Failed to decode token:", err);
      return;
    }

    const schoolId = decoded.userId;
    if (!schoolId) {
      console.warn("⏳ No schoolId found in token, skipping socket connection...");
      return;
    }

    console.log("🔌 Initializing socket connection...");
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      newSocket.emit("JOIN_APP", { userId: schoolId });
      console.log(`🏫 Emitted JOIN_APP for schoolId: ${schoolId}`);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected. Reason:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on("LOCATION_UPDATE", (data) => {
      console.log("📍 LOCATION_UPDATE received:", data);
      if (trips.some((trip) => trip.id === data.tripId)) {
        console.log(`✅ Trip ${data.tripId} matched with active trips.`);

        setTripLocations((prev) => ({
          ...prev,
          [data.tripId]: {
            lat: data.location.lat,
            lng: data.location.lng,
            speed: data.speed,
            timestamp: data.timestamp,
          },
        }));

        setSelectedTrip((prev) =>
          prev && prev.id === data.tripId
            ? {
                ...prev,
                currentLocation: `${data.location.lat}, ${data.location.lng}`,
                speed: `${data.speed} km/h`,
                eta: "Updating...",
              }
            : prev
        );
      } else {
        console.log(`❌ Trip ${data.tripId} not found in active trips.`);
      }
    });

    return () => {
      console.log("🛑 Cleaning up socket connection...");
      newSocket.disconnect();
    };
  }, [trips]);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setSelectedPosition(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'current':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const selectedLocation = selectedTrip ? tripLocations[selectedTrip.id] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:px-6 py-0">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 py-1">
          <h1 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-2">Live GPS Tracking</h1>
          <p className="text-gray-600">Monitor your active trips in real-time.</p>
        </div>

        {loading ? (
          // 🔄 Still loading trips → show skeleton
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
              <h2 className="text-lg inter-semibold text-gray-900 mb-4">Active Trips</h2>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-6 lg:col-span-2">
              <div className="bg-gray-100 rounded-lg h-64 lg:h-72 animate-pulse"></div>
            </div>
          </div>
        ) : trips.length === 0 ? (
          // ❌ No active trips → show centered message
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center text-gray-600 inter-semi-bold text-lg bg-gray-50 rounded-lg border border-gray-200 p-6">
              No active trip available
            </div>
          </div>
        ) : (
          // ✅ Trips available → render normal layout
          <>
            {/* Top Row - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
              {/* Left Column - Active Trips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                <h2 className="text-lg inter-semibold text-gray-900 mb-4">Active Trips</h2>
                <div className="space-y-3">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => handleTripSelect(trip)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedTrip?.id === trip.id
                          ? 'bg-green-100 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="inter-semibold text-gray-900">{trip.name}</h3>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs inter-regular text-green-600">Live</span>
                        </div>
                      </div>
                      <p className="text-sm inter-regular text-gray-600 mb-3">Driver: {trip.driver}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 inter-regular">{trip.students} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Live Location */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg inter-semibold text-gray-900">
                    {selectedTrip ? `${selectedTrip.name} - Live Location` : 'Select a Trip'}
                  </h2>
                  {selectedTrip && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Live</span>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="rounded-lg h-64 lg:h-72 overflow-hidden relative">
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={
                        selectedLocation
                          ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
                          : { lat: 34.16977089044261, lng: 73.22476850235304 } // Default: Abbottabad
                      }
                      zoom={13}
                    >
                      {selectedLocation && (
                        <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                      )}
                      {selectedLocation && (
                        <Marker
                          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                          onClick={() => setSelectedPosition({ lat: selectedLocation.lat, lng: selectedLocation.lng })}
                        />
                      )}
                      {selectedPosition && selectedLocation && (
                        <InfoWindow
                          position={selectedPosition}
                          onCloseClick={() => setSelectedPosition(null)}
                        >
                          <div>
                            Current Location: {selectedTrip.currentLocation}<br />
                            Speed: {selectedTrip.speed}<br />
                            Updated: {new Date(selectedLocation.timestamp).toLocaleTimeString()}
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            </div>

            {/* Bottom Row - Full Width Trip Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg inter-semibold text-gray-900 mb-6">Trip Progress</h2>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Progress Timeline */}
                <div className="space-y-4">
                  {selectedTrip.progress.map((point) => {
                    const IconComponent = point.icon;
                    return (
                      <div key={point.id} className="flex items-center gap-4">
                        <div className={`flex-shrink-0 ${getStatusColor(point.status)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="inter-medium text-gray-900 truncate">{point.name}</h4>
                            <span
                              className={`px-2 py-1 inter-medium rounded-full text-xs font-medium capitalize ${getStatusBadge(
                                point.status
                              )}`}
                            >
                              {point.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{point.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Statistics */}
                <div className="flex">
                  <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-md">
                    {/* Students */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                      <div className="mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center">
                        <Users className="w-7 h-7 text-blue-500" />
                      </div>
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <span className="text-sm sm:text-base inter-medium text-gray-600">Students</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedTrip.totalStudents}</span>
                      </div>
                    </div>

                    {/* No. of Buses */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                      <div className="mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center">
                        <Bus className="w-8 h-8 text-orange-500" />
                      </div>
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <span className="text-sm sm:text-base inter-medium text-gray-600">No. of Buses</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedTrip.totalBuses}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingComponent;