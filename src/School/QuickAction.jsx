// QuickActions.jsx
import React from 'react';
import { Plus ,Bus, MapPin, TrendingUp, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
   const navigate = useNavigate();
  const actions = [
    {
      title: 'Post Trip',
      icon: Bus,
      // color: 'bg-[#6B7280]',
      iconColor: 'text-[#6B7280]',
       path: '/post-trip',
    },
    {
      title: 'Track Live',
      icon: MapPin,
      // color: 'bg-green-100',
      iconColor: 'text-[#6B7280]',
       path: '/live-tracking',
    },
    {
      title: 'View Reports',
      icon: TrendingUp,
      // color: 'bg-yellow-100',
      iconColor: 'text-[#6B7280]',
       path: '#',
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      // color: 'bg-purple-100',
       iconColor: 'text-[#6B7280]',
       path: '/messages',
    },
  ];

  return (
    <div className=" pt-6  mb-6">
      <h3 className="text-[20px] archivo-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
          key={index}
          onClick={() => navigate(action.path)}
          className="bg-white cursor-pointer border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center ">
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-8 h-8 ${action.iconColor}`} />
            </div>
            <p className="inter-semibold text-[14px] text-[#6B7280]">{action.title}</p>
          </div>
        </button>

          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
