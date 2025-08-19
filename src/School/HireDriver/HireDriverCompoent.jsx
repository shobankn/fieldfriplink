import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MapPin, Calendar, Mail, Phone, Eye, Clock, CheckCircle, AlertTriangle, XCircle, CircleCheck } from 'lucide-react';
import profile from '../../images/profile/profile4.jpeg';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

const DriverVerificationInterface = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api'

  // Map backend driverStatus to frontend status
  const statusMap = {
    pending_approval: 'Pending',
    approved: 'Verified',
    suspended: 'Suspended'
  };

  // Fetch driver data from backend
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        setLoading(false);
        navigate('/login'); // Redirect to login page
        return;
      }

      try {
        const response = await axios.get(`${BaseUrl}/school/drivers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform backend data to match frontend structure
        const transformedData = response.data.drivers.map(driver => ({
          id: driver._id,
          name: driver.name,
          profileImage: driver.profileImage || profile, // Fallback to default profile image
          email: driver.email,
          phone: driver.phone,
          cnic: driver.cnicNumber || 'N/A', // Fallback if CNIC not provided
          experience: driver.experience || 'N/A', // Fallback if experience not provided
          address: driver.address,
          submittedDate: driver.createdAt
          ? `Submitted ${Math.floor((new Date() - new Date(driver.createdAt)) / (1000 * 60 * 60 * 24))} days ago`
          : 'N/A',

          status: statusMap[driver.driverStatus] || 'Pending' // Map backend status to frontend
        }));

        setDrivers(transformedData);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to fetch driver data. Please try again.');
        setDrivers([]); // Set empty array to trigger empty state
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [navigate]);

  const getTabCount = (status) => {
    return drivers.filter(driver => driver.status === status).length;
  };

  const getFilteredData = () => {
    return drivers.filter(driver => {
      const matchesTab = driver.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.cnic.includes(searchTerm) ||
        driver.phone.includes(searchTerm);
      return matchesTab && matchesSearch;
    });
  };



  const StatusToggle = ({ driver, updateDriverStatus }) => {
    const [currentStatus, setCurrentStatus] = useState(driver.status);


      useEffect(() => {
      setCurrentStatus(driver.status);
    }, [driver.status]);


    
const handleStatusChangeApi = async (status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    const res = await axios.patch(
      `${BaseUrl}/school/driver/${driver.id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      if (status === "approved") {
        toast.success("Driver accepted successfully.");
      } else if (status === "rejected") {
        toast.success("Driver rejected successfully.");
      } else if (status === "suspended") {
        toast.success("Driver suspended successfully.");
      }
         setCurrentStatus(statusMap[status] || status); // Map API value to UI status name if needed
          updateDriverStatus(driver.id, statusMap[status] || status);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to update status.");
  }
};


    return (
      <div className="flex items-center gap-2">
        {/* Pending: 3 buttons */}
        {currentStatus === 'Pending' && (
          <>
            <button
             onClick={(e) => {
                e.stopPropagation(); // prevent triggering parent's onClick
                navigate(`/hire-driver/${driver.id}`);
              }}
              
              className={`p-2 cursor-pointer rounded-lg transition-color`}
              title="Mark as Pending"
            >
              <Eye className="text-[#6B7280] w-4 h-4" />
            </button>
            <button
              // onClick={() => handleToggle('Pending')}
               onClick={(e) => {
                 e.stopPropagation();
                handleStatusChangeApi("approved")
              }}
              className={`p-2 cursor-pointer rounded-lg transition-colors `}
              title="Mark as Pending"
            >
              <CircleCheck className="text-[#10B981] w-4 h-4" />
            </button>
            <button
              // onClick={() => handleToggle('Pending')}
               onClick={(e) => {
                 e.stopPropagation();
                handleStatusChangeApi("suspended")
              }}
              className={`p-2 cursor-pointer rounded-lg transition-colors `}
              title="Mark as Pending"
            >
              <XCircle className="text-[#EF4444] w-4 h-4" />
            </button>
          </>
        )}

        {/* Verified: 2 buttons */}
        {currentStatus === 'Verified' && (
          <>
            <button
             onClick={(e) => {
                e.stopPropagation(); // prevent triggering parent's onClick
                navigate(`/hire-driver/${driver.id}`);
              }}
              className={`p-2 cursor-pointer rounded-lg transition-colors `}
              title="Mark as Verified"
            >
              <Eye className="text-[#3B82F6] w-4 h-4" />
            </button>

            <button
               onClick={(e) => {
                 e.stopPropagation();
                handleStatusChangeApi("suspended")
              }}
              className={`p-2 cursor-pointer rounded-lg transition-colors `}
              title="Mark as Verified"
            >
              <AlertTriangle className="text-[#F0AD4E] w-4 h-4" />
            </button>
          </>
        )}

        {/* Suspended: 1 button */}
        {currentStatus === 'Suspended' && (
          <button
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering parent's onClick
                navigate(`/hire-driver/${driver.id}`);
              }}
            className={`p-2 cursor-pointer rounded-lg transition-colors bg-[#F0F2F5]`}
            title="Mark as Suspended"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const updateDriverStatus = (driverId, newStatus) => {
  setDrivers((prevDrivers) =>
    prevDrivers.map((driver) =>
      driver.id === driverId ? { ...driver, status: newStatus } : driver
    )
  );
};



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:px-6 md:py-2">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl inter-bold text-gray-900">Driver Verification</h1>
       
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm  max-w-full">
          {['Pending', 'Verified', 'Suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? tab === 'Pending' ? ' text-[#B00000] border-b-3 ' :
                    tab === 'Verified' ? 'text-[#B00000] border-b-3' :
                    'text-[#B00000] border-b-3'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab === 'Pending' && <Clock className="w-4 h-4 " />}
              {tab === 'Verified' && <CheckCircle className="w-4 h-4" />}
              {tab === 'Suspended' && <AlertTriangle className="w-4 h-4" />}
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === tab
                  ? 'bg-[#B00000] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search drivers by name, CNIC, or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button className=" justify-center flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div> */}

        {/* Drivers List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-4 flex-1">
                    <div className="flex justify-center sm:justify-start">
                      <Skeleton circle width={56} height={56} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <Skeleton width={150} height={20} />
                        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                          <Skeleton width={100} height={24} />
                          <Skeleton width={100} height={24} />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm justify-center items-center sm:justify-start">
                        <Skeleton width={200} height={16} />
                        <Skeleton width={150} height={16} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                        <Skeleton width={100} height={16} count={2} />
                        <Skeleton width={100} height={16} count={2} />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm justify-center items-center sm:justify-start">
                        <Skeleton width={200} height={16} />
                        <Skeleton width={150} height={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            getFilteredData().map((driver) => (
              <div
                key={driver.id}
                onClick={() => navigate(`/hire-driver/${driver.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-4 flex-1 text-center sm:text-left">
                    <div className="flex justify-center sm:justify-start">
                      <img
                        src={driver.profileImage}
                        alt={driver.name}
                        className="w-14 h-14 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg inter-semibold text-gray-900">{driver.name}</h3>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                          <span
                            className={`flex items-center px-3 py-1 rounded-full text-sm inter-medium ${
                              driver.status === 'Pending'
                                ? 'bg-orange-100 text-orange-800'
                                : driver.status === 'Verified'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <Clock className="w-3 h-3 mr-1" /> {driver.status}
                          </span>
                          <div className="hidden sm:flex flex-shrink-0">
                          <StatusToggle driver={driver} updateDriverStatus={updateDriverStatus} />

                          </div>
                        </div>
                        <div className="flex sm:hidden justify-center">
                         <StatusToggle driver={driver} updateDriverStatus={updateDriverStatus} />

                          
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm justify-center items-center sm:justify-start text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className='inter-regular'>{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className='inter-regular'>{driver.phone}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500 inter-regular block">CNIC:</span>
                          <span className="inter-semibold text-gray-900">{driver.cnic}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 inter-regular block">Experience:</span>
                          <span className="inter-semibold text-gray-900">{driver.experience}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm justify-center items-center sm:justify-start">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className='inter-regular'>{driver.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className='inter-regular'>{driver.submittedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && getFilteredData().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500 mb-4">
              No drivers match your current search criteria in the {activeTab.toLowerCase()} status.
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverVerificationInterface;