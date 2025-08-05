import React, { useState } from 'react';
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

const DriverRequestsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeTab, setActiveTab] = useState('proposal');

  const [driverRequests] = useState([
    {
      id: 1,
      name: 'Ahmed Hassan',
      rating: 4.8,
      reviews: 156,
      location: 'Karachi, Pakistan',
      jobTitle: 'Job: Daily Pickup Route A',
      jobDetails: 'ABC Town to Sunrise School • 25 students • 30/1/2025',
      completedJobs: 38,
      submittedTime: '2 days ago',
      status: 'Pending',
      proposalMessage: 'I have extensive experience in school transport and understand the importance of safety and punctuality. I have clean driving school routes for over 5 years and have excellent feedback from parents and schools. M...',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Fatima Sheikh',
      rating: 4.7,
      reviews: 89,
      location: 'Lahore, Pakistan',
      jobTitle: 'Job: Weekend Trip to Marine',
      jobDetails: 'School to Marine Mix • 15 students • 30/1/2025',
      completedJobs: 42,
      submittedTime: '1 day ago',
      status: 'Pending',
      proposalMessage: 'As a female driver with extensive mountain driving experience, I understand the unique requirements for school trips to hill stations. I have successfully completed over 50 trips to Murree and northern areas with complete...',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Muhammad Ali',
      rating: 4.7,
      reviews: 134,
      location: 'Islamabad, Pakistan',
      jobTitle: 'Job: School Event Transport',
      jobDetails: 'School to Event Center • 30 students • 28/1/2025',
      completedJobs: 51,
      submittedTime: '3 hours ago',
      status: 'Pending',
      proposalMessage: 'I specialize in event transportation and have handled numerous school events including sports competitions, cultural programs, and educational trips. I ensure safety service and rigid with compliance.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const handleAction = (id, action) => {
    if (action === 'View') {
      const driver = driverRequests.find(d => d.id === id);
      setSelectedDriver(driver);
      setActiveTab('proposal');
    } else {
      console.log(`${action} driver request with ID: ${id}`);
    }
  };

  const closeModal = () => {
    setSelectedDriver(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          
            <h1 className="text-2xl archivo-semibold text-gray-900 mb-1">Driver Requests</h1>
            <p className="text-gray-500 inter-regular text-sm">3 proposals received</p>
  
      
        </div>

          {/* Search and Filter */}
        <div className="flex items-center space-x-3 mb-4">

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search proposals by job title, driver name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <button className="flex  border-red-600 items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4 text-red-500" />
              <span className="text-red-500">Filters</span>
            </button>
          </div>

        {/* Driver Cards */}
        <div className="space-y-4">
          {driverRequests.map((driver) => (
            <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Driver Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
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
                  
                  {/* Driver Info */}
                  <div>
                    <h3 className="text-lg inter-semibold text-gray-900 mb-1">{driver.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="inter-medium">{driver.rating}</span>
                        <span className=' whitespace-nowrap inter-regular'>({driver.reviews} reviews)</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className='whitespace-nowrap inter-regular'>{driver.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
        

                {/* Status and Actions */}
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs inter-medium rounded-full border border-yellow-200">
                    {driver.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleAction(driver.id, 'View')}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-[#84B1F9]" />
                    </button>
                    <button 
                      onClick={() => handleAction(driver.id, 'Message')}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                       <CheckCircle className=" text-[#4ACF7B] w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleAction(driver.id, 'Call')}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <CircleXIcon className=" text-red-600 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-4 p-3 ">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <h4 className="inter-medium text-gray-900">{driver.jobTitle}</h4>
                </div>
                <p className="text-sm inter-regular text-gray-600 ml-6">{driver.jobDetails}</p>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between mb-4 text-sm">
               
                <div>
                  <span className="text-gray-500 inter-regular">Completed Jobs</span>
                  <div className="inter-semibold text-gray-900">{driver.completedJobs}</div>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 inter-regular">Submitted</span>
                  <div className="inter-semibold text-gray-900">{driver.submittedTime}</div>
                </div>
              </div>

              {/* Proposal Message */}
              <div className='bg-[#EEF2FF] rounded-[10px] p-3'>
                <h5 className="inter-medium text-[#374151] mb-2">Proposal Message:</h5>
                <p className="text-gray-600 inter-regular text-sm leading-relaxed">
                  {driver.proposalMessage}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedDriver && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className='flex'>
                    <h1 className=' my-auto text-[20px] inter-semibold mr-4'>Proposal Details</h1>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('proposal')}
                    className={`px-4 py-2 text-sm inter-medium rounded-lg ${
                      activeTab === 'proposal'
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Proposal
                  </button>
                  <button
                    onClick={() => setActiveTab('driver-profile')}
                    className={`px-4 py-2 text-sm inter-medium rounded-lg ${
                      activeTab === 'driver-profile'
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Driver Profile
                  </button>
                </div>

                </div>
              
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto  py:28 2xl:py-8 px-6">
  {activeTab === 'proposal' && (
    <div className="space-y-6  md:grid md:grid-cols-5 md:gap-6">
      {/* Left Column - Job Details & Proposal Message */}
      <div className="space-y-6 md:col-span-3">
        {/* Job Details Section */}
        <div>
          <h3 className="text-lg inter-semibold text-gray-900 mb-4 flex items-center">
           
            <Briefcase className='mr-2 text-[#6B7280]'/>
            Job Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm inter-medium text-gray-500 block mb-1">Job Title:</span>
                <div className="inter-medium text-gray-900">School Event Transport</div>
              </div>
              <div>
                <span className="text-sm inter-medium text-gray-500 block mb-1">Date:</span>
                <div className="inter-medium text-gray-900">25/01/2025</div>
              </div>
              <div>
                <span className="text-sm inter-medium text-gray-500 block mb-1">Pickup Time:</span>
                <div className="inter-medium text-gray-900">09:00 AM</div>
              </div>
              <div>
                <div className=" text-gray-900">School to Event Center</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm  inter-medium text-gray-500 block mb-1">Students:</span>
                <div className="inter-medium text-gray-900">30</div>
              </div>
              <div>
                <span className="text-sm  inter-medium text-gray-500 block mb-1">Return Time:</span>
                <div className="inter-medium text-gray-900">04:00 PM</div>
              </div>
              <div>
                <span className="text-sm  inter-medium text-gray-500 block mb-1">Number of Buses:</span>
                <div className="inter-medium text-gray-900">10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Message Section */}
        <div>
          <h3 className="text-lg inter-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className='mr-2 text-[#6B7280]'/>
            Proposal Message
          </h3>
          <div className="bg-[#F0F2F5] p-4 rounded-lg ">
            <p className="text-gray-700 inter-regular leading-relaxed">
              {selectedDriver.proposalMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Driver Summary */}
      <div className="md:col-span-2 border-l-2 border-[#E5E7EB] p-4 sm:p-6 flex flex-col h-full">
  {/* Header */}
  <h4 className="inter-semibold text-gray-900 mb-4">Driver Summary</h4>

  {/* Main content */}
  <div className="flex items-start space-x-4 mb-4">
    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
      <img 
        src={selectedDriver.avatar} 
        alt={selectedDriver.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1">
      <h5 className="font-semibold text-gray-900 text-lg">{selectedDriver.name}</h5>
      <div className="flex items-center space-x-1 mb-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="inter-medium">{selectedDriver.rating}</span>
        <span className="text-gray-600 inter-regular">({selectedDriver.reviews} reviews)</span>
      </div>
      <div className="text-sm inter-regular text-gray-500">
        Submitted: {selectedDriver.submittedTime}
      </div>
    </div>
  </div>

  {/* Buttons pushed to bottom */}
  <div className="mt-auto flex flex-col  space-y-3  sm:space-x-3">
    <button className=" text-center justify-center flex bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium">
      <Check className='mr-2'/>
      Accept Proposal
    </button>
    <button className="flex justify-center bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium">
      <X className='mr-2'/>
       Reject Proposal
    </button>
  </div>
</div>


    </div>
  )}

  {activeTab === 'driver-profile' && (
    <div className="space-y-6">
      {/* Driver Header */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img 
            src={selectedDriver.avatar} 
            alt={selectedDriver.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl inter-semibold text-gray-900">{selectedDriver.name}</h3>
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="inter-regular text-gray-600">{selectedDriver.location}</span>
          </div>
          <div className="text-sm inter-regular  text-gray-500">📅 Joined June 2021</div>
        </div>
      </div>

      {/* Stats Row */}
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

      {/* Personal Information */}
      <div>
        <h4 className="inter-semibold text-gray-900 mb-4">Driver's Personal Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm inter-regular text-gray-500 block mb-1">Email:</span>
              <div className="inter-medium text-gray-900">driver@gmail.com</div>
            </div>
            <div>
              <span className="text-sm inter-regular text-gray-500 block mb-1">Phone:</span>
              <div className="inter-medium text-gray-900">4 years</div>
            </div>
            <div>
              <span className="text-sm inter-regular text-gray-500 block mb-1">School Partner:</span>
              <div className="inter-medium text-gray-900">AB SCHOOL</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm inter-regular text-gray-500 block mb-1">CNIC:</span>
              <div className="inter-medium text-gray-900">ISB-2020-345678</div>
            </div>
            <div>
              <span className="text-sm inter-regular  text-gray-500 block mb-1">Service Area:</span>
              <div className="font-medium text-gray-900">Lahore</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Driver Button */}
      <div className="pt-4">
        <button className="w-auto bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 inter-medium">
          <MessageCircle className="w-5 h-5" />
          <span>Message Driver</span>
        </button>
      </div>
    </div>
  )}
            </div>
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRequestsComponent;