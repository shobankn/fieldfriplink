import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

const tripData = [
  {
    title: 'Morning Pickup Route A',
    time: '07:30 AM',
    students: 28,
    driver: 'Rajesh Kumar',
    status: 'scheduled',
    hasTrack: true,
    hasCall: true
  },
  {
    title: 'Science Museum Visit',
    time: '09:00 AM',
    students: 35,
    driver: 'Priya Sharma',
    status: 'active',
    hasTrack: true,
    hasCall: true
  },
  {
    title: 'Evening Return Route B',
    time: '03:30 PM',
    students: 22,
    driver: 'Mohammed Ali',
    status: 'scheduled',
    hasTrack: true,
    hasCall: true
  },
  {
    title: 'Evening Return Route B',
    time: '03:30 PM',
    students: 22,
    driver: 'Mohammed Ali',
    status: 'scheduled',
    hasTrack: true,
    hasCall: true
  }
];

const statusColors = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800'
};

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="inter-semibold text-[16px] text-gray-900">{trip.title}</h3>
        <span className={`px-2 py-1 rounded-full text-[14px] inter-medium ${statusColors[trip.status]}`}>
          {trip.status}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p className="flex  text-[14px] inter-medium items-center">
          <Clock className="w-4 h-4 mr-1" />
          {trip.time} • {trip.students} students
        </p>
        <p className='text-[14px] inter-medium'>Driver: {trip.driver}</p>
      </div>
      <div className="flex items-center space-x-2 mt-3">
        {trip.hasTrack && (
          <button className="flex  cursor-pointer items-center border-2 p-2 rounded-[6px] border-[#D1D5DB] space-x-1 text-xs text-gray-600 hover:text-gray-900">
            <MapPin className="w-4 h-4" />
            <span className=' text-[14px] inter-medium'>Track</span>
          </button>
        )}
        {trip.hasCall && (
          <button className="flex cursor-pointer items-center border-2 p-2 rounded-[6px] border-[#D1D5DB]  space-x-1 text-xs text-gray-600 hover:text-gray-900">
            <Phone className="w-4 h-4" />
            <span className=' text-[14px] inter-medium'>Call</span>
          </button>
        )}
      </div>
    </div>
  );
};

const UpcomingTrips = () => {
  return (
    <div className=" pt-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] archivo-semibold text-gray-900">Upcoming Trips</h3>
        <button className="text-red-500  archivo-semibold text-sm font-medium hover:text-red-600">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {tripData.map((trip, index) => (
          <TripCard key={index} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingTrips;
