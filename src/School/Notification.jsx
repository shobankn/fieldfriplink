import React from 'react';
import { Bell, Bus, FileText } from 'lucide-react';

const Notification = () => {
  const notificationData = [
    {
      type: 'warning',
      title: 'Trip Running Late',
      description: 'Evening Return Route C is running 15 minutes late. Driver Ahmed has been notified. Evening Return Route C is running 15 minutes late. Driver Ahmed has been notified.',
      time: '2 new · 5 mins ago',
    },
    {
      type: 'success',
      title: 'Trip Completed',
      description: 'Morning Pickup Route A completed successfully. All 28 students dropped safely.',
      time: '1 hour ago',
    },
    {
      type: 'info',
      title: 'New Driver Proposal',
      description: 'Received proposal from Vikram Singh for Science Museum Visit trip. Received proposal from Vikram Singh for Science Museum Visit trip.',
      time: '2 hours ago',
    },
  ];

  const icons = {
    warning: Bell,
    success: Bus,
    info: FileText,
  };

  const bgColors = {
    warning: 'bg-red-50 text-red-600 shadow-sm ',
    success: 'bg-green-50 text-green-600 shadow-sm',
    info: 'bg-blue-50 text-blue-600 shadow-sm',
  };

  return (
    <div className="">
      <h2 className="text-[20px] archivo-semibold text-gray-900 mb-4">Recent Notifications</h2>
      <div className="space-y-4 ">
        {notificationData.map((item, index) => {
          const Icon = icons[item.type];
          const colorClass = bgColors[item.type];

          return (
            <div key={index} className={`flex items-start p-4 rounded-lg  ${colorClass}`}>
              <div className="w-8 h-8  rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 ml-3">
                <p className="text-[16px] inter-medium text-gray-900">{item.title}</p>
                <p className="text-[14px] inter-medium text-gray-600 mt-1">{item.description}</p>
                <p className="text-[12px] inter-medium text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
   
    </div>
  );
};

export default Notification;