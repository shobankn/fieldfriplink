import { Calendar, Clock, MapPin, Users, X } from "lucide-react";
import proposalsData from "../ProposalData";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from 'date-fns';



const TripCard = ({ trip,loading, onSendJobPost }) => {
   

  return (
    <>
    <ToastContainer/>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="inter-semibold text-gray-900 text-sm capitalize sm:text-base mb-1"> {loading ? <Skeleton width={120} /> : trip.tripName}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {loading ? (
              <Skeleton width={60} />
            ) : (
            <span className={`px-2 py-1 capitalize rounded-full text-xs inter-medium ${
              trip.tripType === 'onetime' ? 'bg-[#FFF4E5] text-[#F39C12] c' : 'bg-purple-100 text-purple-800'
            }`}>
              {trip.tripType}
            </span>
              )}

                <span className="inter-regular">
                  {loading ? (
                    <Skeleton width={80} />
                  ) : (

               <span className="text-sm inter-regular text-gray-500">  Created {formatDistanceToNow(new Date(trip.createdAt), { addSuffix: true })}</span>
                    
                   
                  )}
                </span>
                
          </div>
          
        </div>
        <span className={`px-3 py-2 inter-regular text-center  rounded-full text-[#44B25D] bg-[#EAF7ED] text-xs inter-medium  whitespace-nowrap`}>
          {loading ? (
          <Skeleton width={80} height={24} />
        ) : (
          <span className="px-3 py-2 inter-regular text-center rounded-full text-[#44B25D] bg-[#EAF7ED] text-xs inter-medium whitespace-nowrap">
              {trip.tripStatus}
          </span>
        )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-0 text-sm">
        <div className="flex items-center gap-1">
       <div>
  <div className="inter-regular text-[#6B7280]">Schedule:</div>

  {loading ? (
    <>
      <Skeleton width={160} /> {/* for Days/Date */}
      <Skeleton width={120} /> {/* for time range */}
    </>
  ) : (
    <>
      {trip.tripType === "recurring" ? (
        <>
          <span className="text-gray-900 inter-semibold capitalize">
            Days: {trip.recurringDays?.join(", ") || "N/A"}
          </span>
          <br />
        </>
      ) : (
        <>
          <span className="text-gray-900 inter-semibold capitalize">
            Date: {trip.tripDate?.split("T")[0] || "N/A"}
          </span>
          <br />
        </>
      )}

      <span className="text-[#4B5563] inter-regular">
        {new Date(trip.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>{" "}
      <span className="text-[#4B5563] inter-regular">-</span>{" "}
      <span className="text-[#4B5563] inter-regular">
        {new Date(trip.returnTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </>
  )}
</div>


        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inter-regular text-[#6B7280]">Students:</div>
           {loading ? (
            <Skeleton width={40} />
          ) : (
            <div className="text-[#1F2F3D] inter-semibold text-xs">
              {trip.numberOfStudents}
            </div>
          )}
          </div>
           <div>
            <div className="inter-regular text-[#6B7280]">Proposals:</div>
            {loading ? (
            <Skeleton width={40} />
          ) : (
            <div className="text-[#1F2F3D] inter-semibold text-xs">{trip.proposals?.length || 0}</div>
          )}
          </div>
        </div>
        <div className="flex justify-end items-end gap-2">
  {loading ? (
    <Skeleton width={100} height={36} /> // same size as button
  ) : (
    <button
      onClick={() => onSendJobPost(trip)}
      className="bg-red-600  cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg inter-medium transition-colors text-sm"
    >
      Send Job Post
    </button>
  )}
</div>

      </div>


      <div className="flex justify-end">
       
      </div>
    </div>
    </>
  
  );
};


const SelectJobPostPopup = ({ isOpen, onClose, onSendJobPost,driverId  }) => {
  const BaseUrl = "https://fieldtriplinkbackend-production.up.railway.app/api";
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
   const [sendingTripId, setSendingTripId] = useState(null);
  const [note, setNote] = useState("Please accept the invitation");

 useEffect(() => {
  if (!isOpen) return;

  const fetchTrips = async () => {
    const toastId = "fetchTripsError";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!toast.isActive(toastId)) {
          toast.error("Token not found. Please log in.", { toastId });
        }
        return;
      }

      const res = await axios.get(`${BaseUrl}/school/my-trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Handle special message here
      if (res.data?.message === "Driver already invited to this trip") {
        toast.warning(res.data.message);
        return; // stop if this message occurs
      }

      // Filter only published trips
      const publishedTrips = (res.data.trips || []).filter(
        (trip) => trip.tripStatus === "published"
      );

      setTrips(publishedTrips);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message || // ✅ show backend message if available
        err.message;
      if (!toast.isActive(toastId)) {
        toast.error(`Failed to fetch trips: ${errorMessage}`, { toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  fetchTrips();
}, [isOpen]);


  if (!isOpen) return null;

  return (
    <>

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
            {loading
            ? [...Array(3)].map((_, idx) => (
                <TripCard key={idx} loading={true} trip={{}} />
              ))
            : trips.map((trip) => (
                <TripCard 
                  key={trip._id}
                  trip={trip}
                  loading={false}
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
    </>
 
  );
};

export default SelectJobPostPopup; 