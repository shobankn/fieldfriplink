import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { Calendar, CalendarHeartIcon, CircleCheckIcon, MessageSquare, Star, Users } from 'lucide-react';
import axios from 'axios';

const Driverdashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalProposals: 0,
    scheduledTrips: 0,
    availableTrips: 0,
  });
  const [scheduledRides, setScheduledRides] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState({
    stats: true,
    scheduled: true,
    invitations: true,
    activities: true,
    activeRide: true,
  });
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats((prev) => ({
          ...prev,
          totalReviews: response.data.totalReviews,
          availableTrips: response.data.availableTrips,
        }));
        setLoading((prev) => ({ ...prev, stats: false }));
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    const fetchActiveRide = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=active',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const activeTrip = response.data.trips?.[0] || null;
        setActiveRide(
          activeTrip
            ? {
                school: activeTrip.tripName,
                distance: activeTrip.distance || '5.2 km',
                expectedTime: activeTrip.expectedTime || '15 mins',
              }
            : null
        );
        setLoading((prev) => ({ ...prev, activeRide: false }));
      } catch (error) {
        console.error('Error fetching active ride:', error);
        setActiveRide(null);
        setLoading((prev) => ({ ...prev, activeRide: false }));
      }
    };

    const fetchScheduledRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/trips?status=scheduled',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mappedScheduledRides = response.data.trips.map((trip) => {
          const startDate = new Date(trip.startTime || trip.tripDate);
          const dateStr = startDate.toISOString().split('T')[0];
          return {
            id: trip._id,
            school: trip.tripName,
            date: dateStr,
            students: trip.numberOfStudents,
          };
        });

        setScheduledRides(mappedScheduledRides);
        setStats((prev) => ({ ...prev, scheduledTrips: mappedScheduledRides.length }));
        setLoading((prev) => ({ ...prev, scheduled: false }));
      } catch (error) {
        console.error('Error fetching scheduled rides:', error);
        setLoading((prev) => ({ ...prev, scheduled: false }));
      }
    };

    const fetchInvitations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/driver/invitations?status=pending&page=1',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mappedInvitations = response.data.invitations.map((inv) => {
          const trip = inv.tripId;
          const startDate = new Date(trip.startTime || trip.tripDate);
          const dateStr = startDate.toISOString().split('T')[0];
          return {
            id: inv._id,
            school: trip.tripName,
            date: dateStr,
            students: trip.numberOfStudents,
          };
        });

        setInvitations(mappedInvitations);
        setStats((prev) => ({ ...prev, totalProposals: mappedInvitations.length }));
        setLoading((prev) => ({ ...prev, invitations: false }));
      } catch (error) {
        console.error('Error fetching invitations:', error);
        setInvitations([]);
        setLoading((prev) => ({ ...prev, invitations: false }));
      }
    };

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mappedActivities = response.data.map((notification) => {
          const notificationDate = new Date(notification.createdAt);
          const timeDiff = Math.floor((Date.now() - notificationDate) / (1000 * 60 * 60 * 24));
          const timeStr =
            timeDiff === 0 ? 'Today' : timeDiff === 1 ? 'Yesterday' : `${timeDiff} days ago`;

          let icon = CircleCheckIcon;
          let iconColor = '#10B981';
          let bgColor = '#ECFDF5';

          if (notification.type === 'info') {
            icon = MessageSquare;
            iconColor = '#FBBF24';
            bgColor = '#FFFBEB';
          } else if (notification.type === 'review') {
            icon = Star;
            iconColor = '#EF4444';
            bgColor = '#FEF2F2';
          }

          return {
            id: notification._id,
            message: notification.message || 'No message provided.',
            time: timeStr,
            icon,
            iconColor,
            bgColor,
          };
        });

        setActivities(mappedActivities);
        setLoading((prev) => ({ ...prev, activities: false }));
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading((prev) => ({ ...prev, activities: false }));
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user } = response.data;
        setIsVerified(user.accountStatus === 'verified');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsVerified(false);
      }
    };

    fetchStats();
    fetchActiveRide();
    fetchScheduledRides();
    fetchInvitations();
    fetchActivities();
    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Shimmer effect for Schedule section
  const ScheduleShimmerCard = () => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  // Shimmer effect for New Ride Offers section
  const OffersShimmerCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-center w-full animate-pulse">
      <div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded-md w-24 mt-4 sm:mt-0"></div>
    </div>
  );

  // Shimmer effect for Recent Activity section
  const ActivityShimmerCard = () => (
    <div className="flex items-start animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 mt-1"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );

  // Shimmer effect for Active Ride section
  const ActiveRideShimmerCard = () => (
    <div className="bg-red-500 text-white rounded-lg p-6 mb-8 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded-md w-24 mt-4 sm:mt-0"></div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
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

        <main className="flex-1 overflow-y-auto pt-16 px-[32px] bg-gray-50">
          <div className="max-w-full mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[30px] mt-[18px] archivo-bold text-gray-800">Welcome back, Ahmed Khan!</h1>
              <p className="text-gray-600 inter-regular mt-1">Here is your driving dashboard overview</p>
            </div>

            {/* Verified Driver Alert */}
            {isVerified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 inter-semibold">Verified Driver</p>
                  <p className="text-green-700 inter-regular text-sm">
                    You have been verified and approved for rides
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 inter-semibold">Unverified Driver</p>
                  <p className="text-red-700 inter-regular text-sm">
                    Your account is not yet verified. Please complete the verification process.
                  </p>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FFFBEB] rounded-full flex items-center justify-center mr-4">
                    <Star className="text-[#FBBF24]" />
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {loading.stats ? <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div> : stats.totalReviews}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <CalendarHeartIcon className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Available</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {loading.stats ? <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div> : stats.availableTrips}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Proposals</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {loading.invitations ? <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div> : stats.totalProposals}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 inter-regular text-sm">Schedule</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {loading.scheduled ? <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div> : stats.scheduledTrips}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Ride */}
            <div className="bg-red-500 text-white rounded-lg p-6 mb-8">
              {loading.activeRide ? (
                <ActiveRideShimmerCard />
              ) : activeRide ? (
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-lg inter-semibold mb-1">Active Ride</h3>
                    <p className="text-red-100 inter-regular mb-2">{activeRide.school}</p>
                    <p className="text-red-100 inter-regular text-sm">
                      Distance: {activeRide.distance} | Expected: {activeRide.expectedTime}
                    </p>
                  </div>
                  <button className="bg-white mt-4 whitespace-nowrap inter-regular text-red-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    View Live
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg inter-semibold mb-1">Active Ride</h3>
                  <p className="text-red-100 inter-regular">No active ride</p>
                </div>
              )}
            </div>

            {/* Upcoming Rides */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                <button
                  onClick={() => navigate('/myrides', { state: { activeTab: 'Scheduled' } })}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {loading.scheduled ? (
                  <>
                    <ScheduleShimmerCard />
                    <ScheduleShimmerCard />
                    <ScheduleShimmerCard />
                  </>
                ) : scheduledRides.length > 0 ? (
                  scheduledRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{ride.school}</p>
                          <p className="text-sm text-gray-600">{ride.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="mr-1 w-4 h-4" />
                        <span className="text-sm">{ride.students} students</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No scheduled trips found.</p>
                )}
              </div>
            </div>

            {/* New Ride Offers */}
            <div className="bg-white mb-6 p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-center w-full">
              {loading.invitations ? (
                <OffersShimmerCard />
              ) : invitations.length > 0 ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">New Ride Offers</h3>
                    <p className="text-gray-600 text-sm">
                      {invitations.length} new ride offer{invitations.length !== 1 ? 's' : ''} available in your area
                    </p>
                    <p className="text-gray-600 text-sm">Send proposals now to secure these routes</p>
                  </div>
                  <button
                    onClick={() => navigate('/myrides', { state: { activeTab: 'Invitations' } })}
                    className="bg-red-500 mt-4 whitespace-nowrap text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    View Offers
                  </button>
                </>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">New Ride Offers</h3>
                  <p className="text-gray-600 text-sm">No offer available</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>

              <div className="space-y-4">
                {loading.activities ? (
                  <>
                    <ActivityShimmerCard />
                    <ActivityShimmerCard />
                    <ActivityShimmerCard />
                  </>
                ) : activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1`}
                        style={{ backgroundColor: activity.bgColor }}
                      >
                        <activity.icon className={`h-4 w-4`} style={{ color: activity.iconColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{activity.message}</p>
                        <p className="text-gray-600 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activities found.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Driverdashboard;