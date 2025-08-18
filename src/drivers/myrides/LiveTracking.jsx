import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Users, Square, Circle } from 'lucide-react';
import Sidebar from '../component/sidebar/Sidebar';
import Topbar from '../component/topbar/topbar';

const LiveGPSTracking = () => {
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speed, setSpeed] = useState(35);
  const [students, setStudents] = useState(25);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  // Simulate live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate speed changes
      setSpeed(prev => Math.max(20, Math.min(50, prev + (Math.random() - 0.5) * 5)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStopRide = () => {
    setIsLive(false);
    // Handle stop ride logic here
    console.log('Ride stopped');
  };

  return (

        <div className="flex h-screen overflow-y-auto relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar drawer for small screens */}
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />



    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            Live GPS Tracking
          </h1>
          <p className="text-gray-600">Monitor your active trips in real-time.</p>
        </div>

        {/* Main Tracking Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Route Header */}
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg lg:text-xl font-medium text-gray-900">
                Morning Route A - Live Location
              </h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
                <span className={`text-sm font-medium ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isLive ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className="relative">
            {/* Map Container */}
            <div className="h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-6 h-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-green-200"></div>
                  ))}
                </div>
              </div>

              {/* Current Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Pulsing Circle */}
                  <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                  <div className="relative w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Route Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 50 300 Q 200 200 350 250 Q 500 300 650 200"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  className="opacity-60"
                />
              </svg>

              {/* Target Location */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <Circle className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-bold text-gray-700">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-bold text-gray-700">−</span>
                </button>
              </div>

              {/* Location Recenter Button */}
              <div className="absolute bottom-4 right-4">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Navigation className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Map Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 lg:p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Location:</span>
                    <p className="font-medium text-gray-900">Gulshan-e-Iqbal Block 13</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Stop:</span>
                    <p className="font-medium text-gray-900">Green Valley School</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Speed:</span>
                    <p className="font-medium text-gray-900">{Math.round(speed)} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 lg:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Trip Progress</h3>

            {/* Pickup Point */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Circle className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Pickup Point 3</h4>
                    <p className="text-sm text-gray-600">{currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Current
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Students and Stop Ride Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students}</p>
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

            {/* Live Status Indicator */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  Live tracking active • Last updated: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
    </div>
    </div>
  );
};

export default LiveGPSTracking;