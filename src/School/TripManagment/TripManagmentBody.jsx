import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Star,
  Eye,
 CheckCircle,
  PlayCircle,
  ListChecks,
  AlertCircle,
  CheckSquare,
  
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

 const filterIcons = {
  All: Eye,
  Active: CheckSquare,
  Scheduled: Calendar,
  Pending:  Clock,
  Completed: CheckCircle
};


const TripManagementBody = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

 

  // Sample trip data
  const allTrips = [
    {
      id: 1,
      title: 'Morning Pickup Route A',
      status: 'Active',
      type: 'Recurring',
      date: '2024-01-15',
      time: '07:00 AM',
      students: 25,
      route: 'Gulshan-e-Iqbal → Green Valley School',
      driver: {
        name: 'Ahmed Khan',
        vehicle: 'Hiace - KHI-1234',
        rating: 4.8,
        avatar: '/api/placeholder/40/40'
      }
    },
    {
      id: 2,
      title: 'Science Museum Visit',
      status: 'Scheduled',
      type: 'One-time',
      date: '2024-01-18',
      time: '09:30 AM',
      students: 40,
      route: 'School Campus → Pakistan Science Museum',
      driver: {
        name: 'Sarah Ali',
        vehicle: 'Coaster - KHI-5678',
        rating: 4.9,
        avatar: '/api/placeholder/40/40'
      }
    },
    {
      id: 3,
      title: 'Sports Event Transport',
      status: 'Pending',
      type: 'One-time',
      date: '2024-01-20',
      time: '02:00 PM',
      students: 35,
      route: 'School Campus → Sports Complex',
      driver: null
    },
    {
      id: 4,
      title: 'Evening Return Route B',
      status: 'Completed',
      type: 'Recurring',
      date: '2024-01-15',
      time: '03:30 PM',
      students: 30,
      route: 'Green Valley School → North Nazimabad',
      driver: {
        name: 'Muhammad Hassan',
        vehicle: 'Hiace - KHI-9012',
        rating: 4.7,
        avatar: '/api/placeholder/40/40'
      }
    }
  ];

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
    ? allTrips 
    : allTrips.filter(trip => trip.status === activeFilter);

  const TripCard = ({ trip }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-shadow">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
      <h3 className="text-[20px] archivo-semibold text-gray-900 break-words">{trip.title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      <span className={`px-2 py-1 inter-medium rounded-full text-[12px] font-medium ${getStatusColor(trip.status)}`}>
        {trip.status}
      </span>
      <span className={`px-2 py-1 inter-medium rounded-full text-xs  ${getTypeColor(trip.type)}`}>
        {trip.type}
      </span>
    </div>
  </div>

  {/* Trip Details */}
  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
    <div className="flex items-center space-x-2 text-[#808080]">
      <Calendar className="w-4 h-4 shrink-0" />
      <span className="text-[14px] inter-regular">{trip.date}</span>
    </div>
    <div className="flex items-center space-x-2 text-[#808080]">
      <Clock className="w-4 h-4 shrink-0" />
      <span className="text-[14px] inter-regular">{trip.time}</span>
    </div>
    <div className="flex items-center space-x-2 text-[#808080]">
      <Users className="w-4 h-4 shrink-0" />
      <span className="text-[14px] inter-regular">{trip.students} students</span>
    </div>
    <div className="flex items-center space-x-2 text-[#808080] min-w-0">
      <MapPin className="w-4 h-4 shrink-0" />
      <span className="text-[14px]  truncate inter-regular">{trip.route}</span>
    </div>
  </div>

  {/* Driver Info */}
  {trip.driver ? (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4  gap-4">
      <div className="flex items-center flex-wrap gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-medium text-[#808080] ">
            {trip.driver.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="text-sm inter-medium text-gray-900">{trip.driver.name}</p>
          <p className="text-xs text-[#808080] inter-regular ">{trip.driver.vehicle}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span className="ml-0 sm:ml-6 text-sm text-[#808080]  inter-regular">Overall Rating</span>
          <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">{trip.driver.rating}</span>
        </div>
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
  };

  return (
    <div className="min-h-screen  p-4 lg:p-6">
       <div className=" p-4 ">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-0">
          <div>
            <h1 className="text-[30px] md:text-3xl archivo-bold text-gray-900">Trip Management</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Manage and monitor all your transportation requests.</p>
          </div>
          <button onClick={()=> navigate('/post-trip')} className=" cursor-pointer mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red-600 transition duration-200">
            Post New Trip
          </button>
        </div>
      </div>
    </div>
      <div className="max-w-full mx-auto">
        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex overflow-x-hidden bg-white shadow-sm p-4 flex-wrap justify-around gap-2">
  {filterButtons.map((filter) => {
    const Icon = filterIcons[filter];
    return (
      <button
        key={filter}
        onClick={() => setActiveFilter(filter)}
        className={`flex items-center gap-2 px-4 py-2 cursor-pointer inter-medium text-sm transition-colors  ${
          activeFilter === filter
            ? 'border-b-3 border-red-600 text-red-600'
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
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
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

        {/* Trip Statistics */}
        {/* {activeFilter === 'All' && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {allTrips.filter(t => t.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {allTrips.filter(t => t.status === 'Scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {allTrips.filter(t => t.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {allTrips.filter(t => t.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TripManagementBody;