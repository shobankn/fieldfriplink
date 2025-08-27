import React, { useState } from 'react';
import { FileText, Download, X, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DocumentItem = ({ document, label, onImageClick, onDownloadClick }) => {
    
  if (!document?.uploaded) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-gray-400 text-sm text-center border border-dashed border-gray-300">
        No {label} uploaded
      </div>
    );
  }


  

  return (
    <div   className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
  {/* File name / label with ellipsis */}
  <span onClick={() => onImageClick(document.url)} className=" hover:text-red-500 cursor-pointer text-sm inter-medium text-gray-800 truncate max-w-[65%] sm:max-w-[75%]">
    {document.fileName || label}
  </span>

  {/* Action buttons (always visible, never pushed out by text) */}
  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
    {/* Preview */}
    <button
  onClick={() => onImageClick(document.url)}
  className="
    p-2 cursor-pointer rounded-lg
    text-gray-500 hover:text-blue-700 active:text-gray-900
    hover:bg-gray-100 active:bg-gray-200
    transition-colors duration-200 ease-in-out
  "
>
  <Eye className="w-4 h-4" />
</button>


    {/* Download */}
   <button
  onClick={() => onDownloadClick(document.url, label)}
  className="
    p-2 cursor-pointer rounded-lg
    text-gray-500 hover:text-red-700 active:text-gray-900
    hover:bg-gray-100 active:bg-gray-200
    transition-colors duration-200 ease-in-out
  "
>
  <Download className="w-4 h-4" />
</button>

  </div>
</div>

  );
};

const DocumentSection = ({ driverData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

   const docs = driverData.submittedDocuments;
  const docKeys = Object.keys(docs);

  // If none uploaded
  if (docKeys.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-600 text-sm">Verification documents are not uploaded.</p>
      </div>
    );
  }


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

  const handleDownloadClick = async (imageUrl, label) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${label.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${label}`);
    } catch (error) {
      toast.error(`Failed to download ${label}`);
    }
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setModalOpen(false);
    setSelectedImage(null);
    setImageLoading(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));

    // ✅ Check if at least one document is uploaded
  const hasDocuments =
    driverData?.submittedDocuments?.cnicFront?.uploaded ||
    driverData?.submittedDocuments?.cnicBack?.uploaded ||
    driverData?.submittedDocuments?.drivingLicense?.uploaded ||
    driverData?.submittedDocuments?.vehicleRegistration?.uploaded;

  if (!hasDocuments) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-600 text-sm">Verification documents are not uploaded.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-red-500" />
          <h3 className="text-lg inter-semibold text-gray-900">Submitted Documents</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <span className="text-sm inter-medium text-gray-700 block mb-2">State Driver License</span>
            <DocumentItem
              document={driverData.submittedDocuments.cnicFront}
              label="CNIC Front"
              onImageClick={handleImageClick}
              onDownloadClick={handleDownloadClick}
            />
          </div>
          

          <div>
            <span className="text-sm inter-medium text-gray-700 block mb-2">School Bus Driver Certification Card</span>
            <DocumentItem
              document={driverData.submittedDocuments.cnicBack}
              label="CNIC Back"
              onImageClick={handleImageClick}
              onDownloadClick={handleDownloadClick}
            />
          </div>

          <div>
            <span className="text-sm inter-medium text-gray-700 block mb-2">BCI/FBI Background Check Verification</span>
            <DocumentItem
              document={driverData.submittedDocuments.drivingLicense}
              label="Driving License"
              onImageClick={handleImageClick}
              onDownloadClick={handleDownloadClick}
            />
          </div>

          {/* <div>
            <span className="text-sm inter-medium text-gray-700 block mb-2">Vehicle Registration</span>
            <DocumentItem
              document={driverData.submittedDocuments.vehicleRegistration}
              label="Vehicle Registration"
              onImageClick={handleImageClick}
              onDownloadClick={handleDownloadClick}
            />
          </div> */}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-4 sm:p-6 max-w-[90vw] max-h-[90vh] w-full sm:max-w-4xl relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 z-20 cursor-pointer  right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 " />
            </button>

            {/* Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-auto">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Document"
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                    }}
                  />
                )}
              </div>



              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDownloadClick(selectedImage, 'Document')}
                  className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentSection;



