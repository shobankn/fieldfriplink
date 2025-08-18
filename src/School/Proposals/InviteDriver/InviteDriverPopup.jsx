import { Calendar, Clock, MapPin, Users, X } from "lucide-react";
import proposalsData from "../ProposalData";


const TripCard = ({ trip, onSendJobPost }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="inter-semibold text-gray-900 text-sm sm:text-base mb-1">{trip.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs inter-medium ${
              trip.type === 'Recurring' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {trip.type}
            </span>
            <span className="inter-regular">{trip.createdDate}</span>
          </div>
        </div>
        <span className={`px-3 py-2 inter-regular text-center  rounded-full text-[#44B25D] bg-[#EAF7ED] text-xs inter-medium  whitespace-nowrap`}>
          {trip.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div>
            <div className="inter-regular text-[#6B7280]">Schedule:</div>
            <div className="text-[#1F2F3D] inter-medium">{trip.schedule.date}</div>
            <div className="text-gray-500 inter-regular text-xs">{trip.schedule.time}</div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inter-regular text-[#6B7280]">Students:</div>
            <div className="text-[#1F2F3D] inter-semibold  text-xs">{trip.requirements.students}</div>
          </div>
           <div>
            <div className="inter-regular text-[#6B7280]">Proposals:</div>
            <div className="text-[#1F2F3D] inter-semibold text-xs">{trip.proposals}</div>
          </div>
        </div>
        <div className="flex justify-end items-end gap-2">
         
           <button 
          onClick={() => onSendJobPost(trip)}
          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg inter-medium transition-colors text-sm"
        >
          Send Job Post
        </button>
        </div>
      </div>


      <div className="flex justify-end">
       
      </div>
    </div>
  );
};


const SelectJobPostPopup = ({ isOpen, onClose, onSendJobPost }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4  border-gray-200">
          <h2 className="text-lg sm:text-xl archivo-bold  text-gray-900">Select Job Post</h2>
          <button 
            onClick={onClose}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
           {proposalsData
            .filter(trip => trip.status === "Open for Proposals")
            .map((trip) => (
                <TripCard 
                key={trip.id} 
                trip={trip} 
                onSendJobPost={onSendJobPost}
                />
            ))}

          </div>
        </div>

        {/* Footer */}
        {/* <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SelectJobPostPopup; 