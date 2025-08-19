import React, { useState, useEffect, useRef } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { Edit, X, Save, Upload, User } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    city: '',
    cnic: '',
    phone: '',
    partnerSchool: localStorage.getItem('partnerSchool') || '',
    profileImage: '',
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [selectedImage, setSelectedImage] = useState(null);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user, profile } = response.data;
        const updatedProfileData = {
          fullName: user.name || '',
          email: user.email || '',
          city: profile.address || '',
          cnic: profile.cnicNumber || '',
          phone: user.phone || user.phoneNumber || '',
          partnerSchool: localStorage.getItem('partnerSchool') || '',
          profileImage: user.profileImage || '',
        };
        setProfileData(updatedProfileData);
        setEditData(updatedProfileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data. Please try again.');
      }
    };

    fetchProfileData();
  }, []);

  // Fetch school list for dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/auth/school-list');
        setSchools(response.data.data || []);
      } catch (error) {
        console.error('Error fetching school list:', error);
        toast.error('Failed to load school list. Please try again.');
      }
    };

    fetchSchools();
  }, []);

  const handleEditClick = () => {
    setEditData({ ...profileData });
    setSelectedImage(null);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editData.fullName);
      formData.append('email', editData.email);
      formData.append('phone', editData.phone);
      formData.append('address', editData.city);
      formData.append('cnicNumber', editData.cnic);
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      const response = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/driver/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProfileData({
        ...editData,
        profileImage: response.data.user.profileImage || editData.profileImage,
      });
      localStorage.setItem('partnerSchool', editData.partnerSchool);
      setIsEditModalOpen(false);
      setSelectedImage(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setSelectedImage(null);
    setIsEditModalOpen(false);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSchoolSelect = (schoolName) => {
    handleInputChange('partnerSchool', schoolName);
    setIsDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

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

      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-[10px] bg-gray-50">
          <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-full mx-auto">
              <div className="mb-6">
                <h1 className="archivobold text-[24px] mt-[18px] text-gray-900">Driver Profile</h1>
                <p className="text-gray-600">Manage your personal and vehicle information</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Photo</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
                        {profileData.profileImage ? (
                          <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0">
                      <span className="font-medium text-gray-900">{profileData.fullName}</span>
                      <label className="mt-2 px-2 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white mt-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Personal Information</h2>
                    <button
                      onClick={handleEditClick}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2 self-start sm:self-auto"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{profileData.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">CNIC</label>
                      <p className="text-gray-900 font-medium">{profileData.cnic}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                      <p className="text-gray-900 font-medium">{profileData.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Partner School</label>
                      <p className="text-gray-900 font-medium">{profileData.partnerSchool || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Personal Information</h3>
                    <div className="flex gap-3 order-2 sm:order-1">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex-1 sm:flex-none px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                          isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSaving ? (
                          <svg
                            className="animate-spin h-5 w-5 text-black"
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
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className={`flex-1 sm:flex-none px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                          isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Profile Photo</h4>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
                            {selectedImage ? (
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : editData.profileImage ? (
                              <img
                                src={editData.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-medium text-gray-900">{editData.fullName}</span>
                          <label className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium rounded transition-colors duration-200 self-start cursor-pointer">
                            Upload New Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
                        <input
                          type="text"
                          value={editData.cnic}
                          onChange={(e) => handleInputChange('cnic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter CNIC"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      </div>
                      <div ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Partner</label>
                        <div className="relative">
                          <div
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F0B100] focus:border-[#F0B100] cursor-pointer flex justify-between items-center"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <span>{editData.partnerSchool || 'Select a school'}</span>
                            <svg
                              className={`w-5 h-5 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              <div
                                className="px-3 py-2 hover:bg-[#F0B100] cursor-pointer"
                                onClick={() => handleSchoolSelect('')}
                              >
                                Select a school
                              </div>
                              {schools.map((school) => (
                                <div
                                  key={school._id}
                                  className="px-3 py-2 hover:bg-[#F0B100] cursor-pointer focus:ring-2 focus:ring-[#F0B100]"
                                  onClick={() => handleSchoolSelect(school.schoolName)}
                                >
                                  {school.schoolName}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-end p-6 border-t border-gray-200">
                    <div className="flex gap-3 order-2 sm:order-1"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DriverProfile;