import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaStar, FaRegStar, FaTrophy, FaSmile, FaFrown, FaMeh } from 'react-icons/fa';

const reviewsData = {
  overallRating: 4.7,
  totalReviews: 142,
  ratingDistribution: {
    5: 85,
    4: 32,
    3: 15,
    2: 7,
    1: 3
  },
  schoolReviews: [
    {
      id: 1,
      school: "Beacon House School",
      rating: 4.8,
      comment: "Very punctual and safe driving. Students felt comfortable throughout the journey.",
      category: "Excellent",
      date: "2025-01-20"
    },
    {
      id: 2,
      school: "Oxford Grammar School",
      rating: 4.9,
      comment: "Excellent service, clean vehicle, and professional behavior. Highly recommended!",
      category: "Excellent", 
      date: "2025-01-18"
    },
    {
      id: 3,
      school: "Al-Huda School",
      rating: 4.2,
      comment: "Professional and reliable driver. Always on time and very courteous with students.",
      category: "Good",
      date: "2025-01-15"
    },
    {
      id: 4,
      school: "St. Patrick High School",
      rating: 4.6,
      comment: "Polite driver with good vehicle maintenance. Satisfied with the service.",
      category: "Excellent",
      date: "2025-01-12"
    }
  ],
  achievements: [
    {
      icon: "trophy",
      title: "Top Rated Driver",
      description: "Maintained 4.5+ rating for 6 months",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: "smile",
      title: "Student Favorite",
      description: "95% positive feedback from students",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: "star",
      title: "Excellent Service",
      description: "Over 100 successful rides completed",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: "shield",
      title: "Safety Champion",
      description: "Zero incidents in the last 12 months",
      color: "bg-gray-100 text-gray-400"
    }
  ]
};

const DriverReviews = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Recent Reviews");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
      } else {
        stars.push(<FaRegStar key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const getRatingPercentage = (stars) => {
    const total = Object.values(reviewsData.ratingDistribution).reduce((a, b) => a + b, 0);
    return Math.round((reviewsData.ratingDistribution[stars] / total) * 100);
  };

  const renderAchievementIcon = (iconType, colorClass) => {
    const iconProps = { className: "text-2xl" };
    
    switch(iconType) {
      case 'trophy':
        return <FaTrophy {...iconProps} />;
      case 'smile':
        return <FaSmile {...iconProps} />;
      case 'star':
        return <FaStar {...iconProps} />;
      default:
        return <FaMeh {...iconProps} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[20%]">
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
      <div className="flex flex-col flex-1 w-full lg:w-[80%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-4 bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <h1 className="text-2xl font-bold mb-1">Reviews & Feedback</h1>
            <p className="text-gray-600 mb-6">Track your ratings and customer feedback</p>

            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Overall Rating Card */}
              <div className="bg-yellow-400 text-black rounded-lg p-4">
                <div className="text-3xl font-bold">{reviewsData.overallRating}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(reviewsData.overallRating)}
                </div>
                <div className="text-sm mt-1">Overall Rating</div>
              </div>

              {/* Total Reviews */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-gray-800">{reviewsData.totalReviews}</div>
                <div className="text-sm text-gray-500 mt-1">Total Reviews</div>
              </div>

              {/* Recent Review */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Recent Review</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Driver Status</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-4">
                    <span className="text-sm w-4">{stars}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(stars)}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${getRatingPercentage(stars)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {reviewsData.ratingDistribution[stars]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-6 border-b mb-6 bg-white px-6 py-0">
              {["Recent Reviews", "All Reviews"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`pb-3 pt-3 font-medium ${
                    activeFilter === filter
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* School Reviews */}
            <div className="space-y-4 mb-6">
              {reviewsData.schoolReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{review.school}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-bold">{review.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-4">
                      <button className="text-blue-500 hover:text-blue-600">Helpful</button>
                      <button className="text-blue-500 hover:text-blue-600">Reply</button>
                      <button className="text-blue-500 hover:text-blue-600">Report</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Achievement Badges</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reviewsData.achievements.map((achievement, index) => (
                  <div key={index} className={`${achievement.color} rounded-lg p-4 text-center`}>
                    <div className="flex justify-center mb-2">
                      {renderAchievementIcon(achievement.icon, achievement.color)}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
                    <p className="text-xs opacity-80">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverReviews;