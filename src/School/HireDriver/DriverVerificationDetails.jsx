import React, { useState } from 'react';
import { ArrowLeft, User, FileText, Image, Calendar, MapPin, Mail, Phone, Download, Cross, CrossIcon, X, Check } from 'lucide-react';
import { useParams } from 'react-router-dom';
import profile from '../../images/profile/profile4.jpeg';

const DriverVerificationDetails = () => {
  const [status, setStatus] = useState('Verified');
//   const { id } = useParams();
// const driver = combinedVerificationData.find(item => item.id === Number(id));
  
  // Dynamic driver verification data
  const driverData = {
    personalInfo: {
      name: "Fatima Sheikh",
      email: "fatima.sheikh@email.com",
      phone: "+92 301 2345678",
      profilePhoto: profile,
      cnicNumber: "35202-2345678-9",
      joinedDate: "January 2019",
      address: "Apartment 5B, Green Valley, Lahore"
    },
    submittedDocuments: {
      cnicFront: {
        name: "CNIC Front",
        uploaded: true,
        fileName: "cnic_front.jpg"
      },
      cnicBack: {
        name: "CNIC Back", 
        uploaded: true,
        fileName: "cnic_back.jpg"
      },
      drivingLicense: {
        name: "Driving License",
        uploaded: true,
        fileName: "driving_license.jpg"
      },
      vehicleRegistration: {
        name: "Vehicle Registration",
        uploaded: true,
        fileName: "vehicle_registration.jpg"
      }
    },
    verificationNotes: "All documents verified successfully. Driver approved for school transport.",
    submissionDetails: {
      submitted: "1 week ago",
      status: "Verified"
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    console.log(`Status changed to: ${newStatus}`);

  };

  const DocumentItem = ({ document, label }) => (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg">
          <FileText className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{label}</h4>
          {document.uploaded && (
            <p className="text-sm text-gray-500">{document.fileName}</p>
          )}
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className=" px-4 md:px-6 py-4">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button> */}
            <div className="flex items-center gap-3">
              <h1 className="text-[18px] md:text-2xl archivo-bold text-gray-900">Driver Verification Details</h1>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inter-medium">
                {driverData.submissionDetails.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleStatusChange('Suspended')}
              className=" flex text-[14px] sm:text-[16px]  px-3 py-2 sm:px-4 sm:py-2 text-white bg-green-400 rounded-[10px]  inter-medium transition-colors"
            >
               <Check className='w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto'/>
              Verify Driver
            </button>
            <button 
              onClick={() => handleStatusChange('Declined')}
              className=" content-center flex  text-[14px] sm:text-[16px]  px-3 py-2 sm:px-4 sm:py-2 text-white bg-red-500 rounded-[10px]  inter-medium transition-colors"
            >
              <X className='w-4 h-4 sm:w-5 sm:h-5 mr-1 my-auto'/>
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto  md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200  p-6">
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
                
                {/* Joined Date */}
                
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="text-lg inter-semibold text-gray-900">Submitted Documents</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CNIC Front */}
                <div>
                  <span className="text-sm inter-medium text-gray-700 block mb-2">CNIC Front</span>
                  <DocumentItem 
                    document={driverData.submittedDocuments.cnicFront}
                    label="CNIC Front"
                  />
                </div>

                {/* CNIC Back */}
                <div>
                  <span className="text-sm inter-medium text-gray-700 block mb-2">CNIC Back</span>
                  <DocumentItem 
                    document={driverData.submittedDocuments.cnicBack}
                    label="CNIC Back"
                  />
                </div>

                {/* Driving License */}
                <div>
                  <span className="text-sm inter-medium text-gray-700 block mb-2">Driving License</span>
                  <DocumentItem 
                    document={driverData.submittedDocuments.drivingLicense}
                    label="Driving License"
                  />
                </div>

                {/* Vehicle Registration */}
                <div>
                  <span className="text-sm inter-medium text-gray-700 block mb-2">Vehicle Registration</span>
                  <DocumentItem 
                    document={driverData.submittedDocuments.vehicleRegistration}
                    label="Vehicle Registration"
                  />
                </div>
              </div>
            </div>
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
                  {driverData.verificationNotes}
                </p>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg inter-semibold text-gray-900 mb-4">Submission Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default DriverVerificationDetails;