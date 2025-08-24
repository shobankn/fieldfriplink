import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Eye, 
  MessageCircle, 
  Phone,
  User,
  Star,
  MapPin,
  Calendar,
  Users,
  X,
  Filter,
  CircleXIcon,
  CheckCircle,
  Briefcase,
  Check
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import ProposalActions from './ProposalAction';
import ProposalIconActions from './ProposalIconAction';
import { useNavigate } from 'react-router-dom';

const DriverRequestsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeTab, setActiveTab] = useState('proposal');
  const [driverRequests, setDriverRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [driverDetailsLoading, setDriverDetailsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('applied'); // default applied
  const [showFilterDropdown, setShowFilterDropdown] = useState(false); // for filter dropdown

  let navigate = useNavigate();

  function formatExactDate(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const pad = (n) => (n < 10 ? '0' + n : n);

    return `${pad(day)}/${pad(month)}/${year}`;
  }

  function formatExactUTCTime(isoString) {
    const date = new Date(isoString);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const pad = (n) => (n < 10 ? '0' + n : n);

    return `${hours}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  }

  const handleProposalUpdate = (proposalId) => {
    setDriverRequests(prev => prev.filter(driver => driver.id !== proposalId));
    setSelectedDriver(null);
    toast.info('Proposal removed from the list');
  };

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/school/my-trips/proposals',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const proposals = response.data.proposals.map(proposal => {
          const trip = proposal.tripId;

          const displayDateOrDays =
            trip.tripType === 'recurring'
              ? trip.recurringDays.join(', ')
              : formatExactDate(trip.tripDate);

          return {
            id: proposal._id,
            driverId: proposal.driverId._id,
            name: proposal.driverId.name,
            rating: proposal.driverId.averageRating || 0,
            reviews: proposal.driverId.reviewCount || 0,
            location: proposal.driverId.address || 'unknown',
            jobTitle: `Job: ${trip.tripName}`,
            jobDetails: `${trip.pickupPoints[0].address} to ${trip.destination.address} • ${trip.numberOfStudents} students • ${displayDateOrDays}`,
            route: `${trip.pickupPoints[0].address} to ${trip.destination.address}`,
            completedJobs: proposal.driverId.completedTrips || 0,
            submittedTime: formatDistanceToNow(new Date(proposal.submittedAt), { addSuffix: true }),
            status: proposal.status,
            proposalMessage: proposal.driverNote,
            avatar:
              proposal.driverId.profileImage ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            phone: proposal.driverId.phone,
            tripDate: displayDateOrDays,
            startTime: formatExactUTCTime(trip.startTime),
            returnTime: formatExactUTCTime(trip.returnTime),
            numberOfBuses: trip.numberOfBuses,
            numberOfStudents: trip.numberOfStudents,
          };
        });

        setDriverRequests(proposals);
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? 'Unauthorized: Invalid or expired token'
            : 'Failed to fetch proposals';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  useEffect(() => {
    if (activeTab === 'driver-profile' && selectedDriver) {
      const fetchDriverDetails = async () => {
        setDriverDetailsLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await axios.get(`https://fieldtriplinkbackend-production.up.railway.app/api/school/driver/${selectedDriver.driverId}/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDriverDetails(response.data);
        } catch (err) {
          const errorMessage = err.response?.status === 401 ? 'Unauthorized: Invalid or expired token' : 'Failed to fetch driver details';
        } finally {
          setDriverDetailsLoading(false);
        }
      };

      fetchDriverDetails();
    }
  }, [activeTab, selectedDriver]);

  const handleAction = (id, action) => {
    if (action === 'View') {
      const driver = driverRequests.find(d => d.id === id);
      setSelectedDriver(driver);
      setActiveTab('proposal');
      setDriverDetails(null);
    } else if (action === 'Accept') {
      toast.success(`Accepted proposal for driver ID: ${id}`);
    } else if (action === 'Reject') {
      toast.error(`Rejected proposal for driver ID: ${id}`);
    } else {
      toast.info(`${action} driver request with ID: ${id}`);
    }
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setDriverDetails(null);
  };

  const filteredRequests = driverRequests.filter(driver => 
    (statusFilter === 'all' || driver.status === statusFilter) &&
    (driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
    <ToastContainer/>
    <div className="bg-gray-50 min-h-screen p-4 sm:px-6 py-2 w-full max-w-full overflow-x-hidden">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-1">Driver Requests</h1>
            <p className="text-gray-500 inter-regular text-sm">{filteredRequests.length} proposals received</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals by job title, driver name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm break-words"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="justify-center cursor-pointer inter-bold flex items-center space-x-2 px-4 py-2 border border-red-600 rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 text-red-500" />
              <span className="text-red-500">Filter</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {['applied', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm inter-medium capitalize ${
                        statusFilter === status 
                          ? 'bg-red-50 text-red-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } rounded-md flex items-center justify-between`}
                    >
                      <span>{status}</span>
                      {statusFilter === status && <Check className="w-4 h-4 text-red-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Driver Cards */}
        <div className="space-y-4 w-full max-w-full">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 w-full max-w-full">
                <Skeleton height={100} />
                <Skeleton count={3} />
              </div>
            ))
          ) : error ? (
            <div className="text-red-500 inter-regular text-center">{error}</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-gray-500 inter-regular text-center">No proposals found</div>
          ) : (
            filteredRequests.map((driver) => (
              <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 w-full max-w-full">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 w-full">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img 
                        src={driver.avatar} 
                        alt={driver.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm" style={{display: 'none'}}>
                        <User className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg inter-semibold text-gray-900 mb-1 break-words">{driver.name}</h3>
                      <div className="flex flex-wrap items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="inter-medium">{driver.rating}</span>
                          <span className="whitespace-nowrap inter-regular">({driver.reviews} reviews)</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="whitespace-nowrap inter-regular break-words">{driver.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <span className={`px-3 py-1 text-xs inter-medium rounded-full border ${
                      driver.status === 'applied' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      driver.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {driver.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleAction(driver.id, 'View')}
                        className="group p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        <Eye className="w-4 h-4 text-[#84B1F9] group-hover:text-blue-600 transition-colors duration-200" />
                      </button>
                      <ProposalIconActions
                        proposalId={driver.id}
                     disabled={driver.status === "accepted" || driver.status === "rejected"}

                        onActionComplete={(id, status) => {
                          console.log(`Proposal ${id} was ${status}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <h4 className="inter-medium text-gray-900 break-words">{driver.jobTitle}</h4>
                  </div>
                  <p className="text-sm inter-regular text-gray-600 ml-6 break-words">{driver.jobDetails}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 inter-regular">Completed Jobs</span>
                    <div className="inter-semibold text-gray-900">{driver.completedJobs}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 inter-regular">Submitted</span>
                    <div className="inter-semibold text-gray-900">{driver.submittedTime}</div>
                  </div>
                </div>
                <div className="bg-[#EEF2FF] rounded-[10px] p-3">
                  <h5 className="inter-medium text-[#374151] mb-2">Proposal Message:</h5>
                  <p className="text-gray-600 inter-regular text-sm leading-relaxed break-words">
                    {driver.proposalMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {selectedDriver && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row w-full">
                  <h1 className="my-auto text-[20px] inter-semibold mr-4">Proposal Details</h1>
                  <div className="flex space-x-1 flex-wrap">
                    <button
                      onClick={() => setActiveTab('proposal')}
                      className={`px-4 py-2 text-sm inter-medium rounded-lg ${
                        activeTab === 'proposal' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Proposal
                    </button>
                    <button
                      onClick={() => setActiveTab('driver-profile')}
                      className={`px-4 py-2 text-sm inter-medium rounded-lg ${
                        activeTab === 'driver-profile' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Driver Profile
                    </button>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-x-hidden w-full">
                {activeTab === 'proposal' && (
                  <div className="space-y-6 flex flex-col md:grid md:grid-cols-5 md:gap-6 w-full">
                    <div className="space-y-6 md:col-span-3 w-full">
                      <div>
                        <h3 className="text-lg inter-semibold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="mr-2 text-[#6B7280]" />
                          Job Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                          <div className="space-y-4">
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Job Title:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.jobTitle}</div>
                            </div>
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Date:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.tripDate}</div>
                            </div>
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Pickup Time:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.startTime}</div>
                            </div>
                            <div>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.route}</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Students:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.numberOfStudents}</div>
                            </div>
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Return Time:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.returnTime}</div>
                            </div>
                            <div>
                              <span className="text-sm inter-medium text-gray-500 block mb-1">Number of Buses:</span>
                              <div className="inter-medium text-gray-900 break-words">{selectedDriver.numberOfBuses}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg inter-semibold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="mr-2 text-[#6B7280]" />
                          Proposal Message
                        </h3>
                        <div className="bg-[#F0F2F5] p-4 rounded-lg w-full">
                          <p className="text-gray-700 inter-regular leading-relaxed break-words">
                            {selectedDriver.proposalMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 border-l-2 border-[#E5E7EB] p-4 sm:p-6 flex flex-col h-full md:border-l-2 w-full">
                      <h4 className="inter-semibold text-gray-900 mb-4">Driver Summary</h4>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img 
                            src={selectedDriver.avatar} 
                            alt={selectedDriver.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-lg break-words">{selectedDriver.name}</h5>
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="inter-medium">{selectedDriver.rating}</span>
                            <span className="text-gray-600 inter-regular">({selectedDriver.reviews} reviews)</span>
                          </div>
                          <div className="text-sm inter-regular text-gray-500 break-words">
                            Submitted: {selectedDriver.submittedTime}
                          </div>
                        </div>
                      </div>
                      <ProposalActions proposalId={selectedDriver.id} onProposalUpdate={handleProposalUpdate}  disabled={selectedDriver.status === "accepted" || selectedDriver.status === "rejected"}  />
                    </div>
                  </div>
                )}
                {activeTab === 'driver-profile' && (
                  <div className="space-y-6 w-full">
                    {driverDetailsLoading ? (
                      <Skeleton height={200} count={2} />
                    ) : driverDetails ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <img 
                              src={driverDetails.user.profileImage || selectedDriver.avatar} 
                              alt={driverDetails.user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl inter-semibold text-gray-900 break-words">{driverDetails.user.name}</h3>
                            <div className="flex items-center space-x-1 mb-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="inter-regular text-gray-600 break-words">{driverDetails.profile.address}</span>
                            </div>
                            <div className="text-sm inter-regular text-gray-500">
                              📅 Joined {new Date(driverDetails.profile.joinedDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-4 border-b border-gray-200">
                          <div>
                            <span className="text-sm inter-regular text-gray-500 block mb-1">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="inter-semibold text-lg">{selectedDriver.rating}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm inter-regular text-gray-500 block mb-1">Completed Jobs:</span>
                            <div className="inter-semibold text-lg text-gray-900">{selectedDriver.completedJobs}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="inter-semibold text-gray-900 mb-4">Driver's Personal Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm inter-regular text-gray-500 block mb-1">Email:</span>
                                <div className="inter-medium text-gray-900 break-words">{driverDetails.user.email}</div>
                              </div>
                              <div>
                                <span className="text-sm inter-regular text-gray-500 block mb-1">Phone:</span>
                                <div className="inter-medium text-gray-900 break-words">{driverDetails.user.phone}</div>
                              </div>
                              <div>
                                <span className="text-sm inter-regular text-gray-500 block mb-1">School Partner:</span>
                                <div className="inter-medium text-gray-900 break-words">{driverDetails.schoolDriver ? driverDetails.schoolDriver.name : 'N/A'}</div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm inter-regular text-gray-500 block mb-1">CNIC:</span>
                                <div className="inter-medium text-gray-900 break-words">{driverDetails.profile.cnicNumber}</div>
                              </div>
                              <div>
                                <span className="text-sm inter-regular text-gray-500 block mb-1">Service Area:</span>
                                <div className="inter-medium text-gray-900 break-words">{driverDetails.profile.address}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <button
                            onClick={() => {
                              navigate("/messages", {
                                state: {
                                  creatorId: selectedDriver?.driverId,
                                  creatorPic: selectedDriver?.avatar,
                                },
                              });
                            }}
                            className="w-full sm:w-auto bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 inter-medium"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>Message Driver</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-red-500 inter-regular text-center">Failed to load driver details</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default DriverRequestsComponent;