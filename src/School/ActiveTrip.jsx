import React from 'react';
import { MapPin, Eye, Users, User2 } from 'lucide-react';

const ActiveTrips = () => {
  const trips = [
    {
      title: 'Morning Route C',
      location: 'Near City Mall',
      eta: '5 mins',
      students: '18 students',
      driver: 'Sarah Sharma',
    },
    {
      title: 'Sports Complex Trip',
      location: 'Highway Junction',
      eta: '12 mins',
      students: '25 students',
      driver: 'Anita Singh',
    },
  ];

  return (
    <div className=" ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] archivo-semibold text-gray-900">Active Trips</h3>
        <button className="text-[#4B5563] archivo-semibold text-sm font-medium hover:text-blue-600 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Live Tracking
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="inter-medium text-[16px] text-gray-900">{trip.title}</h3>
              <span className="px-2 py-1 inter-medium text-[14px] bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p className="flex items-cente inter-medium text-[14px]">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                Current: {trip.location}
              </p>
              <p className='inter-medium text-[14px] flex'> <Users className='w-4 h-4 mr-2'/>{trip.students}</p>
              <p className='inter-medium text-[14px] flex'> <User2 className='w-4 h-4 mr-2'/>Driver: {trip.driver}</p>
            </div>
            <button className="w-full inter-medium text-[14px] bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              View Live Map
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveTrips;
