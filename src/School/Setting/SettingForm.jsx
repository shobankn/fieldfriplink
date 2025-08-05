import React, { useState } from 'react';
import { Camera, Upload, MapPin, Phone, Mail, Globe, Building2, Save } from 'lucide-react';
import { FaSchool } from 'react-icons/fa'; // School icon from react-icons

const SchoolSettingsForm = () => {
  const [formData, setFormData] = useState({
    schoolName: 'Green Valley School',
    schoolType: 'Private',
    city: 'Karachi',
    completeAddress: 'Block 15, Gulshan-e-Iqbal, Karachi',
    phoneNumber: '+92 21 1234567',
    emailAddress: 'admin@greenvalley.edu.pk',
    website: 'www.greenvalley.edu.pk',
    schoolLogo: null
  });

  const [activeTab] = useState('School Information');
  const [logoPreview, setLogoPreview] = useState(null);

  const schoolTypes = [
    'Private',
    'Public',
    'Charter',
    'International',
    'Religious',
    'Montessori'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          schoolLogo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    alert('Changes saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl archivo-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 text-sm inter-medium sm:text-base">
            Manage your school profile, users, and system preferences.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button className="border-b-2 border-red-500 text-red-600 py-2 px-1 text-sm inter-medium whitespace-nowrap flex items-center space-x-2">
                <FaSchool className="w-4 h-4" />
                <span>School Information</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl inter-semibold text-gray-900 mb-4 sm:mb-0">School Information</h2>
            <button
              onClick={handleSaveChanges}
              className="bg-red-500 hidden sm:flex hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span className='inter-medium'>Save Changes</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* School Logo */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-3">
                    School Logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="School Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span className="text-sm inter-medium text-gray-700">Change Logo</span>
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs inter-regular text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className=" outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter school name"
                  />
                </div>

                {/* School Type */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    School Type
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => handleInputChange('schoolType', e.target.value)}
                    className=" outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  >
                    {schoolTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter city"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Complete Address */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <textarea
                    value={formData.completeAddress}
                    onChange={(e) => handleInputChange('completeAddress', e.target.value)}
                    rows={3}
                    className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                    placeholder="Enter complete address"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className=" outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      className="outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Website <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="mt-8 sm:hidden">
              <button
                onClick={handleSaveChanges}
                className="outline-none w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg inter-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span className='inter-medium'>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettingsForm;
