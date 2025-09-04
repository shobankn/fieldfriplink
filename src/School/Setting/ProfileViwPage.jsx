import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { MapPin, Phone, Mail, Globe, Edit2, School } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import dummyprofile from '../../images/profile/dummyprofile.png'
import PremiumBanner from './PriemumBanner';

const SchoolProfileView = () => {
  const [profileData, setProfileData] = useState({
    schoolName: '',
    schoolType: '',
    city: '',
    completeAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    schoolLogo: null,
  });
  
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();


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
        setProfileData({
          schoolName: school.schoolName || '',
          schoolType: capitalizeFirstLetter(school.type) || '',
          city: school.address?.city || '',
          completeAddress: school.address?.fullAddress || '',
          phoneNumber: school.phoneNumber || '',
          emailAddress: user.email || '',
          website: school.websiteLink || '',
          schoolLogo: school.logo || null,
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response || err.message);
        toast.error(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    // Navigate to edit page or toggle edit mode
    // You can implement navigation logic here
    console.log('Edit clicked');
  };

  return (
    <>
      <ToastContainer position="top-right" />
           
      <div className="min-h-screen bg-gray-50 p-4 sm:px-6 py-2 ">
      
        <div className="max-w-full mx-auto">
       
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
           
            <div>
              <h1 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-1">
                School Information
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Manage your school profile, users, and system preferences.
              </p>
            </div>
           
          </div>

          {/* Main Profile Container */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            
            <div className="p-4 sm:p-6 md:p-8">
              <div className='justify-end items-end content-end flex'>
                    {!loading && (
              <button
                onClick={() => navigate('/setting/update-profile')}
                className="mt-4 sm:mt-0 inline-flex items-center cursor-pointer  justify-center content-center px-4 py-2 bg-red-500 text-white text-sm inter-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
            )}

              </div>
           
              {loading ? (
                <div className="space-y-8">
                  {/* Logo Skeleton */}
                  <div className="flex justify-start">
                    <Skeleton height={120} width={120} className="rounded-lg" />
                  </div>
                  
                  {/* Form Fields Skeleton */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton height={60} count={3} />
                    <Skeleton height={60} count={3} />
                  </div>
                  <Skeleton height={100} />
                </div>
              ) : (
                <>
                  {/* School Logo */}
                  <div className="flex justify-start mb-8">
<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
  {profileData?.schoolLogo ? (
    <img
      src={profileData.schoolLogo}
      alt="School Logo"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-red-500">
      <School className="w-24 h-24 text-white" />
    </div>
  )}
</div>

                    
                  </div>

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* School Name */}
                    <div className='relative'>
                      <label className="block text-sm inter-medium text-gray-600 mb-2">
                        School Name
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 bg-white text-gray-500 inter-medium capitalize">
                        {profileData.schoolName || 'Not provided'}
                      </div>
                    </div>

                    {/* School Type */}
                    <div className='relative'>
                      <label className="block text-sm inter-medium text-gray-700 mb-2">
                        School Type
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 bg-white text-gray-500 inter-medium capitalize">
                        {profileData.schoolType || 'Not provided'}
                      </div>
                    </div>

                    {/* City */}
                        <div className="relative">
                        <label className="block text-sm inter-medium text-gray-700 mb-2">
                            City
                        </label>
                        <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                                        focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 
                                        outline-none transition-all duration-200 bg-white text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="flex-1">{profileData.city || "Not provided"}</span>
                        </div>
                        </div>

                            {/* Website */}
                            <div className="relative">
                            <label className="block text-sm inter-medium text-gray-700 mb-2">
                                Website <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                                            focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 
                                            outline-none transition-all duration-200 bg-white text-gray-600">
                                <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                {profileData.website ? (
                                <a
                                    href={profileData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {profileData.website}
                                </a>
                                ) : (
                                <span>"Not provided"</span>
                                )}
                            </div>
                            </div>

                            {/* Phone Number */}
                            <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                                            focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 
                                            outline-none transition-all duration-200 bg-white text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="flex-1">{profileData.phoneNumber || "Not provided"}</span>
                            </div>
                            </div>

                            {/* Email Address */}
                            <div className="relative">
                            <label className="block text-sm inter-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                                            focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 
                                            outline-none transition-all duration-200 bg-white text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="flex-1">{profileData.emailAddress || "Not provided"}</span>
                            </div>
                            </div>

                            {/* Complete Address */}
                            <div className="relative mt-3 w-full lg:col-span-2">
                            <label className="block text-sm inter-medium text-gray-700 mb-2">
                                Complete Address
                            </label>
                            <div className="flex items-start w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                                            focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 
                                            outline-none transition-all duration-200 bg-white text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                <span className="flex-1 break-words">{profileData.completeAddress || "Not provided"}</span>
                            </div>
                            </div>


                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolProfileView;