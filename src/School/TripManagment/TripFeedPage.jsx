import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, CircleCheck } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TripFeedbackPage() {
  const [overallRating, setOverallRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [busConditionRating, setBusConditionRating] = useState(0);
  const [driverBehaviorRating, setDriverBehaviorRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedQuickFeedback, setSelectedQuickFeedback] = useState(['ontime']);
  const [trip, setTrip] = useState({});
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { tripId, driverId } = useParams();
  const navigate = useNavigate();
  const baseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';

  const quickFeedbackOptions = [
    { id: 'ontime', label: 'On time pickup' },
    { id: 'clean', label: 'Clean vehicle' },
    { id: 'safe', label: 'Safe driving' },
    { id: 'polite', label: 'Polite driver' },
    { id: 'comfortable', label: 'Comfortable ride' },
    { id: 'clear', label: 'Clear communication' },
    { id: 'professional', label: 'Professional service' },
    { id: 'recommend', label: 'Would recommend' },
    { id: 'smooth', label: 'Smooth drop-off' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error('Authentication required. Please log in.');
          navigate('/login');
          return;
        }

        // Fetch trip details
        const tripResponse = await axios.get(`${baseUrl}/school/trip-by/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch driver details
        const driverResponse = await axios.get(`${baseUrl}/school/driver/${driverId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Format trip data
        const trip = tripResponse.data.trip;
        const formattedTrip = {
          id: trip._id || 'unknown',
          title: trip.tripName || 'Unknown',
          status: trip.tripStatus
            ? trip.tripStatus.toLowerCase() === 'published'
              ? 'Pending'
              : trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1).toLowerCase()
            : 'Unknown',
          type: trip.tripType === 'onetime' ? 'One-time' : 'Recurring',
          date:
            trip.tripType === 'recurring'
              ? (trip.recurringDays?.join(', ').toUpperCase() || 'N/A')
              : (trip.tripDate
                  ? new Date(trip.tripDate).toLocaleDateString()
                  : 'N/A'),
          students: trip.numberOfStudents || 0,
          route: trip.pickupPoints && trip.destination
            ? `${trip.pickupPoints
                .map((p) => p.address || 'Unknown')
                .join(' → ')} → ${trip.destination.address || 'Unknown'}`
            : 'Unknown Route',
          duration: trip.tripDistanceMeta?.duration || 'N/A',
        };

        // Format driver data
        const dUser = driverResponse.data.user || {};
        const dProfile = driverResponse.data.profile || {};
        const formattedDriver = {
          id: dUser._id || 'unknown',
          name: dUser.name || 'Unknown',
          email: dUser.email || 'N/A',
          phone: dUser.phone || 'N/A',
          profileImage: dUser.profileImage || null,
          accountStatus: dUser.accountStatus || 'N/A',
          isOnline: dUser.is_online ?? false,
          lastSeen: dUser.last_seen
            ? new Date(dUser.last_seen).toLocaleString()
            : 'N/A',
          address: dProfile.address || 'N/A',
          cnicNumber: dProfile.cnicNumber || 'N/A',
          cnicFrontImage: dProfile.cnicFrontImage || null,
          cnicBackImage: dProfile.cnicBackImage || null,
          drivingLicenseImage: dProfile.drivingLicenseImage || null,
          vehicleRegistrationImage: dProfile.vehicleRegistrationImage || null,
          joinedDate: dProfile.joinedDate
            ? new Date(dProfile.joinedDate).toLocaleDateString()
            : 'N/A',
        };

        setTrip(formattedTrip);
        setDriver(formattedDriver);
      } catch (err) {
        console.error('Error fetching data:', err.response || err.message);
        setError(err.response?.data?.message || 'Failed to load trip or driver details');
        toast.error(err.response?.data?.message || 'Failed to load trip or driver details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, driverId, navigate]);

  const handleQuickFeedbackToggle = (optionId) => {
    setSelectedQuickFeedback((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const renderStarRating = (rating, setRating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            <Star
              size={20}
              className={`${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              } transition-colors cursor-pointer`}
            />
          </button>
        ))}
      </div>
    );
  };

 const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      // Validate ratings
      if (overallRating < 1 || overallRating > 5) {
        toast.error('Please provide an overall rating');
        return;
      }
      if (punctualityRating < 1 || punctualityRating > 5) {
        toast.error('Please provide a punctuality rating');
        return;
      }
      if (busConditionRating < 1 || busConditionRating > 5) {
        toast.error('Please provide a bus condition rating');
        return;
      }
      if (driverBehaviorRating < 1 || driverBehaviorRating > 5) {
        toast.error('Please provide a driver behavior rating');
        return;
      }
      if (communicationRating < 1 || communicationRating > 5) {
        toast.error('Please provide a communication rating');
        return;
      }

      // Map quick feedback options to the API format
      const quickFeedback = {
        onTimePickup: selectedQuickFeedback.includes('ontime'),
        cleanVehicle: selectedQuickFeedback.includes('clean'),
        safeDriving: selectedQuickFeedback.includes('safe'),
        politeDriver: selectedQuickFeedback.includes('polite'),
        comfortableRide: selectedQuickFeedback.includes('comfortable'),
        goodCommunication: selectedQuickFeedback.includes('clear'),
        professionalService: selectedQuickFeedback.includes('professional'),
        wouldRecommend: selectedQuickFeedback.includes('recommend'),
        smoothDropOff: selectedQuickFeedback.includes('smooth'),
      };

      const payload = {
        tripId,
        driverId,
        rating: {
          overall: overallRating,
          punctuality: punctualityRating,
          busCondition: busConditionRating,
          driverBehavior: driverBehaviorRating,
          communication: communicationRating,
        },
        comment: feedback || '',
        quickFeedback,
      };

      const response = await axios.post(`${baseUrl}/school/submit-review`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data.message || 'Feedback submitted successfully!');
      navigate('/trip-management');
    } catch (err) {
      console.error('Error submitting feedback:', err.response || err.message);
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <button
          onClick={() => navigate('/trip-management')}
          className="flex items-center text-gray-600 hover:text-gray-900 inter-medium text-sm mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Trip Management
        </button>
      </div>

      {/* Success Banner */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg p-4 flex items-center">
          <div className="ml-3">
            <h3 className="text-lg flex archivo-semibold">
              <CircleCheck className="h-6 w-6 mr-1 text-green-600" />
              Trip Completed Successfully!
            </h3>
            <p className="text-sm text-gray-700 inter-regular mt-1">
              Please rate your experience and provide feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Driver Information & Trip Summary */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg inter-semibold text-gray-900 mb-6">Driver Information</h2>
              {loading ? (
                <Skeleton height={80} width="100%" />
              ) : driver.id ? (
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 last:mb-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                      {driver.profileImage ? (
                        <img
                          src={driver.profileImage}
                          alt={driver.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {driver.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="inter-semibold text-gray-900">{driver.name}</h3>
                      <p className="text-sm inter-regular text-gray-600">{driver.address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Driver not assigned yet</p>
              )}
            </div>

            {/* Trip Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg inter-semibold text-gray-900 mb-6">Trip Summary</h2>
              {loading ? (
                <Skeleton height={150} width="100%" />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm inter-medium text-gray-900">Trip Name</p>
                      <p className="text-sm inter-regular text-gray-600 flex">
                        <MapPin size={16} className="text-gray-500 my-auto mr-2 flex-shrink-0" />
                        {trip.title || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm inter-medium text-gray-900">Date</p>
                      <p className="text-sm inter-regular flex text-gray-600">
                        <Calendar size={16} className="text-gray-500 my-auto mr-2 flex-shrink-0" />
                        {trip.date || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm inter-medium text-gray-900">Route</p>
                      <p className="text-sm inter-regular text-gray-600 flex">
                        <MapPin size={16} className="text-gray-500 mr-2 my-auto flex-shrink-0" />
                        {trip.route || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm inter-medium text-gray-900">Students</p>
                      <p className="text-sm flex inter-regular text-gray-600">
                        <Users size={16} className="text-gray-500 my-auto mr-2 flex flex-shrink-0" />
                        {trip.students ? `${trip.students} students` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm inter-medium text-gray-900">Duration</p>
                      <p className="text-sm inter-regular text-gray-600 flex">
                        <Clock size={16} className="text-gray-500 my-auto mr-2 flex-shrink-0" />
                        {trip.duration || '6 hours 30 minutes'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Rating and Feedback (Separate Cards) */}
          <div className="space-y-6">
            {/* Rate Your Experience Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg inter-semibold text-gray-900 mb-6">Rate Your Experience</h2>
              {/* Overall Experience */}
              <div className="mb-8">
                <h3 className="text-base inter-medium text-gray-900 mb-2">Overall Experience</h3>
                <p className="text-sm inter-regular text-gray-600 mb-4">
                  How would you rate this trip overall?
                </p>
                <div className="flex   mb-4">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="focus:outline-none  focus:ring-2 focus:ring-red-500 rounded p-1"
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= overallRating
                              ? 'fill-yellow-400  text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          } transition-colors cursor-pointer`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="">
                  <span className="text-sm inter-regular text-gray-500">
                    {overallRating === 0
                      ? 'Not rated'
                      : overallRating <= 2
                      ? 'Poor'
                      : overallRating === 3
                      ? 'Average'
                      : overallRating === 4
                      ? 'Good'
                      : 'Excellent'}
                  </span>
                </div>
              </div>

              {/* Four Column Rating Layout */}
              <div className="grid md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <div className="">
                  <div className="mb-2">
                    <span className="text-sm inter-medium text-gray-700">Punctuality</span>
                  </div>
                  {renderStarRating(punctualityRating, setPunctualityRating)}
                </div>
                <div className="">
                  <div className="mb-2">
                    <span className="text-sm inter-medium text-gray-700">Bus Condition</span>
                  </div>
                  {renderStarRating(busConditionRating, setBusConditionRating)}
                </div>
                <div className="">
                  <div className="mb-2">
                    <span className="text-sm inter-medium text-gray-700">Driver Behavior</span>
                  </div>
                  {renderStarRating(driverBehaviorRating, setDriverBehaviorRating)}
                </div>
                <div className="">
                  <div className="mb-2">
                    <span className="text-sm inter-medium text-gray-700">Communication</span>
                  </div>
                  {renderStarRating(communicationRating, setCommunicationRating)}
                </div>
              </div>
              {/* Additional Comments Card */}
              <div className="mt-5">
                <h3 className="text-base inter-medium text-gray-900 mb-2">
                  Additional Comments (Optional)
                </h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience, suggestions, or any comments..."
                  className="w-full px-3 py-3 border outline-none border-gray-300 rounded-lg focus:ring-red-600 resize-none text-sm"
                  rows={4}
                />
              </div>
            </div>

            {/* Quick Feedback Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base inter-medium text-gray-900 mb-4">
                Quick Feedback (Select all that apply)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2  whitespace-nowrap 2xl:grid-cols-3  gap-3">
                {quickFeedbackOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedQuickFeedback.includes(option.id)}
                      onChange={() => handleQuickFeedbackToggle(option.id)}
                      className="h-4 w-4 text-white focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm inter-regular text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs inter-regular text-gray-500 mt-6 mb-6">
                Your feedback helps us improve our service and helps other schools make better choices.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex mb-4 flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/trip-management')}
                className="px-6 py-3 inter-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-6 py-3 inter-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 text-sm font-medium"
              >
                Submit Feedback
              </button>
            </div>
          </div>



          
        </div>
      </div>
    </div>
  );
}