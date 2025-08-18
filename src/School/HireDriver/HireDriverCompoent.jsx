import React, { useState } from 'react';
import { Search, Filter, Download, MapPin, Calendar, Mail, Phone, Eye, Clock, CheckCircle, AlertTriangle, Cross, X, CircleXIcon } from 'lucide-react';
import profile from '../../images/profile/profile4.jpeg';
import { useNavigate } from 'react-router-dom';


const DriverVerificationInterface = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  // Dynamic verification data
  const verificationData = [
    {
      id: 1,
      name: "Ahmed Hassan",
      profileImage: profile,
      email: "ahmed.hassan@email.com",
      phone: "+92 300 1234567",
      cnic: "42101-1234567-8",
      experience: "5 years",
      address: "House #12, Block C, ABC Town, Karachi",
      submittedDate: "Submitted 2 days ago",
      status: "Pending"
    },
    {
      id: 2,
      name: "Muhammad Ali",
      profileImage:profile,
      email: "muhammad.ali@email.com",
      phone: "+92 302 3456789",
      cnic: "61101-3456789-0",
      experience: "4 years",
      address: "Street 15, F-8 Sector, Islamabad",
      submittedDate: "Submitted 3 hours ago",
      status: "Pending"
    },
    {
      id: 3,
      name: "Sara Khan",
      profileImage:profile,
      email: "sara.khan@email.com",
      phone: "+92 321 9876543",
      cnic: "35202-9876543-2",
      experience: "7 years",
      address: "Model Town, Block B, Lahore",
      submittedDate: "Verified 1 week ago",
      status: "Verified"
    },
    {
      id: 4,
      name: "Hassan Ahmed",
      profileImage: profile,
      email: "hassan.ahmed@email.com",
      phone: "+92 333 5554444",
      cnic: "42101-5554444-6",
      experience: "3 years",
      address: "Gulshan-e-Iqbal, Karachi",
      submittedDate: "Suspended 3 days ago",
      status: "Suspended"
    }
  ];

  const getTabCount = (status) => {
    return verificationData.filter(driver => driver.status === status).length;
  };

  const getFilteredData = () => {
    return verificationData.filter(driver => {
      const matchesTab = driver.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.cnic.includes(searchTerm) ||
        driver.phone.includes(searchTerm);
      return matchesTab && matchesSearch;
    });
  };

  const handleStatusChange = (driverId, newStatus) => {
    // This would typically update the data in your state management solution
    console.log(`Driver ${driverId} status changed to: ${newStatus}`);
  };

  const StatusToggle = ({ driver }) => {
    const [currentStatus, setCurrentStatus] = useState(driver.status);

    const handleToggle = (status) => {
      setCurrentStatus(status);
      handleStatusChange(driver.id, status);
    };

    return (
      <div className="flex items-center gap-2">
        {/* Pending Button */}
        {/* <button
          onClick={() => handleToggle('Pending')}
          className={`p-2 rounded-lg transition-colors ${
            currentStatus === 'Pending'
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Mark as Pending"
        >
          <Clock className="w-4 h-4" />
        </button> */}

        {/* View Button */}
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <Eye className="w-4 h-4 text-[#84B1F9]" />
        </button>

        {/* Verified Button */}
        <button
          onClick={() => handleToggle('Verified')}
          className={`p-2 rounded-lg transition-colors ${
            currentStatus === 'Verified'
              ? 'bg-green-100 text-green-600'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Mark as Verified"
        >
          <CheckCircle className=" text-[#4ACF7B] w-4 h-4" />
        </button>

        {/* Suspended Button */}
        <button
          onClick={() => handleToggle('Suspended')}
          className={`p-2 rounded-lg transition-colors ${
            currentStatus === 'Suspended'
              ? 'bg-red-100 text-red-600'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Mark as Suspended"
        >
          <CircleXIcon className=" text-red-600 w-4 h-4" />
        </button>
      </div>
        
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Driver Verification</h1>
          <button className=" text-center  justify-center flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
        </div>

        {/* Drivers List */}
       <div className="space-y-4">
  {getFilteredData().map((driver) => (
    <div
      key={driver.id}
      onClick={() => navigate(`/hire-driver/${driver.id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Driver Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-4 flex-1 text-center sm:text-left">
          {/* Profile Picture */}
          <div className="flex justify-center sm:justify-start">
            <img
              src={driver.profileImage}
              alt={driver.name}
              className="w-14 h-14 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            />
          </div>

          {/* Driver Details */}
          <div className="flex-1 min-w-0">
            {/* Name + Status */}
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
                  <StatusToggle driver={driver} />
                </div>
              </div>

              {/* Status Toggle - Mobile */}
              <div className="flex sm:hidden justify-center">
                <StatusToggle driver={driver} />
              </div>
            </div>

            {/* Contact Info */}
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

            {/* Details Grid */}
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

            {/* Address and Submitted Date */}
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
  ))}
</div>


        {/* Empty State */}
        {getFilteredData().length === 0 && (
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