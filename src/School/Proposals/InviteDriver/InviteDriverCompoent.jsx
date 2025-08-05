import React, { useState } from 'react';
import { Search, Filter, Heart, X, Star, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SelectJobPostPopup from './InviteDriverPopup';

const InviteDriversCompoent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(['School Transport']);
  const [savedDrivers, setSavedDrivers] = useState(new Set([2])); // Ahmed Hassan is saved by default
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigation = useNavigate();

    const handleSendJobPost = (trip) => {
    console.log('Sending job post for trip:', trip);
    // Handle sending job post logic here
    setIsPopupOpen(false);
  };

  // Dynamic drivers data
  const driversData = [
    {
      id: 1,
      name: "Hena Kumar K.",
      profileImage: "/api/placeholder/50/50",
      boosted: true,
      saved: false,
      rating: 4.9,
      reviewCount: 127,
      location: "Lahore, Pakistan",
      rate: "PKR 22.5/km",
      successScore: "100%",
      totalEarned: "PKR 200K+",
      completedTrips: "32 trips",
      skills: ["City Routes", "Safe Driving", "School Transport"],
      verified: true
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      profileImage: "/api/placeholder/50/50",
      boosted: false,
      saved: true,
      rating: 4.8,
      reviewCount: 89,
      location: "Karachi, Pakistan",
      rate: "PKR 20/km",
      successScore: "95%",
      totalEarned: "PKR 150K+",
      completedTrips: "28 trips",
      skills: ["Highway Driving", "Reliable", "Punctual"],
      verified: true
    },
    {
      id: 3,
      name: "Muhammad Ali",
      profileImage: "/api/placeholder/50/50",
      boosted: false,
      saved: false,
      rating: 4.7,
      reviewCount: 65,
      location: "Islamabad, Pakistan",
      rate: "PKR 25/km",
      successScore: "98%",
      totalEarned: "PKR 180K+",
      completedTrips: "24 trips",
      skills: ["School Transport", "Event Transport", "Long Distance"],
      verified: true
    }
  ];

  const handleSaveDriver = (driverId) => {
    setSavedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverId)) {
        newSet.delete(driverId);
      } else {
        newSet.add(driverId);
      }
      return newSet;
    });
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSuccessScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 98) return 'text-green-600';
    if (numScore >= 95) return 'text-green-500';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Invite Drivers</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drivers by route, name, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeFilters.map((filter) => (
                <div key={filter} className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <span>{filter}</span>
                  <button 
                    onClick={() => removeFilter(filter)}
                    className="hover:bg-yellow-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-red-600 text-sm hover:text-red-700 ml-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Drivers List */}
        <div className="space-y-4">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Driver Info Section */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={driver.profileImage}
                      alt={driver.name}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200"
                    />
                    {driver.boosted && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">⚡</span>
                      </div>
                    )}
                  </div>

                  {/* Driver Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                        {driver.boosted && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Boosted
                          </span>
                        )}
                        {driver.saved && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            Saved
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons - Mobile */}
                      <div className="flex sm:hidden items-center gap-2">
                        <button
                          onClick={() => handleSaveDriver(driver.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            savedDrivers.has(driver.id)
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${savedDrivers.has(driver.id) ? 'fill-current' : ''}`} />
                        </button>
                         <button 
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Invite
                      </button>
                       <SelectJobPostPopup 
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSendJobPost={handleSendJobPost}/>
                      </div>
                    </div>

                    {/* Rating and Location */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{driver.rating}</span>
                        <span className="text-gray-500">({driver.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{driver.location}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">Rate:</span>
                        <span className="font-semibold text-gray-900">{driver.rate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Success Score:</span>
                        <span className={`font-semibold ${getSuccessScoreColor(driver.successScore)}`}>
                          {driver.successScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Total Earned:</span>
                        <span className="font-semibold text-gray-900">{driver.totalEarned}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Completed:</span>
                        <span className="font-semibold text-gray-900">{driver.completedTrips}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                      {driver.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleSaveDriver(driver.id)}
                    className={`p-3 rounded-lg transition-colors ${
                      savedDrivers.has(driver.id)
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${savedDrivers.has(driver.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
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
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button 
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteDriversCompoent;