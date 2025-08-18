import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Plus,
  ChevronDown
} from 'lucide-react';

const PostTripForm = () => {
  const [formData, setFormData] = useState({
    tripName: 'Daily Pickup Route A',
    tripType: 'One-time',
    pickupTime: '',
    returnTime: '',
    tripDate: '',
    recurringDays: [], // Array to store selected days for recurring trips
    pickupAddresses: [''],
    destination: '',
    numberOfStudents: '25',
    busCapacity: '30',
    preferredGender: 'No preference',
    minBudget: '2000',
    maxBudget: '4000',
    extraInstructions: ''
  });

  const [activeTab, setActiveTab] = useState('one-time');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePickupAddressChange = (index, value) => {
    setFormData(prev => {
      const updatedAddresses = [...prev.pickupAddresses];
      updatedAddresses[index] = value;
      return {
        ...prev,
        pickupAddresses: updatedAddresses
      };
    });
  };

  const addPickupAddress = () => {
    setFormData(prev => ({
      ...prev,
      pickupAddresses: [...prev.pickupAddresses, '']
    }));
  };

  const toggleRecurringDay = (day) => {
    setFormData(prev => {
      const days = prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day];
      return {
        ...prev,
        recurringDays: days
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleSaveDraft = () => {
    console.log('Saved as draft:', formData);
  };

  return (
    <div className="min-h-screen ">
      <div className='px-5 py-5'>
            <h1 className="  text-[30px] md:text-3xl archivo-bold text-gray-900">Post New Trip</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Create a new transportation request and find the best drivers.</p>
          </div>
      <div className="max-w-full mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-lg border border-gray-200 m-0 sm:m-4">

          {/* Basic Information Section */}
          <div className=" p-0  sm:p-6   ml-2 mr-2 sm:ml-4 mt-4 ">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trip Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="Enter trip name"
                />
              </div>

              {/* Trip Type */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Type
                </label>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('one-time')}
                    className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'one-time'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recurring')}
                    className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'recurring'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Recurring
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-0  sm:p-6   ml-2 mr-2 sm:ml-4 mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pickup Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:ring-2 focus:red-blue-500 focus:border-red-500 outline-none transition-colors"
                />
              </div>

              {/* Return Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Time (Optional)
                </label>
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                />
              </div>

              {/* Trip Date */}
              <div className='col-span-full lg:col-span-2'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Date
                </label>
                {activeTab === 'one-time' ? (
                  <input
                    type="date"
                    name="tripDate"
                    value={formData.tripDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  />
                ) : (
                  <div className="flex space-x-2">
                    {['M', 'T', 'W', 'Th', 'F', 'S'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleRecurringDay(day)}
                        className={`w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center text-sm font-medium ${
                          formData.recurringDays.includes(day)
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Locations Section */}
          <div className="p-0  sm:p-6   ml-2 mr-2 sm:ml-4 mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
            </div>

            <div className="space-y-6">
              {/* Pickup Addresses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Addresses
                </label>
                {formData.pickupAddresses.map((address, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      name={`pickupAddress-${index}`}
                      value={address}
                      onChange={(e) => handlePickupAddressChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      placeholder="Enter pickup address"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPickupAddress}
                  className="mt-2 text-blue-500 text-sm font-medium hover:text-red-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another Pickup Point
                </button>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="School Campus or Event Venue"
                />
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="p-0  sm:p-6   ml-2 mr-2 sm:ml-4 mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Number of Students */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. of Students
                </label>
                <input
                  type="number"
                  name="numberOfStudents"
                  value={formData.numberOfStudents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="25"
                />
              </div>

              {/* Bus Capacity Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Capacity Required
                </label>
                <input
                  type="number"
                  name="busCapacity"
                  value={formData.busCapacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="30"
                />
              </div>

              {/* Preferred Driver Gender */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Driver Gender
                </label>
                <div className="relative">
                  <select
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="No preference">No preference</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className=" p-0  sm:p-6   ml-2 mr-2 sm:ml-4 mt-4 lg:col-start-2">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Instructions (Optional)
                </label>
                <textarea
                  name="extraInstructions"
                  value={formData.extraInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                  placeholder="e.g. Need female attendant, AC required, etc."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none font-medium transition-colors duration-200"
                >
                  Post Trip
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostTripForm;