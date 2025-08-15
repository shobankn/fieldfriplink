import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Camera, Upload, MapPin, Phone, Mail, Globe, Building2, Save, Edit2 } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AnimatePresence, motion } from "framer-motion";

const SchoolSettingsForm = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: '',
    city: '',
    completeAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    schoolLogo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab] = useState('School Information');

  const schoolTypes = [
    'Private',
    'Public',
    'Charter',
    'International',
    'Religious',
    'Montessori',
  ];

  // Capitalize first letter for school type
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/school/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Profile Response:', res.data);

        const { user, school } = res.data;
        setFormData({
          schoolName: school.schoolName || '',
          schoolType: capitalizeFirstLetter(school.type) || '',
          city: school.address?.city || '',
          completeAddress: school.address?.fullAddress || '',
          phoneNumber: school.phoneNumber || '',
          emailAddress: user.email || '',
          website: school.websiteLink || '',
          schoolLogo: school.logo || null,
        });

        if (school.logo) {
          setLogoPreview(school.logo); // Assuming logo is a URL or base64 string
        }
      } catch (err) {
        console.error('Error fetching profile:', err.response || err.message);
        toast.error(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    if (isEditing) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLogoChange = (event) => {
    if (isEditing) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target.result);
          setFormData((prev) => ({
            ...prev,
            schoolLogo: file, // Store the file object for upload
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        setSaving(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('schoolName', formData.schoolName);
      formDataToSend.append('type', formData.schoolType.toLowerCase());
      formDataToSend.append(
        'address',
        JSON.stringify({
          city: formData.city,
          fullAddress: formData.completeAddress,
        })
      );
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('email', formData.emailAddress);
      formDataToSend.append('websiteLink', formData.website);
      if (formData.schoolLogo instanceof File) {
        formDataToSend.append('logo', formData.schoolLogo);
      }

      const res = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/school/profile',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update Response:', res.data);
      toast.success(res.data?.message || 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.response || err.message);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <>
    <ToastContainer/>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl archivo-bold text-gray-900 mb-2">
            {loading ? <Skeleton width={150} /> : 'Settings'}
          </h1>
          <p className="text-gray-600 text-sm inter-medium sm:text-base">
            {loading ? <Skeleton width={250} /> : 'Manage your school profile, users, and system preferences.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button className="border-b-2 border-red-500 text-red-600 py-2 px-1 text-sm inter-medium whitespace-nowrap flex items-center space-x-2">
                <FaSchool className="w-4 h-4" />
                <span>{loading ? <Skeleton width={100} /> : 'School Information'}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl inter-semibold text-gray-900 mb-4 sm:mb-0">
              {loading ? <Skeleton width={120} /> : 'School Information'}
            </h2>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="bg-red-500 cursor-pointer  hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 items-center space-x-2 hidden sm:flex"
                  disabled={loading}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="inter-medium">Edit</span>
                </button>
              ) : (
              <motion.button
  onClick={handleSaveChanges}
  disabled={loading || saving}
  whileHover={{ scale: loading || saving ? 1 : 1.05 }}
  whileTap={{ scale: loading || saving ? 1 : 0.95 }}
  className="bg-red-500 cursor-pointer  hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 items-center space-x-2 hidden sm:flex"
>
  <AnimatePresence mode="wait" initial={false}>
    {saving ? (
      <motion.svg
        key="spinner"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.2 },
          rotate: { repeat: Infinity, duration: 1, ease: "linear" },
        }}
        className="w-4 h-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 
             0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
             3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    ) : (
      <motion.div
        key="saveicon"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Save className="w-4 h-4" />
      </motion.div>
    )}
  </AnimatePresence>
  <span className="inter-medium">
    {saving ? "Saving..." : "Save Changes"}
  </span>
</motion.button>

              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Skeleton height={80} />
                  <Skeleton height={40} count={3} />
                </div>
                <div className="space-y-6">
                  <Skeleton height={80} />
                  <Skeleton height={40} count={3} />
                </div>
              </div>
            ) : (
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
                        <label htmlFor="logo-upload" className={`cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                            disabled={!isEditing}
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
                      className={`outline-none w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                        isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                      }`}
                      placeholder="Enter school name"
                      disabled={!isEditing}
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
                      className={`outline-none w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors bg-white ${
                        isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                      }`}
                      disabled={!isEditing}
                    >
                      {schoolTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
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
                        className={`outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                          isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                        }`}
                        placeholder="Enter city"
                        disabled={!isEditing}
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
                      className={`outline-none w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors resize-none ${
                        isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                      }`}
                      placeholder="Enter complete address"
                      disabled={!isEditing}
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
                        className={`outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                          isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                        }`}
                        placeholder="Enter phone number"
                        disabled={!isEditing}
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
                        className={`outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                          isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                        }`}
                        placeholder="Enter email address"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm inter-medium text-gray-600 mb-2">
                      Website <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className={`outline-none w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                          isEditing ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'bg-gray-100'
                        }`}
                        placeholder="Enter website URL"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Mobile Edit/Save Button */}
            <div className="mt-8 sm:hidden">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="outline-none w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg inter-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="inter-medium">Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveChanges}
                  className="outline-none w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg inter-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  disabled={loading || saving}
                >
                  {saving ? (
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="inter-medium">{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  
  );
};

export default SchoolSettingsForm;