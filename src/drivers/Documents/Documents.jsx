import React, { useState, useEffect } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaInfoCircle, FaDownload, FaTrash } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found. Please log in again.');
          console.error('No token found in localStorage');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://fieldtriplinkbackend-production.up.railway.app/api/driver/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data);

        const { user, profile } = response.data.data || response.data;
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

        setFiles({
          cnicFront: profile.cnicFrontImage ? { name: 'CNIC Front Uploaded' } : null,
          cnicBack: profile.cnicBackImage ? { name: 'CNIC Back Uploaded' } : null,
          license: profile.drivingLicenseImage ? { name: 'Driving License Uploaded' } : null,
          vehicleReg: profile.vehicleRegistrationImage ? { name: 'Vehicle Registration Uploaded' } : null,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error.response?.data || error.message);
        toast.error(`Failed to load document data: ${error.response?.data?.message || error.message}`);
        setLoading(false);
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

  // Handle document deletion
  const handleDelete = async (fieldId, apiKey) => {
    if (profileData.accountStatus === 'verified') {
      setFieldToDelete({ fieldId, apiKey });
      setIsDeleteModalOpen(true);
      return;
    }

    await performDelete(fieldId, apiKey);
  };

  const performDelete = async (fieldId, apiKey) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }

      await axios.delete(
        `https://fieldtriplinkbackend-production.up.railway.app/api/driver/document/${apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProfileData((prev) => ({
        ...prev,
        [apiKey]: '',
        accountStatus: prev.accountStatus === 'verified' ? 'pending_approval' : prev.accountStatus,
      }));
      setFiles((prev) => ({
        ...prev,
        [fieldId]: null,
      }));

      toast.success(`${uploadFields.find((f) => f.id === fieldId).label} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting document:', error.response?.data || error.message);
      toast.error(`Failed to delete document: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm.');
      return;
    }

    if (fieldToDelete) {
      await performDelete(fieldToDelete.fieldId, fieldToDelete.apiKey);
      setIsDeleteModalOpen(false);
      setDeleteConfirmation('');
      setFieldToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmation('');
    setFieldToDelete(null);
  };

  const handleDownload = (url, label) => {
    if (!url) {
      toast.error(`No ${label} available for download.`);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `${label}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsUploaded = uploadFields.every((field) => files[field.id]);
  const uploadedCount = uploadFields.filter((field) => files[field.id]).length;
  const progressPercentage = Math.round((uploadedCount / uploadFields.length) * 100);

  // Shimmer effect component for loading state
  const ShimmerCard = () => (
    <div className="max-w-full mx-auto animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border-2 border-gray-200 border-dashed rounded-lg p-4 flex flex-col items-center h-[322px]">
            <div className="h-12 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="h-10 w-40 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[17%]">
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
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto pt-16 px-[9px] sm:px-4 bg-gray-50">
          <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            {loading ? (
              <ShimmerCard />
            ) : (
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
                    <div className="bg-[#0E9039] h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
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

                    // Determine document status
                    const documentStatus = profileData[field.apiKey]
                      ? profileData.accountStatus === 'verified'
                        ? 'Verified'
                        : 'Pending'
                      : null;

                    return (
                      <div
                        key={field.id}
                        className={`border-2 ${borderColor} border-dashed rounded-lg p-1 sm:p-4 flex flex-col items-center justify-center text-center relative h-[322px]`}
                      >
                        {profileData[field.apiKey] ? (
                          <div className="flex justify-center items-center w-[100%] h-[90%]">
                            <img
                              src={profileData[field.apiKey]}
                              alt={field.label}
                              className="w-full h-full object-contain"
                              onError={() => toast.error(`Failed to load ${field.label} image.`)}
                            />
                          </div>
                        ) : (
                          <>
                            <MdOutlineFileUpload color={iconColor} className='text-[48px] interregular' />
                            <p className="font-medium text-[14px] sm:text-[15px] md:text-[16px]">{field.label} {field.required && '*'}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 truncate w-full">
                              Upload image or PDF
                            </p>
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
                          </>
                        )}
                        {profileData[field.apiKey] && (
                          <>
                            {/* Status Indicator on the Left */}
                            <div className="absolute top-2 left-2">
                              <span
                                className={`text-[12px] interregular ${
                                  documentStatus === 'Verified' ? 'text-green-500' : 'text-red-500'
                                }`}
                              >
                                {documentStatus}
                              </span>
                            </div>
                            {/* Download and Delete Icons on the Right */}
                            <div className="absolute top-2 right-2 flex gap-2">
                              <FaDownload
                                className="text-green-500 cursor-pointer"
                                size={16}
                                onClick={() => handleDownload(profileData[field.apiKey], field.label)}
                                title="Download"
                              />
                              <FaTrash
                                className="text-red-500 cursor-pointer"
                                size={16}
                                onClick={() => handleDelete(field.id, field.apiKey)}
                                title="Delete"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className='mb-[12px]'>
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
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${
                    allFieldsUploaded
                      ? isSubmitting
                        ? 'bg-red-500 text-white opacity-70 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-[#F687B3] text-gray-200 cursor-not-allowed'
                  }`}
                  disabled={!allFieldsUploaded || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Deleting this document will change your account status to <span className="text-red-500">Unverified</span>. 
                    Please type <span className="font-bold">"delete"</span> to confirm.
                  </p>
                </div>
                <div className="p-6">
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9039] focus:border-transparent"
                    placeholder="Type 'delete' to confirm"
                  />
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 font-medium rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Documents;