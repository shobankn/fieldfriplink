import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, Phone, MapPin, Calendar, Search, Eye, User } from 'lucide-react';
import Navbar from '../InviteDriver/Navbar';

const AllHairDriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Approved');
  const navigate = useNavigate();
  const baseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${baseUrl}/school/drivers?myDriversOnly=true&status=approved`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDrivers(data.drivers || []);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const getFilteredData = () => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm)
    );
  };

  return (
    <>
      <h1 className="text-2xl ml-5 sm:text-3xl archivo-bold text-gray-900 mb-6">
        My Hired Drivers
      </h1>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search drivers..."
          className="w-full mb-6 p-3 border border-gray-300 outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
        />

        <div className="grid gap-6">
          {loading ? (
            // Skeleton Loader
            <div className="space-y-6">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 animate-pulse"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-4 flex-1 text-center sm:text-left">
                      <div className="flex justify-center sm:justify-start">
                        <div className="w-14 h-14 md:w-14 md:h-14 rounded-full bg-gray-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2 inter-semibold text-gray-900" />
                          </div>
                          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                            <div className="h-6 bg-gray-200 rounded-full w-24 inter-medium text-green-800" />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm justify-center items-center sm:justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-40 inter-regular text-gray-600" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-24 inter-regular text-gray-600" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-16 mb-1 inter-regular text-gray-500" />
                            <div className="h-4 bg-gray-200 rounded w-32 inter-semibold text-gray-900" />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 text-sm justify-center items-center sm:justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-20 inter-regular text-gray-600" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-24 inter-regular text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            getFilteredData().map(driver => (
              <div
                key={driver._id}
                onClick={() => navigate(`/hired-driver/${driver._id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                 
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-4 flex-1 text-center sm:text-left">
                    

<div className="flex justify-center sm:justify-start">
  {driver.profileImage ? (
    <img
      src={driver.profileImage}
      alt={driver.name}
      className="w-14 h-14 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
    />
  ) : (
    <div className="w-14 h-14 md:w-14 md:h-14 rounded-full bg-red-500 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
      <User className="text-white w-7 h-7" />
    </div>
  )}
</div>



                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg inter-semibold text-gray-900">{driver.name}</h3>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                          <span
                            className={`flex items-center px-3 py-1 rounded-full text-sm inter-medium ${
                              driver.driverStatus === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : driver.driverStatus === 'pending'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <Clock className="w-3 h-3 mr-1" /> {driver.driverStatus.charAt(0).toUpperCase() + driver.driverStatus.slice(1)}
                          </span>
                         <div
                                className="hidden sm:flex flex-shrink-0 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // ✅ Prevent parent click
                                    navigate(`/hired-driver/${driver._id}`);
                                }}
                                >
                                <Eye
                                    className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                />
                                </div>

                        </div>
                        <div className="flex sm:hidden justify-center">
                          {/* <StatusToggle driver={driver} updateDriverStatus={updateDriverStatus} /> */}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm justify-center items-center sm:justify-start text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="inter-regular">{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="inter-regular">{driver.phone}</span>
                        </div>
                      </div>

                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500 inter-regular block">CNIC:</span>
                          <span className="inter-semibold text-gray-900">{driver.cnicNumber}</span>
                        </div>
                      </div> */}


                      <div className="flex flex-col sm:flex-row gap-4 text-sm justify-center items-center sm:justify-start">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="inter-regular">{driver.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="inter-regular">
                            {new Date(driver.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

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
    </>
  );
};

export default AllHairDriverList;