import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Users, Square } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import Sidebar from '../component/sidebar/Sidebar';
import Topbar from '../component/topbar/topbar';
import { FaBusAlt } from 'react-icons/fa';
import { stopTracking } from './StartRide';

const busSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="orange" viewBox="0 0 512 512">
    ${FaBusAlt().props.children} 
  </svg>
`);


const mapContainerStyle = {
  width: '100%',
  height: '400px',
};







const GOOGLE_MAPS_API_KEY = 'AIzaSyCFPBHuJfrROgkSCPySDf7c3uCETWpQGfU';

const LiveGPSTracking = () => {
  const location = useLocation();
  const { tripId } = location.state || {}; // ✅ only tripId comes from navigation

  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speed, setSpeed] = useState(0);
  const [students, setStudents] = useState(25);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);
    const [buttonLoading, setButtonLoading] = useState({});
  

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


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

    // ✅ Stop tracking completely
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
  
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No token found in localStorage");
    return;
  }

  console.log("🎯 Selected tripId for tracking:", tripId);

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return;
  }

  const schoolId = decoded?.userId; // ✅ userId from token
  if (!schoolId) {
    console.error("❌ No schoolId found in token");
    return;
  }

  // 🔌 Connect socket
  const socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
    transports: ["websocket"],
  });
  socketRef.current = socket;

  // ✅ Connected
  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
    socket.emit("JOIN_APP", { userId: schoolId });
    console.log("📡 JOIN_APP sent with schoolId:", schoolId);
  });

  // 🔊 Listen for driver location updates
  socket.on("LOCATION_UPDATE", (data) => {
    console.log("📨 LOCATION_UPDATE received:", data);

    if (data?.tripId !== tripId) {
      console.log("⚠️ Ignored update (not matching tripId)", data.tripId);
      return;
    }

    if (data?.location) {
      console.log("✅ Setting driver location:", data.location);
      setCurrentLocation({ lat: data.location.lat, lng: data.location.lng });
      setSpeed(data.speed || 0);
    } else {
      console.log("⚠️ LOCATION_UPDATE missing location");
    }
  });

  // ✅ New backend events
 // ✅ New backend events
socket.on("UPDATE_LOCATION_SUCCESS", (data) => {
  console.log("✅ UPDATE_LOCATION_SUCCESS:", data);

  // Only update if tripId matches
  if (data?.tripId !== tripId) {
    console.log("⚠️ Ignored UPDATE_LOCATION_SUCCESS (not matching tripId)", data.tripId);
    return;
  }

  if (data?.location) {
    console.log("✅ Setting driver location from UPDATE_LOCATION_SUCCESS:", data.location);
    setCurrentLocation({ lat: data.location.lat, lng: data.location.lng });
    setSpeed(data.speed || 0);
  } else {
    console.log("⚠️ UPDATE_LOCATION_SUCCESS missing location");
  }
});

socket.on("UPDATE_LOCATION_FAILED", (error) => {
  console.error("❌ UPDATE_LOCATION_FAILED:", error);
});


  socket.on("UPDATE_LOCATION_FAILED", (error) => {
    console.error("❌ UPDATE_LOCATION_FAILED:", error);
  });

  // ❌ Disconnected
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return () => {
    socket.disconnect();
    console.log("🛑 Cleaned up socket");
  };
}, [tripId]);






  const handleStopRide = () => {
    setIsLive(false);
    if (socketRef.current) socketRef.current.disconnect();
    console.log("Ride stopped");
  };

  return (
    <div className="flex h-screen overflow-y-auto relative">
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div className="absolute left-0 top-0 h-full w-[75%] bg-white shadow-md z-50" onClick={(e) => e.stopPropagation()}>
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 mt-20">Live GPS Tracking</h1>
            <p className="text-gray-600 mb-6">Monitor your active trips in real-time.</p>

            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              {currentLocation ? (
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={currentLocation}
                    zoom={15}
                  >
                    <Marker position={currentLocation} />
                  </GoogleMap>
                </LoadScript>
              ) : (
                <div className="p-6 text-center text-gray-500">Waiting for driver location...</div>
              )}
            </div>

            {/* Info Panel */}
            {currentLocation && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4 lg:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Location:</span>
                    <p className="font-medium text-gray-900">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Speed:</span>
                    <p className="font-medium text-gray-900">{Math.round(speed)} km/h</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Students:</span>
                    <p className="font-medium text-gray-900">{students}</p>
                  </div>
                </div>
              </div>
            )}

           {/* <button
  onClick={() => handleEndRide(tripId)}
  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
>
  <Square className="w-4 h-4" />
  STOP RIDE
</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGPSTracking;
