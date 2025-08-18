import React, { useState } from 'react';
import { Star, MapPin, MessageSquare, Mail } from 'lucide-react';
import Navbar from './Navbar';
import SelectJobPostPopup from './InviteDriverPopup';



// Sample driver data matching your UI
const driversData = [
  {
    id: 1,
    name: "Hena Kumar K.",
    initials: "HK",
    rating: 4.9,
    reviews: 127,
    location: "Lahore, Pakistan",
    completed: 32,
    completedText: "trips",
    badges: ["City Routes", "Safe Driving", "School Transport"],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    avatarColor: "bg-gray-400"
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    initials: "AH",
    rating: 4.8,
    reviews: 89,
    location: "Karachi, Pakistan",
    completed: 28,
    completedText: "trips",
    badges: ["Highway Driving", "Reliable", "Punctual"],
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    avatarColor: "bg-emerald-400"
  },
  {
    id: 3,
    name: "Muhammad Ali",
    initials: "MA",
    rating: 4.7,
    reviews: 65,
    location: "Islamabad, Pakistan",
    completed: 24,
    completedText: "trips",
    badges: ["School Transport", "Event Transport", "Long Distance"],
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
    avatarColor: "bg-gray-600"
  }
];




const InviteDriversInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleInvite = (driver) => {
    console.log(`Opening invite popup for driver:`, driver);
    setSelectedDriver(driver);
    setIsPopupOpen(true);
  };

  const handleSendJobPost = (trip) => {
    console.log('Sending job post for trip:', trip, 'to driver:', selectedDriver);
    // Handle sending job post logic here
    alert(`Job post "${trip.title}" sent to ${selectedDriver?.name}!`);
    setIsPopupOpen(false);
    setSelectedDriver(null);
  };

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasDecimal = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasDecimal) {
      stars.push(
        <div key="partial" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl archivo-bold text-gray-900 mb-6">Invite Drivers</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search drivers by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Drivers List */}
        <div className="space-y-6">
  {filteredDrivers.map((driver) => (
    <div
      key={driver.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
            <img
              src={driver.profileImage}
              alt={driver.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className={`w-full h-full ${driver.avatarColor} flex items-center justify-center hidden`}>
              <span className="text-white inter-bold text-lg sm:text-xl">
                {driver.initials}
              </span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
              <h3 className="text-lg sm:text-xl inter-semibold text-gray-900 truncate">
                {driver.name}
              </h3>
            </div>

            {/* Rating & Location */}
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm inter-medium text-gray-900">{driver.rating}</span>
                <span className="text-sm inter-regular text-gray-500">({driver.reviews} reviews)</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm inter-regular text-gray-600">{driver.location}</span>
              </div>
            </div>

            {/* Completed Stats */}
            <div className="mb-4">
              <div className="text-sm inter-regular text-gray-600 mb-1">Completed:</div>
              <div className="inter-semibold text-gray-900">
                {driver.completed} {driver.completedText}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {driver.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F3F4F6] text-[#3B4555] text-sm rounded-full inter-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Invite Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => handleInvite(driver)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
          >
            <Mail className="w-4 h-4" />
            Invite
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* Empty State */}
        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later</p>
          </div>
        )}

        {/* Popup Component */}
        <SelectJobPostPopup 
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedDriver(null);
          }}
          onSendJobPost={handleSendJobPost}
        />
      </div>
    </div>
    </>
  
  );
};

export default InviteDriversInterface;

//asdasjj