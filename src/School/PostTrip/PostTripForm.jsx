import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FileText, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TimePicker from 'react-time-picker';
import TimeForm from './SelectTime';
import CustomTimePicker from './SelectTime';
import DatePickerComponent from './CustomDatePicker';


const PostTripForm = () => {
  const [formData, setFormData] = useState({
    tripName: '',
    tripType: 'One-time',
    pickupTime: '',
    returnTime: '',
    tripDate: '',
    recurringDays: [],
    pickupAddresses: [''],
    destination: '',
    numberOfStudents: '',
    busCapacity: '',
    preferredGender: 'No preference',
    extraInstructions: ''
  });

  const [activeTab, setActiveTab] = useState('one-time');
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const dateInputRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const returnTimeRef = useRef(null);
  // At the top of your PostTripForm component
const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  


  const BaseUrl = 'https://fieldtriplinkbackend-production.up.railway.app/api';


  const removePickupAddress = (index) => {
  setFormData((prev) => ({
    ...prev,
    pickupAddresses: prev.pickupAddresses.filter((_, i) => i !== index),
  }));
};


  const validateForm = () => {
    const newErrors = {};

    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Trip Name is required';
    }
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup Time is required';
    }
    if (!formData.returnTime) {
      newErrors.returnTime = 'Return Time is required';
    }
    if (activeTab === 'one-time' && !formData.tripDate) {
      newErrors.tripDate = 'Trip Date is required for one-time trips';
    }
    if (activeTab === 'recurring' && formData.recurringDays.length === 0) {
      newErrors.recurringDays = 'At least one recurring day must be selected';
    }
    if (formData.pickupAddresses.some(addr => !addr.trim())) {
      newErrors.pickupAddresses = 'All pickup addresses must be filled';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.numberOfStudents || formData.numberOfStudents <= 0) {
      newErrors.numberOfStudents = ' students must be greater than 0';
    }
    if (!formData.busCapacity || formData.busCapacity <= 0) {
      newErrors.busCapacity = 'Bus capacity must be greater than 0';
    }

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      toast.error(newErrors[errorKeys[0]]);
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePickupAddressChange = (index, value) => {
    setFormData(prev => {
      const updatedAddresses = [...prev.pickupAddresses];
      updatedAddresses[index] = value;
      return {
        ...prev,
        pickupAddresses: updatedAddresses
      };
    });
    setErrors(prev => ({ ...prev, pickupAddresses: '' }));
  };

  const addPickupAddress = () => {
    setFormData(prev => ({
      ...prev,
      pickupAddresses: [...prev.pickupAddresses, '']
    }));
  };

  const toggleRecurringDay = (day) => {
    setFormData(prev => {
      const daysMap = { 'M': 'mon', 'T': 'tue', 'W': 'wed', 'Th': 'thu', 'F': 'fri', 'S': 'sat' };
      const apiDay = daysMap[day];
      const days = prev.recurringDays.includes(apiDay)
        ? prev.recurringDays.filter(d => d !== apiDay)
        : [...prev.recurringDays, apiDay];
      return {
        ...prev,
        recurringDays: days
      };
    });
    setErrors(prev => ({ ...prev, recurringDays: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to post a trip.');
      setLoading(false);
      return;
    }

    const isOneTime = activeTab === 'one-time';
    const baseDate = formData.tripDate;


    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const dummyDate = `${year}-${month}-${day}`;




    const startTime = formData.pickupTime
      ? new Date(`${dummyDate}T${formData.pickupTime}:00Z`).toISOString()
      : undefined;

    const returnTime = formData.returnTime
      ? new Date(`${dummyDate}T${formData.returnTime}:00Z`).toISOString()
      : undefined;

    const payload = {
      tripName: formData.tripName,
      tripType: isOneTime ? 'onetime' : 'recurring',
      tripDate: isOneTime ? formData.tripDate : undefined,
      recurringDays: !isOneTime ? formData.recurringDays : undefined,
      startTime,
      returnTime,
      pickupPoints: formData.pickupAddresses.map(address => ({
        address
      })),
      destination: {
        address: formData.destination
      },
      numberOfStudents: formData.numberOfStudents,
      numberOfBuses: formData.busCapacity,
      preferredDriverGender:
        formData.preferredGender.toLowerCase() === 'no preference'
          ? 'any'
          : formData.preferredGender.toLowerCase(),
      instructions: formData.extraInstructions || undefined
    };

    try {
      const url = id
        ? `${BaseUrl}/school/trip/${id}`
        : `${BaseUrl}/school/trip`;
      const method = id ? 'put' : 'post';

      const response = await axios[method](url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(`Trip ${id ? 'updated' : 'posted'} successfully!`, {
        onClose: () => {
          navigate('/job-post');
        },
        autoClose: 2000,
      });
      console.log('API Response:', response.data);

      setFormData({
        tripName: '',
        tripType: 'One-time',
        pickupTime: '',
        returnTime: '',
        tripDate: '',
        recurringDays: [],
        pickupAddresses: [''],
        destination: '',
        numberOfStudents: '25',
        busCapacity: '30',
        preferredGender: 'No preference',
        extraInstructions: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${id ? 'update' : 'post'} trip. Please try again.`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("Edit mode activated, fetching trip with ID:", id);
      setIsEditing(true);

      const fetchTrip = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.warn('No token found in localStorage');
            return;
          }

          const res = await axios.get(`${BaseUrl}/school/trip-by/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const trip = res.data.trip;
          console.log('Fetched trip data:', trip);

          setFormData({
            tripName: trip.tripName || '',
            tripType: trip.tripType === 'recurring' ? 'Recurring' : 'One-time',
            pickupTime: trip.startTime
              ? new Date(trip.startTime).toISOString().slice(11, 16)
              : '',
            returnTime: trip.returnTime
              ? new Date(trip.returnTime).toISOString().slice(11, 16)
              : '',
            tripDate: trip.tripDate
              ? new Date(trip.tripDate).toISOString().slice(0, 10)
              : '',
            recurringDays: trip.recurringDays || [],
            pickupAddresses: trip.pickupPoints?.map(p => p.address) || [''],
            destination: trip.destination?.address || '',
            numberOfStudents: trip.numberOfStudents?.toString() || '',
            busCapacity: trip.numberOfBuses?.toString() || '',
            preferredGender:
              trip.preferredDriverGender === 'any'
                ? 'No preference'
                : trip.preferredDriverGender?.charAt(0).toUpperCase() +
                  trip.preferredDriverGender?.slice(1),
            extraInstructions: trip.instructions || '',
          });

          setActiveTab(
            trip.tripType === 'recurring' ? 'recurring' : 'one-time'
          );
        } catch (err) {
          console.error('Failed to fetch trip:', err);
          toast.error('Failed to fetch trip details.');
        }
      };

      fetchTrip();
    } else {
      console.warn('No ID found in URL params');
    }
  }, [id]);

  const handleDateContainerClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handlePickupTimeClick = () => {
    if (pickupTimeRef.current) {
      pickupTimeRef.current.showPicker();
    }
  };

  const handleReturnTimeClick = () => {
    if (returnTimeRef.current) {
      returnTimeRef.current.showPicker();
    }
  };


  

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className='px-5 py-1'>
        <h1 className="text-2xl md:text-3xl inter-bold text-gray-900">Post New Trip</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Create a new transportation request and find the best drivers.</p>
      </div>
      <div className="max-w-full mx-auto">
        <form 
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 bg-white rounded-lg border border-gray-200 m-0 sm:m-4"
        >
          <div className="px-0 sm:px-6 ml-2 mr-2 sm:ml-4 mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    const regex = /^[A-Za-z\s]$/;
                    if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (!/^[A-Za-z\s]+$/.test(paste)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Daily Pickup Route A"
                  className={`w-full px-3 py-2 border ${
                    errors.tripName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`}
                />
                {errors.tripName && (
                  <p className="absolute text-red-500 text-xs mt-1">{errors.tripName}</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('one-time'); setFormData(prev => ({ ...prev, tripType: 'One-time' })); }}
                    className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'one-time' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('recurring'); setFormData(prev => ({ ...prev, tripType: 'Recurring' })); }}
                    className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'recurring' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Recurring
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-0 sm:px-6 ml-2 mr-2 sm:ml-4 mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">




              {/* <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time <span className="text-red-500">*</span>
                </label>

                  <div 
                    className={`relative flex items-center border rounded-lg transition-colors ${
                      errors.pickupTime ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
                    }`}
                    onClick={handlePickupTimeClick}
                  >
                    <input
                      type="time"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      ref={pickupTimeRef}
                      className={`w-full px-3 py-2 bg-transparent outline-none text-gray-900 rounded-lg
                        focus:ring-2 focus:ring-red-500 focus:border-red-500`} 
                    />
                  </div>
                
                {errors.pickupTime && (
                  <p className="absolute text-red-500 text-xs mt-1">{errors.pickupTime}</p>
                )}


              </div>


              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Time <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`relative flex items-center border rounded-lg transition-colors ${
                    errors.returnTime ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
                  }`}
                  onClick={handleReturnTimeClick}
                >
                  <input
                    type="time"
                    name="returnTime"
                    value={formData.returnTime}
                    onChange={handleInputChange}
                    ref={returnTimeRef}
                    className="w-full px-3 py-2 bg-transparent outline-none text-gray-900 rounded-lg "
                  />
                </div>
                {errors.returnTime && (
                  <p className="absolute text-red-500 text-xs mt-1">{errors.returnTime}</p>
                )}
               </div>  */}



                  <div className="relative flex-1">
                    <CustomTimePicker
                      label="Pickup Time"
                      value={formData.pickupTime}
                      onChange={(time) =>
                        setFormData((prev) => ({ ...prev, pickupTime: time }))
                      }
                      error={errors.pickupTime}
                    />
                  </div>

                  <div className="relative flex-1 mt-4 md:mt-0">
                    <CustomTimePicker
                      label="Return Time"
                      value={formData.returnTime}
                      onChange={(time) =>
                        setFormData((prev) => ({ ...prev, returnTime: time }))
                      }
                      error={errors.returnTime}
                    />
                </div> 





{/*               
              <div className="col-span-full lg:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'one-time' ? 'Trip Date' : 'Recurring Days'} 
                  <span className="text-red-500">*</span>
                </label>
                {activeTab === 'one-time' ? (
                  <div 
                    className={`relative flex items-center border rounded-lg transition-colors ${
                      errors.tripDate ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
                    }`}
                    onClick={handleDateContainerClick}
                  >
                    <input
                      type="date"
                      name="tripDate"
                      value={formData.tripDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      ref={dateInputRef}
                      className="w-full px-3 py-2 bg-transparent outline-none text-gray-900 rounded-lg "
                    />
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    {['M', 'T', 'W', 'Th', 'F', 'S'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleRecurringDay(day)}
                        className={`w-12 h-12 rounded-lg border 
                          ${formData.recurringDays.includes(
                            { M: 'mon', T: 'tue', W: 'wed', Th: 'thu', F: 'fri', S: 'sat' }[day]
                          )
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'} 
                          border-gray-300 flex items-center justify-center text-sm font-medium transition-colors`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
                {errors.tripDate && activeTab === 'one-time' && (
                  <p className="absolute text-red-500 text-xs mt-1">{errors.tripDate}</p>
                )}
                {errors.recurringDays && activeTab === 'recurring' && (
                  <p className="absolute text-red-500 text-xs mt-1">{errors.recurringDays}</p>
                )}
              </div> */}

              {/* Render the DatePickerComponent */}
      <DatePickerComponent

        activeTab={activeTab}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        handleDateContainerClick={handleDateContainerClick}
        toggleRecurringDay={toggleRecurringDay}
      />

              


              
            </div>
          </div>


<div className="px-0 sm:px-6 ml-2 mr-2 sm:ml-4 mt-4">
  <div className="flex items-center space-x-2 mb-6">
    <MapPin className="w-5 h-5 text-gray-600" />
    <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
  </div>

  <div className="space-y-3">
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pickup Addresses <span className="text-red-500">*</span>
      </label>

      {formData.pickupAddresses.map((address, index) => (
        <div key={index} className="relative mb-2">
          <input
            type="text"
            name={`pickupAddress-${index}`}
            value={address}
            onChange={(e) => handlePickupAddressChange(index, e.target.value)}
            className={`w-full pr-8 px-3 py-2 border ${
              errors.pickupAddresses && !address.trim()
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`}
            placeholder="Enter pickup address"
          />

          {/* Show ❌ only for sub pickup addresses (index > 0) */}
          {index > 0 && (
            <button
              type="button"
              onClick={() => removePickupAddress(index)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {errors.pickupAddresses && (
        <p className="text-red-500 text-xs mt-1">{errors.pickupAddresses}</p>
      )}

      <button
        type="button"
        onClick={addPickupAddress}
        className="mt-0 text-blue-500 text-sm font-medium hover:text-red-600 flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Another Pickup Point
      </button>
    </div>

    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Destination <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="destination"
        value={formData.destination}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 border ${
          errors.destination ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`}
        placeholder="School Campus or Event Venue"
      />
      {errors.destination && (
        <p className="absolute text-red-500 text-xs mt-1">
          {errors.destination}
        </p>
      )}
    </div>
  </div>
</div>










          <div className="px-0 sm:px-6 ml-2 mr-2 sm:ml-4 mt-4 lg:sticky lg:top-4 lg:self-start">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


             <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    No. of Students <span className="text-red-500">*</span>
  </label>
  <input
    type="number"
    name="numberOfStudents"
    value={formData.numberOfStudents}
    onChange={(e) => {
      const value = e.target.value;
      // ✅ Prevent negative values
      if (value >= 0 || value === "") {
        handleInputChange(e);
      }
    }}
    min="0" // ✅ Stops arrow down below 0
    onKeyDown={(e) => {
      if (["e", "E", "+", "-","."].includes(e.key)) {
        e.preventDefault();
      }
    }}
    className={`w-full px-3 py-2 border ${
      errors.numberOfStudents ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`}
    placeholder="25"
  />
  {errors.numberOfStudents && (
    <p className="absolute text-red-500 text-xs mt-1">
      {errors.numberOfStudents}
    </p>
  )}
</div>



              <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No of Buses <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="busCapacity"
              value={formData.busCapacity}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ Prevent negative values
                if (value >= 0 || value === "") {
                  handleInputChange(e);
                }
              }}
              min="0"  // ✅ Ensures arrow down won’t go below 0
              className={`w-full px-3 py-2 border ${
                errors.busCapacity ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`}
              placeholder="30"
              onKeyDown={(e) => {
                // ✅ Prevent invalid characters
                if (["e", "E", "+", "-","."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.busCapacity && (
              <p className="absolute text-red-500 text-xs mt-1">{errors.busCapacity}</p>
            )}
              </div>




             <div className="lg:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Driver Gender</label>
  <div className="relative">
    <div
      className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white text-gray-900"
      onClick={() => setShowGenderDropdown(!showGenderDropdown)}
    >
      {formData.preferredGender}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>

    {showGenderDropdown && (
      <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
        {["No preference", "Male", "Female"].map((option) => (
          <li
            key={option}
            onClick={() => {
              setFormData(prev => ({ ...prev, preferredGender: option }));
              setShowGenderDropdown(false);
            }}
            className={`px-3 py-2 cursor-pointer ${
              formData.preferredGender === option ? "bg-red-500 text-white" : "hover:bg-red-100 text-gray-900"
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>





              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra Instructions (Optional)</label>
                <textarea
                  name="extraInstructions"
                  value={formData.extraInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                  placeholder="e.g. Need female attendant, AC required, etc."
                />
              </div>
              <div className="flex mb-3 flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 lg:col-span-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-50 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className={`flex-1 cursor-pointer py-3 sm:py-2 bg-red-500 text-white rounded-lg transition inter-semibold text-sm sm:text-lg flex items-center justify-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'
                  }`}
                  aria-label="Submit property form"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      {isEditing ? 'Updating Trip...' : 'Posting Trip...'}
                    </>
                  ) : (
                    isEditing ? 'Update Trip' : 'Post Trip'
                  )}
                </motion.button>
              </div>
            </div>


          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTripForm;