import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  Bus, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Search, 
  MoreVertical,
  Clock,
  MapPin,
  X
} from 'lucide-react';

const NotificationBody = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const BASE_URL = 'https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications';

  const typeConfig = {
    payment_reminder: {
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      category: 'Payment'
    },
    trip_status: {
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      category: 'Trip'
    },
    trip: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      category: 'Trip'
    },
    proposal: {
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      category: 'Proposal'
    },
    default: {
      icon: Bell,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      category: 'General'
    }
  };

const fetchNotifications = async (pageNum = 1) => {
  try {
    setIsLoading(true);
    setError(null);

    // Get token (adjust depending on how you store it)
    const token = localStorage.getItem("token"); 

    const response = await axios.get(`${BASE_URL}?page=${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // 👈 Added Bearer token
      },
    });

    if (response.data.success) {
      setNotifications(prev =>
        pageNum === 1 ? response.data.data : [...prev, ...response.data.data]
      );
      setFilteredNotifications(prev =>
        pageNum === 1 ? response.data.data : [...prev, ...response.data.data]
      );
      setTotalPages(response.data.totalPages);
      setPage(pageNum);
    } else {
      throw new Error("Failed to fetch notifications");
    }
  } catch (err) {
    setError(err.message || "An error occurred while fetching notifications");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Filter by search query
    let filtered = notifications;
    if (searchQuery) {
      filtered = filtered.filter(notif => 
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredNotifications(filtered);
  }, [notifications, searchQuery]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`${BASE_URL}/${id}/read`);
//       setNotifications(prev => 
//         prev.map(notif => 
//           notif._id === id ? { ...notif, isRead: true } : notif
//         )
//       );
//     } catch (err) {
//       console.error('Failed to mark notification as read:', err);
//     }
//   };

  const getNotificationConfig = (type) => {
    return typeConfig[type] || typeConfig.default;
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const NotificationCard = ({ notification }) => {
    const config = getNotificationConfig(notification.type);
    const Icon = config.icon;

    return (
      <div 
        className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer group
          ${notification.isRead ? 'border-gray-100' : 'border-blue-200 shadow-sm'}
          ${selectedNotification?._id === notification._id ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={() => {
          setSelectedNotification(notification);
          if (!notification.isRead) markAsRead(notification._id);
        }}
      >
        <div className="p-3 sm:p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className={`text-sm inter-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color} inter-medium`}>
                    {config.category}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 inter-medium transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className={`text-sm leading-relaxed  inter-medium mb-3 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                {notification.body}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
  {/* Left side (time + trip id) */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-500">
    <div className="flex items-center inter-medium space-x-1 mb-1 sm:mb-0">
      <Clock className="w-3.5 h-3.5" />
      <span className="whitespace-nowrap">{formatTimeAgo(notification.createdAt)}</span>
    </div>

    {notification.data?.tripId && (
      <div className="flex items-center inter-medium space-x-1">
        <MapPin className="w-3.5 h-3.5" />
        <span>Trip ID: {notification.data.tripId.slice(-6)}</span>
      </div>
    )}
  </div>

  {/* Right side (action badge) */}
  {notification.data?.action && (
    <div className="mt-2 sm:mt-0 flex justify-start sm:justify-end">
      <span className="text-xs inter-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {notification.data.action.replace('_', ' ').toUpperCase()}
      </span>
    </div>
  )}
</div>

            </div>
          </div>
        </div>
      </div>
    );
  };



  const DetailModal = ({ notification, onClose }) => {
    if (!notification) return null;
    const config = getNotificationConfig(notification.type);
    const Icon = config.icon;

    return (
      <div className="fixed inset-0  bg-black/20 backdrop-blur-sm  z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg inter-bold text-gray-900">Notification Details</h2>
              <button 
                onClick={onClose}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div>
                  <h3 className="inter-semibold text-gray-900">{notification.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color} inter-medium`}>
                    {config.category}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm inter-medium text-gray-700 leading-relaxed">{notification.body}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className=" inter-medium text-gray-500">Time:</span>
                  <p className="inter-medium">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
            
              </div>

            {notification.data && notification.data.status && (
                <div>
                    <span className="text-gray-500 inter-medium text-sm">Trip Status:</span>
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600 inter-medium ">Status:</span>
                        <span className="font-medium text-gray-900 inter-medium ">
                        {notification.data.status}
                        </span>
                    </div>
                    </div>
                </div>
                )}

            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && page === 1) {
  return (
    <div className="max-w-full p-4 sm:px-12 py-0">

      {/* Static Header (always visible) */}
      <div className="mb-2 mt-2 sm:mb-6 text-start">
        <h2 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-1">Notifications</h2>
        <p className="text-gray-500 inter-regular text-sm">
          Stay updated with your latest trip, proposals, and payment alerts.
        </p>
      </div>

{/* Disabled search while loading */}
<div className="mb-6">
  <div className="relative flex items-center">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    <input
      type="text"
      placeholder="Search notifications..."
      disabled
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
    />
  </div>
</div>



      {/* Skeleton loader */}
      <SkeletonLoader />
    </div>
  );
}


  if (error) {
    return (
      <div className="max-w-full p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error fetching notifications</h3>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => fetchNotifications()}
            className="mt-4 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <> 
           

        <div className="max-w-full p-4 sm:px-12 py-0">

           <div className="mb-2 mt-2 sm:mb-6 text-start">
        <h2 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-1">Notifications</h2>
        <p className="text-gray-500 inter-regular text-sm">
          Stay updated with your latest trip, proposals, and payment alerts.
        </p>
      </div>


        <div className="flex items-center justify-between mb-6 flex-wrap">
          
        </div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

     {/* Notifications List */}
<div className="space-y-4 min-h-[500px] flex flex-col">
  {filteredNotifications.length === 0 ? (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <Bell className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
      <p className="text-gray-500">
        {searchQuery 
          ? 'Try adjusting your search criteria'
          : "You're all caught up! No new notifications at the moment."}
      </p>
    </div>
  ) : (
    filteredNotifications.map((notification) => (
      <NotificationCard key={notification._id} notification={notification} />
    ))
  )}
</div>


      {/* Load More Button */}
      {page < totalPages && (
        <div className="text-center mt-4 mb-4">
           <button 
    onClick={() => fetchNotifications(page + 1)}
    disabled={isLoading}
    className={`px-6 py-3 inter-medium rounded-xl cursor-pointer
      bg-red-500 text-white border border-transparent
      transition-all duration-300 ease-in-out
      hover:bg-red-600 hover:shadow-md hover:scale-[1.02]
      active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    {isLoading ? 'Loading...' : 'Load More Notifications'}
  </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotification && (
        <DetailModal 
          notification={selectedNotification} 
          onClose={() => setSelectedNotification(null)} 
        />
      )}
    </div>


    </>
  );

};

export default NotificationBody;