import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Bus, Navigation, CheckCircle, Circle, AlertCircle } from 'lucide-react';

// Sample trip data
const tripsData = [
  {
    id: 1,
    name: "Morning Route A",
    driver: "Ahmed Khan",
    students: 25,
    eta: "15 mins",
    status: "active",
    currentLocation: "Gulshan-e-Iqbal Block 13",
    nextStop: "Green Valley School",
    speed: "35 km/h",
    progress: [
      { id: 1, name: "Pickup Point 1", time: "07:00 AM", status: "completed", icon: CheckCircle },
      { id: 2, name: "Pickup Point 2", time: "07:15 AM", status: "completed", icon: CheckCircle },
      { id: 3, name: "Pickup Point 3", time: "07:30 AM", status: "current", icon: MapPin },
      { id: 4, name: "Green Valley School", time: "07:45 AM", status: "pending", icon: Clock }
    ],
    totalStudents: 25,
    totalBuses: 10
  },
  {
    id: 2,
    name: "Field Trip Return",
    driver: "Sarah Ali",
    students: 32,
    eta: "8 mins",
    status: "active",
    currentLocation: "Shahra-e-Faisal Main Road",
    nextStop: "City School Campus",
    speed: "40 km/h",
    progress: [
      { id: 1, name: "Museum Departure", time: "02:00 PM", status: "completed", icon: CheckCircle },
      { id: 2, name: "Highway Junction", time: "02:20 PM", status: "completed", icon: CheckCircle },
      { id: 3, name: "Main City Entry", time: "02:35 PM", status: "current", icon: MapPin },
      { id: 4, name: "City School Campus", time: "02:50 PM", status: "pending", icon: Clock }
    ],
    totalStudents: 32,
    totalBuses: 8
  }
];

const LiveTrackingComponent = () => {
  const [selectedTrip, setSelectedTrip] = useState(tripsData[0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl archivo-bold text-gray-900 mb-2">Live GPS Tracking</h1>
          <p className="text-gray-600">Monitor your active trips in real-time.</p>
        </div>

        {/* Top Row - Two Columns */}
        <div className="grid  grid-cols-1 lg:grid-cols-3  gap-6 mb-6">
          {/* Left Column - Active Trips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6  lg:col-span-1">
            <h2 className="text-lg inter-semibold text-gray-900 mb-4">Active Trips</h2>
            
            <div className="space-y-3">
              {tripsData.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => handleTripSelect(trip)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedTrip.id === trip.id
                      ? 'bg-green-100 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="inter-semibold text-gray-900">{trip.name}</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs inter-regular text-green-600 ">Live</span>
                    </div>
                  </div>
                  
                  <p className="text-sm inter-regular text-gray-600 mb-3">Driver: {trip.driver}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 inter-regular">{trip.students} students</span>
                    </div>
                    <div className="bg-green-100 inter-regular text-green-800 px-2 py-1 rounded-full text-xs ">
                      ETA: {trip.eta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Live Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-6  lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg inter-semibold text-gray-900">
                {selectedTrip.name} - Live Location
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-64 lg:h-72 flex items-center justify-center mb-6 relative overflow-hidden">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8  h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
              
              {/* Location Pin */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-blue-500 rounded-full shadow-lg animate-bounce">
                  <MapPin className=" sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="mt-4 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Real-time GPS tracking would be displayed here using maps integration
                  </p>
                </div>
              </div>

              {/* Emergency Button */}
              <button className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

          
           
          </div>
        </div>

        {/* Bottom Row - Full Width Trip Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg inter-semibold text-gray-900 mb-6">Trip Progress</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Progress Timeline */}
            <div className="space-y-4">
              {selectedTrip.progress.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div key={point.id} className="flex items-center gap-4">
                    <div className={`flex-shrink-0 ${getStatusColor(point.status)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="inter-medium text-gray-900 truncate">{point.name}</h4>
                        <span className={`px-2 py-1 inter-medium rounded-full text-xs font-medium capitalize ${getStatusBadge(point.status)}`}>
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
      {/* Icon */}
      <div className="mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center">
        <Users className="w-7 h-7 text-blue-500" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <span className="text-sm sm:text-base inter-medium text-gray-600">Students</span>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedTrip.totalStudents}</span>
      </div>
    </div>

    {/* No. of Buses */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
      {/* Icon */}
      <div className="mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center">
        <Bus className="w-8 h-8 text-orange-500" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <span className="text-sm sm:text-base inter-medium text-gray-600">No. of Buses</span>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedTrip.totalBuses}</span>
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

export default LiveTrackingComponent;