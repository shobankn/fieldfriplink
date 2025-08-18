import React from 'react';
import { Shield, Calendar, Users } from 'lucide-react';

const TotalTopCard = () => {
  const stats = [
    {
      title: 'Active Trips',
      value: '8',
      change: '+12% from last month',
      icon: Shield,
      bgColor: 'bg-green-500',
      iconColor: 'text-white',
    },
    {
      title: 'Upcoming Trips',
      value: '23',
      change: '+8% from last month',
      icon: Calendar,
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      title: 'Students Transported',
      value: '456',
      change: '+15% from last month',
      icon: Users,
      bgColor: 'bg-purple-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{item.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                <p className="text-green-600 text-sm mt-1">{item.change}</p>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TotalTopCard;
