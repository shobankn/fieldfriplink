import React, { useState } from 'react';
import Topbar from '../component/topbar/topbar';
import Sidebar from '../component/sidebar/Sidebar';
import { FaUpload, FaInfoCircle } from 'react-icons/fa';

const uploadFields = [
  { id: 'cnicFront', label: 'CNIC Front', required: true },
  { id: 'cnicBack', label: 'CNIC Back', required: true },
  { id: 'license', label: 'Driving License (PSV/School Bus)', required: true },
  { id: 'vehicleReg', label: 'Vehicle Registration', required: true },
];

const Documents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    setFiles({ ...files, [id]: file });
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
          <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-full mx-auto">
              <h1 className="text-2xl font-bold mb-1">Document Verification</h1>
              <p className="text-gray-600 mb-4">
                Upload your documents to complete the verification process
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-1 text-sm text-gray-500">
                  <span>Verification Progress</span>
                  <span>0% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* Upload Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {uploadFields.map((field) => {
                  const hasFile = files[field.id];
                  const borderColor = hasFile
                    ? 'border-green-400'
                    : field.id.includes('cnic') || field.id === 'vehicleReg'
                    ? 'border-red-400'
                    : 'border-yellow-400';

                  const buttonColor = hasFile
                    ? 'bg-green-500'
                    : field.id.includes('cnic') || field.id === 'vehicleReg'
                    ? 'bg-red-500'
                    : 'bg-yellow-400';

                  const labelText = hasFile ? files[field.id].name : 'Upload image or PDF';

                  return (
                    <div
                      key={field.id}
                      className={`border-2 ${borderColor} border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center`}
                    >
                      <FaUpload className="text-gray-400 text-3xl mb-2" />
                      <p className="font-medium">{field.label} {field.required && '*'}</p>
                      <p className="text-sm text-gray-500 mb-3">{labelText}</p>

                      <label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, field.id)}
                        />
                        <span
                          className={`inline-block text-white ${buttonColor} px-4 py-1.5 text-sm font-medium rounded cursor-pointer`}
                        >
                          {hasFile ? 'Uploaded' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="mt-1" />
                  <ul className="list-disc pl-5">
                    <li>All images should be clear and readable</li>
                    <li>Driving license must be PSV or school bus category</li>
                    <li>Vehicle registration should be current and valid</li>
                    <li>CNIC should be valid and not expired</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-semibold">
                Submit for Verification
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;