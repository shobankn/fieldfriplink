// DashboardStats.jsx
import React, { useEffect, useState } from 'react';
import { Bus, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const DashboardStats = () => {
    let navigation = useNavigate();
      const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/school/stats',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


   const formatChange = (change) => {
    if (change === 0) return '0% from last month';
    return change > 0
      ? `+${change}% from last month`
      : `${change}% from last month`;
  };

  
  // const statCards = [
  //   {
  //     title: 'Total Trips',
  //     value: '156',
  //     change: '+12% from last month',
  //     icon: Bus,
  //     color: 'bg-red-500',
  //   },
  //   {
  //     title: 'Hired Drivers',
  //     value: '24',
  //     change: '+3% from last month',
  //     icon: Users,
  //     color: 'bg-yellow-500',
  //   },
  //   {
  //     title: 'Total Proposals',
  //     value: '300',
  //     change: '+18% from last month',
  //     icon: Users,
  //     color: 'bg-gray-900',
  //   },
  //   {
  //     title: 'Average Rating',
  //     value: '4.8',
  //     change: '+0.2 from last month',
  //     icon: Star,
  //     color: 'bg-orange-500',
  //   },
  // ];


   const statCards = loading
    ? Array(4).fill({
        title: '',
        value: '',
        change: '',
        icon: Skeleton,
        color: '',
      })
    : [
        {
          title: 'Total Trips',
          value: stats.trips.count,
          change: formatChange(stats.trips.change),
          icon: Bus,
          color: 'bg-red-500',
        },
        {
          title: 'Hired Drivers',
          value: stats.hiredDrivers.count,
          change: formatChange(stats.hiredDrivers.change),
          icon: Users,
          color: 'bg-yellow-500',
        },
        {
          title: 'Total Proposals',
          value: stats.proposals.count,
          change: formatChange(stats.proposals.change),
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
                  {loading ? <Skeleton width={100} /> : card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                   {loading ? <Skeleton width={60} /> : card.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {loading ? <Skeleton width={120} /> : card.change}
                  </p>
              </div>
               <div
                className={`w-12 h-12 ${
                  loading ? '' : card.color
                } rounded-lg flex items-center justify-center`}
              >
                {loading ? <Skeleton circle width={32} height={32} /> : <Icon className="w-6 h-6 text-white" />}
              </div>

      

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
