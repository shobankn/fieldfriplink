import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, FileText, Image as ImageIcon, Calendar, MapPin, Mail, Phone, Download, Check, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import profilepic from '../../images/profile/profile4.jpeg';
import DriverStatusButtons from './ApproveRejctButton';
import DocumentSection from './DocuemntSection';

const DriverVerificationDetails = () => {
  const [status, setStatus] = useState('Verified');
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch driver details from API
  useEffect(() => {
    const fetchDriverDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://fieldtriplinkbackend-production.up.railway.app/api/school/driver/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { user, profile,schoolDriver } = response.data;
        console.log(response.data);

        // Transform backend data to match frontend structure
const submittedDocuments = {};

if (profile.cnicFrontImage) {
  submittedDocuments.cnicFront = {
    name: 'CNIC Front',
    uploaded: true,
    fileName: profile.cnicFrontImage.split('/').pop().split('?')[0],
    url: profile.cnicFrontImage
  };
}

if (profile.cnicBackImage) {
  submittedDocuments.cnicBack = {
    name: 'CNIC Back',
    uploaded: true,
    fileName: profile.cnicBackImage.split('/').pop().split('?')[0],
    url: profile.cnicBackImage
  };
}

if (profile.drivingLicenseImage) {
  submittedDocuments.drivingLicense = {
    name: 'Driving License',
    uploaded: true,
    fileName: profile.drivingLicenseImage.split('/').pop().split('?')[0],
    url: profile.drivingLicenseImage
  };
}

if (profile.vehicleRegistrationImage) {
  submittedDocuments.vehicleRegistration = {
    name: 'Vehicle Registration',
    uploaded: true,
    fileName: profile.vehicleRegistrationImage.split('/').pop().split('?')[0],
    url: profile.vehicleRegistrationImage
  };
}




        // Transform backend data to match frontend structure
        const transformedData = {
          personalInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePhoto: user.profileImage || profilepic, // Fallback to default profile image
            cnicNumber: profile.cnicNumber || 'N/A',
            joinedDate: profile.joinedDate
              ? new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'N/A',
            address: profile.address || 'N/A'
          },
          submittedDocuments,
          // submittedDocuments: {
          //   cnicFront: {
          //     name: 'CNIC Front',
          //     uploaded: !!profile.cnicFrontImage,
          //     fileName: profile.cnicFrontImage ? profile.cnicFrontImage.split('/').pop().split('?')[0] : 'N/A',
          //     url: profile.cnicFrontImage || ''
          //   },
          //   cnicBack: {
          //     name: 'CNIC Back',
          //     uploaded: !!profile.cnicBackImage,
          //     fileName: profile.cnicBackImage ? profile.cnicBackImage.split('/').pop().split('?')[0] : 'N/A',
          //     url: profile.cnicBackImage || ''
          //   },
          //   drivingLicense: {
          //     name: 'Driving License',
          //     uploaded: !!profile.drivingLicenseImage,
          //     fileName: profile.drivingLicenseImage ? profile.drivingLicenseImage.split('/').pop().split('?')[0] : 'N/A',
          //     url: profile.drivingLicenseImage || ''
          //   },
          //   vehicleRegistration: {
          //     name: 'Vehicle Registration',
          //     uploaded: !!profile.vehicleRegistrationImage,
          //     fileName: profile.vehicleRegistrationImage ? profile.vehicleRegistrationImage.split('/').pop().split('?')[0] : 'N/A',
          //     url: profile.vehicleRegistrationImage || ''
          //   }
          // },
          verificationNotes: schoolDriver.notes || 'No verification notes provided.',
          submissionDetails: {
            submitted: profile.createdAt
              ? `Submitted ${Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))} days ago`
              : 'N/A',
            status: schoolDriver.status
          }
        };

        setDriverData(transformedData);
      } catch (error) {
        console.error('Error fetching driver details:', error);
        toast.error('Failed to fetch driver details. Please try again.');
        setDriverData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [id, navigate]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    console.log(`Status changed to: ${newStatus}`);
  };

  const handleImageClick = (imageUrl) => {
    if (!imageUrl) {
      toast.error('No image available for this document.');
      return;
    }
    setSelectedImage(imageUrl);
    setImageLoading(true);
    setZoomLevel(1);
    setModalOpen(true);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    console.log('Close modal triggered');
    setModalOpen(false);
    setSelectedImage(null);
    setImageLoading(false);
    setZoomLevel(1);
  };

  // const handleZoomIn = () => {
  //   setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Max zoom: 3x
  // };

  // const handleZoomOut = () => {
  //   setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom: 0.5x
  // };

const DocumentItem = ({ document, label, onImageClick }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg">
        <FileText className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900">{label}</h4>
        {document.uploaded && (
          <p className="text-sm text-gray-500 truncate" title={document.fileName}>
            {document.fileName}
          </p>
        )}
      </div>
      <button
        onClick={() => onImageClick(document.url)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Modal
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-4 sm:p-6 max-w-[90vw] max-h-[90vh] w-full sm:max-w-4xl relative shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <button
              onClick={closeModal}
              className= " z-40 absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-auto">
                {imageLoading && (
                  <Skeleton width="100%" height="100%" className="absolute inset-0" />
                )}
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Document"
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      toast.error('Failed to load image.');
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Header */}
      <div className="px-4 md:px-6 py-4">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-[18px] md:text-2xl archivo-bold text-gray-900">Driver Verification Details</h1>
              {loading ? (
                <Skeleton width={100} height={24} />
              ) : (
                driverData && (
                  <span className="bg-green-100 capitalize text-green-800 px-3 py-1 rounded-full text-sm inter-medium">
                    {driverData.submissionDetails.status}
                  </span>
                )
              )}
            </div>
          </div>
          
          {/* <div className="flex gap-3">
            <button 
              onClick={() => handleStatusChange('Suspended')}
              className="flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-green-400 rounded-[10px] inter-medium transition-colors"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto"/>
              Verify Driver
            </button>
            <button 
              onClick={() => handleStatusChange('Declined')}
              className="content-center flex text-[14px] sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 text-white bg-red-500 rounded-[10px] inter-medium transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto"/>
              Reject
            </button>
          </div> */}

          <DriverStatusButtons loading={loading} driverId={id} />

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto md:px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton width={150} height={20} className="mb-6" />
                <div className="flex flex-col sm:flex-row gap-6">
                  <Skeleton circle width={56} height={56} />
                  <div className="flex-1">
                    <Skeleton width={200} height={24} className="mb-2" />
                    <Skeleton width={150} height={16} count={2} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                  <Skeleton width={100} height={16} count={2} />
                  <Skeleton width={100} height={16} count={2} />
                  <Skeleton width={200} height={16} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton width={150} height={20} className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton width={100} height={16} className="mb-2" />
                      <Skeleton height={60} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right Column - Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton width={150} height={20} className="mb-4" />
                <Skeleton height={200} />
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton width={150} height={20} className="mb-4" />
                <Skeleton height={80} />
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton width={150} height={20} className="mb-4" />
                <Skeleton width={200} height={16} count={2} />
              </div>
            </div>
          </div>
        ) : (
          driverData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg inter-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Profile Section */}
                    <div className="flex items-start gap-4">
                      <img
                        src={driverData.personalInfo.profilePhoto}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xl inter-semibold text-gray-900 mb-1">
                          {driverData.personalInfo.name}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center inter-regular gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{driverData.personalInfo.email}</span>
                          </div>
                          <div className="flex items-center inter-regular gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{driverData.personalInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                    <div>
                      <span className="text-sm inter-regular text-gray-500 block mb-1">CNIC Number</span>
                      <span className="font-semibold text-gray-900">{driverData.personalInfo.cnicNumber}</span>
                    </div>
                    <div className="">
                      <span className="text-sm inter-regular text-gray-500 block">Joined Date</span>
                      <span className="inter-semibold text-gray-900">{driverData.personalInfo.joinedDate}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sm text-gray-500 inter-regular block mb-1">Address</span>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="inter-semibold text-gray-900">{driverData.personalInfo.address}</span>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Submitted Documents */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <FileText className="w-5 h-5 text-red-500" />
    <h3 className="text-lg inter-semibold text-gray-900">Submitted Documents</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <span className="text-sm inter-medium text-gray-700 block mb-2">CNIC Front</span>
      <DocumentItem 
        document={driverData.submittedDocuments.cnicFront}
        label="CNIC Front"
        onImageClick={handleImageClick}
      />
    </div>

    <div>
      <span className="text-sm inter-medium text-gray-700 block mb-2">CNIC Back</span>
      <DocumentItem 
        document={driverData.submittedDocuments.cnicBack}
        label="CNIC Back"
        onImageClick={handleImageClick}
      />
    </div>

    <div>
      <span className="text-sm inter-medium text-gray-700 block mb-2">Driving License</span>
      <DocumentItem 
        document={driverData.submittedDocuments.drivingLicense}
        label="Driving License"
        onImageClick={handleImageClick}
      />
    </div>

    <div>
      <span className="text-sm inter-medium text-gray-700 block mb-2">Vehicle Registration</span>
      <DocumentItem 
        document={driverData.submittedDocuments.vehicleRegistration}
        label="Vehicle Registration"
        onImageClick={handleImageClick}
      />
    </div>
  </div>
            </div> */}

            <DocumentSection driverData={driverData} />



                
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg inter-semibold text-gray-900 mb-4">Profile Photo</h3>
                  <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
                    <img
                      src={driverData.personalInfo.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Verification Notes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg inter-semibold text-gray-900 mb-4">Verification Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {/* {driverData.verificationNotes} */}
                    </p>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg inter-semibold text-gray-900 mb-4">Submission Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-1">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="inter-semibold text-gray-900">{driverData.submissionDetails.submitted}</span>
                  </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="inter-semibold text-gray-900">{driverData.submissionDetails.status}</span>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DriverVerificationDetails;