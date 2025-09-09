import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Trash2, Briefcase, UserPlus, Share2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './InviteDriver/Navbar';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';

const JobProposalsInterface = () => {
  const [activeTab, setActiveTab] = useState('All Job Posts');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';

  const handleNavigate = (id) => {
    navigate(`/job-post/${id}`);
  };

  const tripTypeColors = {
    "onetime": "bg-[#FFF4E5] text-[#F39C12]",
    "recurring": "bg-purple-100 text-purple-800",
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    published: "bg-[#EAF7ED] text-[#28A745]",
    scheduled: "bg-blue-100 text-blue-800",
    active: "bg-[#EBF3FF] text-[#3472F7]",
    inactive: "bg-yellow-100 text-yellow-800",
    completed: "bg-indigo-100 text-indigo-800",
    cancelled: "bg-[#FFF2F2] text-[#E74C3C]"
  };

  // Function to format date to MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const fetchTrips = async (pageNumber = 1) => {
    const toastId = "fetchTripsError";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!toast.isActive(toastId)) {
          toast.error("Token not found. Please log in.", { toastId });
        }
        return;
      }
      setLoading(true);
      const res = await axios.get(
        `${BaseUrl}/school/my-trips?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newTrips = res.data.trips || [];

      // Filter for public and published trips
      const filteredNewTrips = newTrips.filter(trip => trip.visibility === 'public' && trip.tripStatus === 'published');

      const dayMap = {
        mon: 'Monday',
        tue: 'Tuesday',
        wed: 'Wednesday',
        thu: 'Thursday',
        fri: 'Friday',
        sat: 'Saturday',
        sun: 'Sunday'
      };

      const formattedTrips = filteredNewTrips.map(trip => ({
        ...trip,
        postedDate: trip.createdAt ? formatDate(trip.createdAt) : 'N/A',
        formattedDate: trip.tripType === 'recurring' && trip.recurringDays
          ? trip.recurringDays.map(day => dayMap[day.toLowerCase()] || day).join(', ')
          : trip.tripDate ? formatDate(trip.tripDate) : 'N/A'
      }));

      setTrips((prev) => {
        if (pageNumber === 1) {
          return formattedTrips;
        }
        const existingIds = new Set(prev.map((t) => t._id));
        const uniqueTrips = formattedTrips.filter((t) => !existingIds.has(t._id));
        return [...prev, ...uniqueTrips];
      });
      setHasMore(filteredNewTrips.length > 0);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      if (!toast.isActive(toastId)) {
        toast.error(`Failed to fetch trips: ${errorMessage}`, { toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchTrips(page);
  }, [page]);

  const handleDeleteTrip = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to delete this trip.');
      return;
    }
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this trip? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              setLoading(true);
              await axios.delete(`${BaseUrl}/school/trip/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
              toast.success('Trip deleted successfully!');
            } catch (error) {
              console.error('Error deleting trip:', error);
              toast.error('Failed to delete the trip.');
            } finally {
              setLoading(false);
            }
          },
          className: '!bg-red-600 !text-white !hover:bg-red-700',
        },
        {
          label: 'No',
          className: '!bg-red-600 !text-white !inter-bold !hover:bg-red-700',
        },
      ],
    });
  };

  const filteredTrips = trips.filter((trip) =>
    trip.tripName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { label: 'View Job Posts', icon: <Briefcase className="w-4 h-4 mr-2" />, path: '/view-job-posts' },
    { label: 'Invite Drivers', icon: <UserPlus className="w-4 h-4 mr-2" />, path: '/invite-drivers' }
  ];

  return (
    <>
      <div className='ml-5 pt-1'>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 capitalize">your all posted jobs</h1>
      </div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search job postings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                onClick={() => navigate('/post-trip')}
                className="bg-red-600 cursor-pointer hover:bg-red-700 justify-center text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <span className="text-lg">+</span> Post New Job
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <Skeleton height={24} width={200} />
                  <Skeleton count={8} />
                </div>
              ))
            ) : (
              filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                        <div className="flex-1">
                          <div className='flex justify-between'>
                            <h3
                              className="text-lg inter-semibold capitalize text-gray-900 mb-2 line-clamp-1"
                              title={trip.tripName}
                            >
                              {trip.tripName?.length > 50 ? trip.tripName.slice(0, 50) + "..." : trip.tripName}
                            </h3>
                            <div className="hidden lg:flex">
                              <span
                                className={`px-3 py-1 capitalize justify-center items-center text-center content-center rounded-full text-sm inter-medium ${statusColors[trip.tripStatus]}`}
                              >
                                {trip.tripStatus}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span
                              className={`px-3 py-1 capitalize rounded-full text-sm inter-medium ${tripTypeColors[trip.tripType]}`}
                            >
                              {trip.tripType}
                            </span>
                            <span className="text-sm inter-regular text-gray-500">
                              Created {trip.postedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex lg:hidden">
                          <span
                            className={`px-3 py-1 capitalize justify-center items-center text-center content-center rounded-full text-sm inter-medium ${statusColors[trip.tripStatus]}`}
                          >
                            {trip.tripStatus}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 inter-medium block">Schedule:</span>
                          {trip.tripType === 'recurring' ? (
                            <>
                              <span className="text-gray-900 inter-semibold capitalize">
                                Days: {trip.formattedDate}
                              </span>
                              <br />
                            </>
                          ) : (
                            <>
                              <span className="text-gray-900 inter-semibold capitalize">
                                Date: {trip.formattedDate}
                              </span>
                              <br />
                            </>
                          )}
                          <span className="text-[#4B5563] inter-semibold">
                            {new Date(trip.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'UTC',
                            })}
                          </span>
                          <span className="text-[#4B5563] inter-semibold">-</span>
                          <span className="text-[#4B5563] inter-semibold">
                            {new Date(trip.returnTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'UTC',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 inter-regular block">Students:</span>
                          <span className="inter-medium text-gray-900">{trip.numberOfStudents}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 inter-regular block">Proposals:</span>
                          <span className="inter-medium text-gray-900">{trip.proposals?.length || 0}</span>
                        </div>
                        <div className="flex my-auto justify-end gap-2">
                          <Eye
                            onClick={() => handleNavigate(trip._id)}
                            className="cursor-pointer w-5 h-5 text-[#3498DB] transition duration-200 ease-in-out transform hover:scale-125 hover:text-blue-600 active:scale-95 hover:drop-shadow-md"
                          />
                          <Edit
                            onClick={() => {
                              if (trip.tripStatus === 'scheduled') return;
                              navigate(`/post-trip-update/${trip._id}`);
                            }}
                            className={`w-5 h-5 transition duration-200 ease-in-out transform ${
                              trip.tripStatus === 'scheduled'
                                ? 'text-gray-400 cursor-not-allowed opacity-50'
                                : 'text-[#27AE60] cursor-pointer hover:scale-125 hover:text-green-700 active:scale-95 hover:drop-shadow-md'
                            }`}
                          />
                          <Trash2
                            onClick={() => {
                              if (trip.tripStatus === 'completed' || trip.tripStatus === 'active' || trip.tripStatus === 'scheduled') return;
                              handleDeleteTrip(trip._id);
                            }}
                            className={`w-5 h-5 transition duration-200 ease-in-out transform ${
                              trip.tripStatus === 'completed' || trip.tripStatus === 'active' || trip.tripStatus === 'scheduled'
                                ? 'text-gray-400 cursor-not-allowed opacity-50'
                                : 'text-[#E74C3C] cursor-pointer hover:scale-125 hover:text-red-700 active:scale-95 hover:drop-shadow-md'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Job found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
      {loading && (
        <div className="flex justify-center py-6">
          <svg
            className="animate-spin text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="40"
            height="40"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
    </>
  );
};

export default JobProposalsInterface;