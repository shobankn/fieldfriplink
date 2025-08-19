import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/58B3CDAD-6BA1-480A-BA32-DC545C78A96A[1] 1 1.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BsMap } from 'react-icons/bs';
import Modal from 'react-modal';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';

// Set the app element for react-modal (accessibility requirement)
Modal.setAppElement('#root');

const Register = () => {
  const [activeTab, setActiveTab] = useState('School');
  const [formData, setFormData] = useState({
    UserName: '',
    email: '',
    phone: '',
    password: '',
    schoolName: '',
    location: '',
    city: '',
    cnicNumber: '',
    schoolId: '',
    cnicFront: null,
    cnicBack: null,
    driversLicense: null,
    vehicleRegistrationDocument: null,
    lat: 31.5204,
    lng: 74.3587
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places.length === 0) return;
      const place = places[0];
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      let city = '';
      place.address_components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
      });
      setFormData({
        ...formData,
        location: address,
        city: city || formData.city,
        lat: lat,
        lng: lng,
      });
      setIsMapOpen(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(phone);
  };

  const validateCNIC = (cnic) => {
    const re = /^\d{5}-\d{7}-\d{1}$/;
    return re.test(cnic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (activeTab === 'Driver') {
      // Validate required fields for driver
      const requiredFields = [
        { key: 'UserName', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'password', label: 'Password' },
        { key: 'cnicNumber', label: 'CNIC Number' },
        { key: 'city', label: 'City' },
        { key: 'schoolId', label: 'School ID' },
        { key: 'cnicFront', label: 'CNIC Front Image' },
        { key: 'cnicBack', label: 'CNIC Back Image' },
        { key: 'driversLicense', label: "Driver's License" },
        { key: 'vehicleRegistrationDocument', label: 'Vehicle Registration Document' }
      ];

      for (const field of requiredFields) {
        if (!formData[field.key]) {
          setError(`Please fill in the ${field.label} field`);
          toast.error(`Please fill in the ${field.label} field`);
          setLoading(false);
          return;
        }
      }

      // Additional validations
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError('Please enter a valid phone number (10-15 digits)');
        toast.error('Please enter a valid phone number (10-15 digits)');
        setLoading(false);
        return;
      }

      if (!validateCNIC(formData.cnicNumber)) {
        setError('Please enter a valid CNIC number (xxxxx-xxxxxxx-x)');
        toast.error('Please enter a valid CNIC number (xxxxx-xxxxxxx-x)');
        setLoading(false);
        return;
      }

      // Validate file types
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const files = [
        { file: formData.cnicFront, name: 'CNIC Front' },
        { file: formData.cnicBack, name: 'CNIC Back' },
        { file: formData.driversLicense, name: "Driver's License" },
        { file: formData.vehicleRegistrationDocument, name: 'Vehicle Registration' }
      ];

      for (const { file, name } of files) {
        if (file && !validImageTypes.includes(file.type)) {
          setError(`Please upload a valid image file (JPEG/PNG) for ${name}`);
          toast.error(`Please upload a valid image file (JPEG/PNG) for ${name}`);
          setLoading(false);
          return;
        }
      }

      // Prepare form data for driver API
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.UserName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('cnicNumber', formData.cnicNumber);
      formDataToSend.append('city', formData.city); // Changed from address to city
      formDataToSend.append('schoolId', formData.schoolId);
      formDataToSend.append('drivingLicenseImage', formData.driversLicense);
      formDataToSend.append('cnicFrontImage', formData.cnicFront);
      formDataToSend.append('cnicBackImage', formData.cnicBack);
      formDataToSend.append('vehicleRegistrationImage', formData.vehicleRegistrationDocument);

      try {
        const response = await fetch('https://fieldtriplinkbackend-production.up.railway.app/api/auth/register-driver', {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Driver registered successfully!');
          toast.success('Driver registered successfully!');
          setFormData({
            UserName: '',
            email: '',
            phone: '',
            password: '',
            cnicNumber: '',
            schoolId: '',
            city: '',
            cnicFront: null,
            cnicBack: null,
            driversLicense: null,
            vehicleRegistrationDocument: null,
            schoolName: '',
            location: '',
            lat: 31.5204,
            lng: 74.3587
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.message || 'Failed to register driver. Please check your inputs and try again.');
          toast.error(data.message || 'Failed to register driver. Please check your inputs and try again.');
        }
      } catch (err) {
        setError('Network error occurred. Please check your connection and try again.');
        toast.error('Network error occurred. Please check your connection and try again.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // School admin registration (unchanged)
      const requiredFields = ['UserName', 'email', 'password', 'schoolName', 'city', 'location'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in the ${field} field`);
          toast.error(`Please fill in the ${field} field`);
          setLoading(false);
          return;
        }
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const dataToSend = {
        name: formData.UserName,
        email: formData.email,
        password: formData.password,
        schoolName: formData.schoolName,
        location: {
          city: formData.city,
          fullAddress: formData.location,
          coordinates: {
            lat: formData.lat,
            lng: formData.lng
          }
        }
      };

      try {
        const response = await fetch('https://fieldtriplinkbackend-production.up.railway.app/api/auth/register-school', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('School admin registered successfully!');
          toast.success('School admin registered successfully!');
          setFormData({
            UserName: '',
            email: '',
            phone: '',
            password: '',
            cnicNumber: '',
            schoolId: '',
            city: '',
            cnicFront: null,
            cnicBack: null,
            driversLicense: null,
            vehicleRegistrationDocument: null,
            schoolName: '',
            location: '',
            lat: 31.5204,
            lng: 74.3587
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.message || 'Failed to register school admin. Please try again.');
          toast.error(data.message || 'Failed to register school admin. Please try again.');
        }
      } catch (err) {
        setError('Network error occurred. Please check your connection and try again.');
        toast.error('Network error occurred. Please check your connection and try again.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
      </div>
      <div className="w-full lg:w-[55%] bg-[#f9fafb] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-10 lg:py-10">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Create your Account</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">Join thousands of schools and drivers</p>

        <div className="flex mb-6 w-full sm:w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[4px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#de3b40] rounded-[8px] transition-transform duration-300 ease-in-out ${
                activeTab === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveTab('School')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 ${
                activeTab === 'School' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              School
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Driver')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 ${
                activeTab === 'Driver' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              Driver
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-5 lg:mt-[20px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Username</label>
              <input
                type="text"
                name="UserName"
                value={formData.UserName}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
              />
            </div>
            <div>
              <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
              />
            </div>
            <div>
              <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone (e.g., 03001234567)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
              />
            </div>

            {activeTab === 'School' && (
              <>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    placeholder="Enter your school name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      placeholder="Enter school location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base pl-10"
                      readOnly
                      onClick={() => setIsMapOpen(true)}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <BsMap />
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Driver' && (
              <>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">CNIC Number</label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your CNIC number (e.g., 35202-1234567-1)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">School ID</label>
                    <input
                      type="text"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      placeholder="Enter school ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your service city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold1">CNIC Front</label>
                    <input
                      type="file"
                      name="cnicFront"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">CNIC Back</label>
                    <input
                      type="file"
                      name="cnicBack"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Driver's License</label>
                  <input
                    type="file"
                    name="driversLicense"
                    accept="image/jpeg,image/png"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Vehicle Registration Document</label>
                  <input
                    type="file"
                    name="vehicleRegistrationDocument"
                    accept="image/jpeg,image/png"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 text-[#de3b40] focus:ring-[#de3b40] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm lg:text-[14px] text-[#666666] interregular">
                I agree to the{' '}
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
              ) : null}
              {loading ? 'Processing...' : 'Create Account'}
            </button>

            {error && <p className="text-red-500 text-sm lg:text-[14px] interregular mt-4 text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm lg:text-[14px] interregular mt-4 text-center">{success}</p>}

            <p className="text-center text-sm lg:text-[14px] interregular mt-4">
              Already have an account?{' '}
              <button
                onClick={handleSignIn}
                className="text-[#de3b40] inter-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
        <ToastContainer />

        <Modal
          isOpen={isMapOpen}
          onRequestClose={() => setIsMapOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: '800px',
              height: '500px',
              padding: 0,
              overflow: 'hidden'
            }
          }}
        >
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY_HERE" libraries={['places']}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: formData.lat, lng: formData.lng }}
              zoom={13}
            >
              <StandaloneSearchBox
                onLoad={onSearchBoxLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Search for location"
                  style={{
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    width: '240px',
                    height: '32px',
                    padding: '0 12px',
                    borderRadius: '3px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    fontSize: '14px',
                    outline: 'none',
                    textOverflow: 'ellipses',
                    position: 'absolute',
                    left: '50%',
                    top: '10px',
                    marginLeft: '-120px'
                  }}
                />
              </StandaloneSearchBox>
              <Marker position={{ lat: formData.lat, lng: formData.lng }} />
            </GoogleMap>
          </LoadScript>
        </Modal>
      </div>
    </div>
  );
};

export default Register;