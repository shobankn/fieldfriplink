// import React from 'react';
// import { Bell, Bus, FileText } from 'lucide-react';

// const Notification = () => {
//   const notificationData = [
//     {
//       type: 'warning',
//       title: 'Trip Running Late',
//       description: 'Evening Return Route C is running 15 minutes late. Driver Ahmed has been notified. Evening Return Route C is running 15 minutes late. Driver Ahmed has been notified.',
//       time: '2 new · 5 mins ago',
//     },
//     {
//       type: 'success',
//       title: 'Trip Completed',
//       description: 'Morning Pickup Route A completed successfully. All 28 students dropped safely.',
//       time: '1 hour ago',
//     },
//     {
//       type: 'info',
//       title: 'New Driver Proposal',
//       description: 'Received proposal from Vikram Singh for Science Museum Visit trip. Received proposal from Vikram Singh for Science Museum Visit trip.',
//       time: '2 hours ago',
//     },
//   ];

//   const icons = {
//     warning: Bell,
//     success: Bus,
//     info: FileText,
//   };

//   const bgColors = {
//     warning: 'bg-red-50 text-red-600 shadow-sm ',
//     success: 'bg-green-50 text-green-600 shadow-sm',
//     info: 'bg-blue-50 text-blue-600 shadow-sm',
//   };

//   return (
//     <div className="">
//       <h2 className="text-[20px] archivo-semibold text-gray-900 mb-4">Recent Notifications</h2>
//       <div className="space-y-4 ">
//         {notificationData.map((item, index) => {
//           const Icon = icons[item.type];
//           const colorClass = bgColors[item.type];

//           return (
//             <div key={index} className={`flex items-start p-4 rounded-lg  ${colorClass}`}>
//               <div className="w-8 h-8  rounded-full flex items-center justify-center">
//                 <Icon className="w-5 h-5" />
//               </div>
//               <div className="flex-1 ml-3">
//                 <p className="text-[16px] inter-medium text-gray-900">{item.title}</p>
//                 <p className="text-[14px] inter-medium text-gray-600 mt-1">{item.description}</p>
//                 <p className="text-[12px] inter-medium text-gray-400 mt-1">{item.time}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
   
//     </div>
//   );
// };

// export default Notification;



import React, { useState, useEffect } from 'react';
import { Bell, Bus, FileText } from 'lucide-react';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = 'https://fieldtriplinkbackend-production.up.railway.app/api/common/notifications';
  const TOKEN = localStorage.getItem('token');

  const typeMapping = {
    trip: { type: 'success', icon: Bus },
    proposal: { type: 'info', icon: FileText },
    rating: { type: 'info', icon: FileText },
    chat: { type: 'info', icon: FileText },
    system: { type: 'warning', icon: Bell },
    invitation: { type: 'info', icon: FileText },
    driver_status_update: { type: 'warning', icon: Bell },
    general: { type: 'info', icon: FileText },
  };

  const bgColors = {
    warning: 'bg-red-50 text-red-600 shadow-sm',
    success: 'bg-green-50 text-green-600 shadow-sm',
    info: 'bg-blue-50 text-blue-600 shadow-sm',
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (response.data.success) {
          const formattedNotifications = response.data.data.map((item) => ({
            type: typeMapping[item.type]?.type || 'info',
            title: item.title,
            description: item.body,
            time: new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }) + ` · ${new Date(item.createdAt).toLocaleDateString()}`,
            isRead: item.isRead,
          }));
          setNotifications(formattedNotifications);
        } else {
          setError('Failed to fetch notifications');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Invalid or expired token. Please log in again.');
        } else {
          setError('Error fetching notifications. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (TOKEN) {
      fetchNotifications();
    } else {
      setError('No authentication token found. Please log in.');
      setIsLoading(false);
    }
  }, []);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-start p-4 rounded-lg bg-gray-50 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"></div>
          <div className="flex-1 ml-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="">
      <h2 className="text-[20px] archivo-semibold text-gray-900 mb-4">Recent Notifications</h2>
      {error && <p className="text-red-600 text-[14px] inter-medium mb-4">{error}</p>}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 && !error && (
            <p className="text-gray-600 text-[14px] inter-medium">No notifications available</p>
          )}
          {notifications.slice(0, 4).map((item, index) => {
            const Icon = typeMapping[item.type]?.icon || FileText;
            const colorClass = bgColors[item.type];

            return (
              <div key={index} className={`flex items-start p-4 rounded-lg ${colorClass}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 ml-3">
                  <p className="text-[16px] inter-medium text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="text-[14px] inter-medium text-gray-600 mt-1  line-clamp-1">{item.description}</p>
                  <p className="text-[12px] inter-medium text-gray-400 mt-1 line-clamp-1 ">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;