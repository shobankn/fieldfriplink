import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';

const DriverProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false);
  const [isVehicleInfoEditing, setIsVehicleInfoEditing] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Ahmed Khan',
    cnic: '12345-1234567-8',
    email: 'ahmedkhan001@gmail.com',
    age: '30',
    city: 'Abbottabad',
    serviceArea: 'Only within Abbottabad',
    drivingExperience: '3 years'
  });

  // Vehicle Information State
  const [vehicleInfo, setVehicleInfo] = useState({
    make: 'Toyota',
    model: 'Prius',
    year: '2020',
    plateNumber: 'KPK 123',
    capacity: '4',
    color: 'White',
    engineNumber: 'ENG123456',
    chassisNumber: 'CHS789012'
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVehicleInfoChange = (field, value) => {
    setVehicleInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePersonalInfo = () => {
    setIsPersonalInfoEditing(false);
    // Here you can add API call to save data
    console.log('Personal Info Saved:', personalInfo);
  };

  const saveVehicleInfo = () => {
    setIsVehicleInfoEditing(false);
    // Here you can add API call to save data
    console.log('Vehicle Info Saved:', vehicleInfo);
  };

  const cancelPersonalEdit = () => {
    setIsPersonalInfoEditing(false);
    // Reset to original values if needed
  };

  const cancelVehicleEdit = () => {
    setIsVehicleInfoEditing(false);
    // Reset to original values if needed
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[20%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar drawer for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div
            className="absolute left-0 top-0 h-full w-[75%] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[80%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Driver Profile</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your personal and vehicle information</p>
            </div>

            {/* Profile Photo Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Profile Photo</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{personalInfo.fullName}</p>
                  <p className="text-sm text-gray-600">Driver ID: #789</p>
                  <button className="mt-2 px-4 py-1 bg-yellow-400 text-white text-sm rounded hover:bg-yellow-500 transition-colors">
                    Upload New Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Personal Information</h2>
                {!isPersonalInfoEditing ? (
                  <button 
                    onClick={() => setIsPersonalInfoEditing(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={savePersonalInfo}
                      className="px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelPersonalEdit}
                      className="px-4 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CNIC</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="text"
                      value={personalInfo.cnic}
                      onChange={(e) => handlePersonalInfoChange('cnic', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.cnic}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Age</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="number"
                      value={personalInfo.age}
                      onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="text"
                      value={personalInfo.city}
                      onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Service Area</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="text"
                      value={personalInfo.serviceArea}
                      onChange={(e) => handlePersonalInfoChange('serviceArea', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.serviceArea}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Driving Experience</label>
                  {isPersonalInfoEditing ? (
                    <input
                      type="text"
                      value={personalInfo.drivingExperience}
                      onChange={(e) => handlePersonalInfoChange('drivingExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{personalInfo.drivingExperience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Vehicle Information</h2>
                {!isVehicleInfoEditing ? (
                  <button 
                    onClick={() => setIsVehicleInfoEditing(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={saveVehicleInfo}
                      className="px-4 py-1 bg-yellow-400 text-white text-sm rounded hover:bg-yellow-500 transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelVehicleEdit}
                      className="px-4 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Make</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.make}
                      onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.make}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Model</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.model}
                      onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="number"
                      value={vehicleInfo.year}
                      onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Plate Number</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.plateNumber}
                      onChange={(e) => handleVehicleInfoChange('plateNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.plateNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Capacity (Headcount)</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="number"
                      value={vehicleInfo.capacity}
                      onChange={(e) => handleVehicleInfoChange('capacity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Color</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.color}
                      onChange={(e) => handleVehicleInfoChange('color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.color}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Engine Number</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.engineNumber}
                      onChange={(e) => handleVehicleInfoChange('engineNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.engineNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Chassis Number</label>
                  {isVehicleInfoEditing ? (
                    <input
                      type="text"
                      value={vehicleInfo.chassisNumber}
                      onChange={(e) => handleVehicleInfoChange('chassisNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{vehicleInfo.chassisNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverProfile;