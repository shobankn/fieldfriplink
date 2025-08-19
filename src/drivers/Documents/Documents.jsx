import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaInfoCircle } from 'react-icons/fa';
import { MdOutlineFileUpload } from "react-icons/md";
import axios from 'axios';
import { FaCheck } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const uploadFields = [
  { id: 'cnicFront', label: 'CNIC Front', required: true, apiKey: 'cnicFrontImage' },
  { id: 'cnicBack', label: 'CNIC Back', required: true, apiKey: 'cnicBackImage' },
  { id: 'license', label: 'Driving License (PSV/School Bus)', required: true, apiKey: 'drivingLicenseImage' },
  { id: 'vehicleReg', label: 'Vehicle Registration', required: true, apiKey: 'vehicleRegistrationImage' },
];

const Documents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState({});
  const [profileData, setProfileData] = useState({
    accountStatus: 'pending_approval',
    cnicFrontImage: '',
    cnicBackImage: '',
    drivingLicenseImage: '',
    vehicleRegistrationImage: '',
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found. Please log in again.');
          console.error('No token found in localStorage');
          return;
        }

        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data); // Log response for debugging

        // Adjust based on actual API response structure
        const { user, profile } = response.data.data || response.data; // Fallback to response.data if .data.data doesn't exist
        if (!user || !profile) {
          throw new Error('Invalid API response structure: Missing user or profile data');
        }

        setProfileData({
          accountStatus: user.accountStatus || 'pending_approval',
          cnicFrontImage: profile.cnicFrontImage || '',
          cnicBackImage: profile.cnicBackImage || '',
          drivingLicenseImage: profile.drivingLicenseImage || '',
          vehicleRegistrationImage: profile.vehicleRegistrationImage || '',
        });

        // Set files state based on API data
        setFiles({
          cnicFront: profile.cnicFrontImage ? { name: 'CNIC Front Uploaded' } : null,
          cnicBack: profile.cnicBackImage ? { name: 'CNIC Back Uploaded' } : null,
          license: profile.drIVINGLicenseImage ? { name: 'Driving License Uploaded' } : null,
          vehicleReg: profile.vehicleRegistrationImage ? { name: 'Vehicle Registration Uploaded' } : null,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error.response?.data || error.message);
        toast.error(`Failed to load document data: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [id]: file });
    }
  };

  // Handle document submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }

      const formData = new FormData();
      uploadFields.forEach((field) => {
        if (files[field.id]) {
          formData.append(field.apiKey, files[field.id]);
        }
      });

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

      // Update profileData with new URLs from the response (adjust based on actual API response)
      const updatedProfile = response.data.profile || response.data.data.profile;
      setProfileData((prev) => ({
        ...prev,
        cnicFrontImage: updatedProfile.cnicFrontImage || prev.cnicFrontImage,
        cnicBackImage: updatedProfile.cnicBackImage || prev.cnicBackImage,
        drivingLicenseImage: updatedProfile.drivingLicenseImage || prev.drivingLicenseImage,
        vehicleRegistrationImage: updatedProfile.vehicleRegistrationImage || prev.vehicleRegistrationImage,
        accountStatus: updatedProfile.accountStatus || prev.accountStatus,
      }));

      toast.success('Documents submitted successfully for verification!');
    } catch (error) {
      console.error('Error uploading documents:', error.response?.data || error.message);
      toast.error(`Failed to submit documents: ${error.response?.data?.message || error.message}`);
    }
  };

  // Check if all required fields have files uploaded
  const allFieldsUploaded = uploadFields.every((field) => files[field.id]);

  // Calculate verification progress
  const uploadedCount = uploadFields.filter((field) => files[field.id]).length;
  const progressPercentage = Math.round((uploadedCount / uploadFields.length) * 100);

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
            className="absolute left-0 top-0 h-full w-[75%] sm:w-[60%] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[80%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-[9px] sm:px-4 bg-gray-50">
          <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            <div className="max-w-full mx-auto">
              <h1 className="text-[20px] sm:text-[22px] md:text-[24px] mt-[12px] sm:mt-[16px] md:mt-[18px] archivobold mb-1">Document Verification</h1>
              <p className="text-gray-600 mb-2 interregular text-[14px] sm:text-[15px] md:text-[16px]">
                Upload your documents to complete the verification process
              </p>
              <p className="mb-2 text-[14px] sm:text-[15px] md:text-[16px] interbold">
                Current Status: <span className={profileData.accountStatus === 'verified' ? 'text-green-500' : 'text-[#DE3B40]'}>
                  {profileData.accountStatus === 'verified' ? 'Verified' : 'Unverified'}
                </span>
              </p>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between mb-1 text-xs sm:text-sm text-gray-500">
                  <span className='interregular text-[14px]'>Verification Progress</span>
                  <span className='interregular text-[14px]'>{progressPercentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Upload Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {uploadFields.map((field) => {
                  const hasFile = files[field.id];
                  const isYellowField = field.id === 'cnicFront' || field.id === 'license';
                  const borderColor = hasFile
                    ? 'border-green-500'
                    : isYellowField
                    ? 'border-[#FFDD00]'
                    : 'border-[#E53E3E]';

                  const buttonColor = hasFile
                    ? 'bg-green-500'
                    : isYellowField
                    ? 'bg-[#FFDD00]'
                    : 'bg-[#E53E3E]';

                  const textColor = hasFile
                    ? 'text-white'
                    : isYellowField
                    ? 'text-black'
                    : 'text-white';

                  const iconColor = hasFile
                    ? '#22c55e'
                    : isYellowField
                    ? '#FFDD00'
                    : '#E53E3E';

                  const buttonIconColor = hasFile
                    ? '#FFFFFF'
                    : isYellowField
                    ? '#000000'
                    : '#FFFFFF';

                  const labelText = hasFile
                    ? files[field.id].name
                    : profileData[field.apiKey]
                    ? `${field.label} Uploaded`
                    : 'Upload image or PDF';

                  return (
                    <div
                      key={field.id}
                      className={`border-2 ${borderColor} border-dashed rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center text-center`}
                    >
                      {profileData[field.apiKey] ? (
                        <img
                          src={profileData[field.apiKey]}
                          alt={field.label}
                          className="w-16 h-16 object-cover mb-2"
                          onError={() => toast.error(`Failed to load ${field.label} image.`)}
                        />
                      ) : (
                        <MdOutlineFileUpload color={iconColor} className='text-[48px] interregular' />
                      )}
                      <p className="font-medium text-[14px] sm:text-[15px] md:text-[16px]">{field.label} {field.required && '*'}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 truncate w-full">{labelText}</p>

                      <label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, field.id)}
                        />
                        <span
                          className={`inline-flex items-center gap-1 ${textColor} ${buttonColor} px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded cursor-pointer`}
                        >
                          <MdOutlineFileUpload color={buttonIconColor} className='text-[16px] sm:text-[18px]' />
                          {hasFile ? 'Uploaded' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className='mb-[12px]'>
                <FaCheck className='text-[#22C55E]' />
              </div>

              {/* Notes */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded mb-4 sm:mb-6 text-xs sm:text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="mt-0.5 sm:mt-1" />
                  <ul className="list-disc pl-4 sm:pl-5">
                    <li>All images should be clear and readable</li>
                    <li>Driving license must be PSV or school bus category</li>
                    <li>Vehicle registration should be current and valid</li>
                    <li>CNIC should be valid and not expired</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold text-sm sm:text-base ${
                  allFieldsUploaded
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#F687B3] text-gray-200 cursor-not-allowed'
                }`}
                disabled={!allFieldsUploaded}
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Documents;