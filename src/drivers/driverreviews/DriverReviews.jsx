import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaStar, FaRegStar, FaTrophy, FaSmile, FaMeh } from 'react-icons/fa';
import { FiMessageSquare } from "react-icons/fi";

const DriverReviews = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Recent Reviews");
  const [reviewsData, setReviewsData] = useState({
    overallRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    schoolReviews: [],
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
  });
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-reviews',
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        const reviews = Array.isArray(data) ? data : data.reviews || [];

        // Calculate overall rating and distribution
        const totalReviews = reviews.length;
        const ratingSum = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const overallRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : 0;
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((review) => {
          const roundedRating = Math.round(review.rating);
          if (roundedRating >= 1 && roundedRating <= 5) {
            ratingDistribution[roundedRating]++;
          }
        });

        // Map reviews to schoolReviews format
        const schoolReviews = reviews.map((review) => {
          const reviewDate = new Date(review.createdAt);
          const dateStr = reviewDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            id: review._id,
            school: review.tripName || 'School Trip',
            rating: review.rating,
            comment: review.comment || 'No comment provided.',
            category: review.rating >= 4 ? 'Excellent' : 'Good',
            date: dateStr
          };
        });

        setReviewsData({
          ...reviewsData,
          overallRating,
          totalReviews,
          ratingDistribution,
          schoolReviews
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Shimmer effect components
  const ShimmerCard = () => (
    <div className="bg-white rounded-lg rounded-t-none p-5 mb-4 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );

  const ShimmerOverviewCard = () => (
    <div className="bg-gray-200 rounded-lg p-[31px] animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded w-12"></div>
      </div>
    </div>
  );

  const ShimmerDistribution = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="flex items-center gap-1">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );

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
    return total > 0 ? Math.round((reviewsData.ratingDistribution[stars] / total) * 100) : 0;
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

        <main className="flex-1 overflow-y-auto pt-16 px-[33px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            <h1 className="archivobold text-[30px] mt-[18px]">Reviews & Feedback</h1>
            <p className="text-gray-600 mb-6 interregular">Track your ratings and customer feedback</p>

            {/* Overview Section */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shadow">
                <ShimmerOverviewCard />
                <ShimmerOverviewCard />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
                {/* Overall Rating Card */}
                <div className="bg-[#FEE564] flex justify-between items-center text-black rounded-lg p-[31px]">
                  <div>
                    <div className="text-[14px] mt-1 interregular">Overall Rating</div>
                    <div className="text-[48px] archivobold">{reviewsData.overallRating}</div>
                  </div>
                  <div>
                    <FaRegStar className='text-[#FFC107] text-[56px]' />
                  </div>
                </div>

                {/* Total Reviews */}
                <div className="bg-white rounded-lg p-[31px] flex items-center justify-between shadow">
                  <div>
                    <div className="text-[14px] interregular text-gray-500 mt-1">Total Reviews</div>
                    <div className="text-[48px] archivobold">{reviewsData.totalReviews}</div>
                  </div>
                  <div><FiMessageSquare className='text-[#DE3B40] text-[44px]'/></div>
                </div>
              </div>
            )}

            {/* Rating Distribution */}
            {loading ? (
              <ShimmerDistribution />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-[20px] archivobold mb-4">Rating Distribution</h2>
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
            )}

            {/* Recent Reviews Section with Box Shadow */}
            <div className="bg-white rounded-lg shadow">
              {/* Filter Tabs */}
              <div className="flex gap-6 border-b border-[#EEEEEE] px-6 py-0 rounded-t-lg">
                <button
                  className="pb-3 pt-3 font-medium text-[#FE3838] border-b-2 border-[#FE3838]"
                >
                  Recent Reviews
                </button>
              </div>

              {/* School Reviews */}
              {loading ? (
                <div className="space-y-4 p-6">
                  <ShimmerCard />
                  <ShimmerCard />
                  <ShimmerCard />
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {reviewsData.schoolReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="archivomedium text-[18px] text-lg">{review.school}</h3>
                          <span className="text-[14px] interregular text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="interregular">{review.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 interregular text-[16px]">{review.comment}</p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-4">
                          <button className="text-black-900 bg-[#FFDD00] px-3 py-2 rounded-[100px] interregular">Helpful</button>
                          <button className="text-black-900 bg-[#FFDD00] px-3 py-2 rounded-[100px] interregular">Reply</button>
                          <button className="text-black-900 bg-[#FFDD00] px-3 py-2 rounded-[100px] interregular">Report</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && reviewsData.schoolReviews.length === 0 && (
                <div className="bg-white rounded-lg rounded-t-none p-8 text-center">
                  <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">Your reviews and feedback will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverReviews;