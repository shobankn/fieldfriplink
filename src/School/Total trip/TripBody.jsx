import React from 'react';
import { 
  Clock, 
  Users, 
  Plus,
  MapPin,
  MessageCircle,
  Shield,
  Calendar
} from 'lucide-react';
import TotalTopCard from './TotalTopCard';



const ActiveTripCard = ({ title, driver, eta, students, progress }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-gray-600 text-xs mt-1">Driver: {driver}</p>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>ETA: {eta}</span>
          <span>{students} students</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-green-600 mt-1 font-medium">{progress}% complete</p>
      </div>
    </div>
  );
};

const UpcomingTripCard = ({ title, time, driver, students, status }) => {
  const statusColors = {
    'scheduled': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-gray-600 text-xs">Driver: {driver}</p>
            <p className="text-gray-600 text-xs">{students} students</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900 text-sm">{time}</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};


const QuickActionButton = ({ title, variant = 'default' }) => {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    default: 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  };

  return (
    <button className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${variants[variant]}`}>
      {title}
    </button>
  );
};

const DashboardTotalTripSection = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Stats Grid */}
      <TotalTopCard/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trips Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Trips</h2>
            <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            <ActiveTripCard
              title="Morning Route B"
              driver="Fatima Sheikh"
              eta="15 mins"
              students="24"
              progress={65}
            />
            <ActiveTripCard
              title="Field Trip Return"
              driver="Ali Ahmed"
              eta="8 mins"
              students="32"
              progress={85}
            />
          </div>
        </div>

        {/* Upcoming Trips Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Trips</h2>
            <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
              View All
            </button>
          </div>
          
          <div className="space-y-0">
            <UpcomingTripCard
              title="Morning Pickup Route"
              time="07:00 AM"
              driver="Ahmed Khan"
              students="28"
              status="scheduled"
            />
            <UpcomingTripCard
              title="Science Museum Visit"
              time="08:30 AM"
              driver="Sarah Ali"
              students="40"
              status="active"
            />
            <UpcomingTripCard
              title="Sports Event Transport"
              time="02:00 PM"
              driver="Muhammad Hassan"
              students="35"
              status="scheduled"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton title="Post New Trip" variant="primary" />
          <QuickActionButton title="Live Tracking" variant="secondary" />
          <QuickActionButton title="Message Drivers" variant="default" />
        </div>
      </div>
    </div>
  );
};

export default DashboardTotalTripSection;