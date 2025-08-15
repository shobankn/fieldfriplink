// DashboardStats.jsx
import React from 'react';
import { Bus, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardStats = () => {
    let navigation = useNavigate();
  const statCards = [
    {
      title: 'Total Trips',
      value: '156',
      change: '+12% from last month',
      icon: Bus,
      color: 'bg-red-500',
    },
    {
      title: 'Hired Drivers',
      value: '24',
      change: '+3% from last month',
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Students',
      value: '300',
      change: '+18% from last month',
      icon: Users,
      color: 'bg-gray-900',
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2 from last month',
      icon: Star,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white cursor-pointer rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{card.change}</p>
              </div>
              <div
                className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
