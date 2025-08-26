import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Users, Square, Circle } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import io from 'socket.io-client';
import Sidebar from '../component/sidebar/Sidebar';
import Topbar from '../component/topbar/topbar';


const mapContainerStyle = {
  width: '100%',
  height: '400px', // you can adjust height
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyCFPBHuJfrROgkSCPySDf7c3uCETWpQGfU';
const defaultCenter = { lat: 24.8607, lng: 67.0011 }; // default map center (Karachi)

const LiveGPSTracking = () => {
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speed, setSpeed] = useState(0);
  const [students, setStudents] = useState(25);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to live tracking socket:", socket.id);
      // Join the active trip (replace with driverId or tripId dynamically)
      const driverId = localStorage.getItem("driverId"); // set your driverId
      socket.emit("JOIN_APP", { userId: driverId });
    });

    socket.on("LOCATION_UPDATE", (data) => {
      console.log("📍 Location update:", data);
      setCurrentLocation({
        lat: data.location.lat,
        lng: data.location.lng,
      });
      setSpeed(data.speed || 0);
      setCurrentTime(new Date());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">Live GPS Tracking</h1>
            <p className="text-gray-600 mb-6">Monitor your active trips in real-time.</p>

            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={currentLocation}
                  zoom={15}
                >
                  <Marker position={currentLocation} />
                </GoogleMap>
              </LoadScript>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4 lg:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Location:</span>
                  <p className="font-medium text-gray-900">{currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
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

            <button
              onClick={handleStopRide}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Square className="w-4 h-4" />
              STOP RIDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGPSTracking;
