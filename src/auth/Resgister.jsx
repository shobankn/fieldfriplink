import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BsMap } from 'react-icons/bs';
import { HiUpload } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';

const Register = () => {
  const initialFormData = {
    UserName: '',
    email: '',
    phone: '',
    password: '',
    schoolName: '',
    location: '',
    city: '',
    schoolId: '',
    cnicFront: null,
    cnicBack: null,
    driversLicense: null,
    vehicleRegistrationDocument: null,
    lat: 31.5204,
    lng: 74.3587,
   hourlyRate: '', 
  };

  const [activeTab, setActiveTab] = useState('School');
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cnicFrontRef = useRef(null);
  const cnicBackRef = useRef(null);
  const driversLicenseRef = useRef(null);
  const vehicleRegistrationRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('https://fieldtriplinkbackend-production.up.railway.app/api/auth/school-list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSchools(data.data || []);
        } else {
          toast.error('Failed to fetch schools', { toastId: 'fetch-schools-error' });
        }
      } catch (err) {
        toast.error('Error fetching schools', { toastId: 'fetch-schools-error' });
        console.error('API Error:', err);
      }
    };
    fetchSchools();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    // For phone input, allow only numeric values
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'file' ? files[0] : value
      });
    }
  };

  const handleSchoolSelect = (school) => {
    setFormData({
      ...formData,
      schoolId: school._id,
      schoolName: school.schoolName
    });
    setIsDropdownOpen(false);
  };

  const handleFileClick = (ref) => {
    ref.current.click();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  // Handle logo click to navigate to home page
  const handleLogoClick = () => {
    navigate('/');
  };

  const validateEmail = (email) => {
    // Stricter email validation: no consecutive dots, no repeated TLDs, valid characters
    const re = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) return false;
    // Additional check to prevent repeated TLDs like .com.com
    if (email.match(/(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})$/)) return false;
    return true;
  };

  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (activeTab === 'Driver') {
      const requiredFields = [
        { key: 'UserName', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'password', label: 'Password' },
        { key: 'city', label: 'City' }
      ];

      for (const field of requiredFields) {
        if (!formData[field.key]) {
          setError(`Please fill in the ${field.label} field`);
          toast.error(`Please fill in the ${field.label} field`, { toastId: 'field-error' });
          setLoading(false);
          return;
        }
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address (e.g., example@domain.com)');
        toast.error('Please enter a valid email address (e.g., example@domain.com)', { toastId: 'email-error' });
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError('Please enter a valid phone number (10-15 digits)');
        toast.error('Please enter a valid phone number (10-15 digits)', { toastId: 'phone-error' });
        setLoading(false);
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters long');
        toast.error('Password must be at least 8 characters long', { toastId: 'password-error' });
        setLoading(false);
        return;
      }

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
          toast.error(`Please upload a valid image file (JPEG/PNG) for ${name}`, { toastId: 'image-error' });
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.UserName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('hourlyRate', formData.hourlyRate);
      if (formData.schoolId) formDataToSend.append('schoolId', formData.schoolId);
      if (formData.driversLicense) formDataToSend.append('drivingLicenseImage', formData.driversLicense);
      if (formData.cnicFront) formDataToSend.append('cnicFrontImage', formData.cnicFront);
      if (formData.cnicBack) formDataToSend.append('cnicBackImage', formData.cnicBack);
      if (formData.vehicleRegistrationDocument) formDataToSend.append('vehicleRegistrationImage', formData.vehicleRegistrationDocument);

      try {
        const response = await fetch('https://fieldtriplinkbackend-production.up.railway.app/api/auth/register-driver', {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Driver registered successfully!');
          toast.success('Driver registered successfully!', { toastId: 'driver-success' });
          setFormData(initialFormData);
          setTimeout(() => {
            navigate('/login', { state: { userType: 'Driver' } });
          }, 2000);
        } else {
          if (data.message) {
            setError(data.message);
            toast.error(data.message, { toastId: 'driver-error' });
          } else {
            setError('Unknown server error');
            toast.error('Unknown server error', { toastId: 'driver-error' });
          }
        }
      } catch (err) {
        const errorMessage = 'Network error: Please check your connection';
        setError(errorMessage);
        toast.error(errorMessage, { toastId: 'network-error' });
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const requiredFields = ['UserName', 'email', 'phone', 'password', 'schoolName', 'city', 'location'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in the ${field} field`);
          toast.error(`Please fill in the ${field} field`, { toastId: 'field-error' });
          setLoading(false);
          return;
        }
      }


      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address (e.g., example@domain.com)');
        toast.error('Please enter a valid email address (e.g., example@domain.com)', { toastId: 'email-error' });
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError('Please enter a valid phone number (10-15 digits)');
        toast.error('Please enter a valid phone number (10-15 digits)', { toastId: 'phone-error' });
        setLoading(false);
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters long');
        toast.error('Password must be at least 8 characters long', { toastId: 'password-error' });
        setLoading(false);
        return;
      }

     


      const dataToSend = {
        name: formData.UserName,
        email: formData.email,
        phoneNumber: formData.phone,
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
          toast.success('School admin registered successfully!', { toastId: 'school-success' });
          setFormData(initialFormData);
          setTimeout(() => {
            navigate('/login', { state: { userType: 'School' } });
          }, 2000);
        } else {
          if (data.error) {
            setError(data.error);
            toast.error(data.error, { toastId: 'school-error' });
          } else {
            setError('Unknown server error');
            toast.error('Unknown server error', { toastId: 'school-error' });
          }
        }
      } catch (err) {
        const errorMessage = 'Network error: Please check your connection';
        setError(errorMessage);
        toast.error(errorMessage, { toastId: 'network-error' });
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData(initialFormData);
    setIsDropdownOpen(false);
  };

  // Truncate file name to 30 characters
  const truncateFileName = (name) => {
    if (name && name.length > 30) {
      return name.substring(0, 27) + '...';
    }
    return name;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
        </div>
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
              onClick={() => handleTabChange('School')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === 'School' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              School
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('Driver')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter school location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black pr-10"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      <BsMap />
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Driver' && (
              <>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">School (Optional)</label>
                    <div className="relative" ref={dropdownRef}>
                      <div
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm lg:text-base flex items-center cursor-pointer ${
                          formData.schoolName ? 'bg-blue-50' : 'bg-transparent'
                        }`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={`flex-1 truncate ${formData.schoolName ? 'text-black' : 'text-gray-400'}`}>
                          {formData.schoolName || 'Select a school (optional)'}
                        </span>
                        <IoChevronDown
                          className={`text-gray-500 transform transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {schools.length > 0 ? (
                            schools.map((school) => (
                              <div
                                key={school._id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm lg:text-base text-gray-700"
                                onClick={() => handleSchoolSelect(school)}
                              >
                                {school.schoolName} ({school.address.city})
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm lg:text-base text-gray-500">
                              No schools available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your service city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black"
                    />
                  </div>

                  
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">State Drivers License</label>
                    <div
                      className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent flex items-center cursor-pointer overflow-hidden"
                      onClick={() => handleFileClick(cnicFrontRef)}
                    >
                      <span className={`flex-1 truncate ${formData.cnicFront ? 'text-black' : 'text-gray-400'}`}>
                        {formData.cnicFront ? truncateFileName(formData.cnicFront.name) : 'State Drivers License'}
                      </span>
                      <HiUpload className="text-gray-500" />
                    </div>
                    <input
                      type="file"
                      name="cnicFront"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="hidden"
                      ref={cnicFrontRef}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">School bus driver certification card</label>
                    <div
                      className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent flex items-center cursor-pointer overflow-hidden"
                      onClick={() => handleFileClick(cnicBackRef)}
                    >
                      <span className={`flex-1 truncate ${formData.cnicBack ? 'text-black' : 'text-gray-400'}`}>
                        {formData.cnicBack ? truncateFileName(formData.cnicBack.name) : 'School bus driver certification card'}
                      </span>
                      <HiUpload className="text-gray-500" />
                    </div>
                    <input
                      type="file"
                      name="cnicBack"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="hidden"
                      ref={cnicBackRef}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">BCI/FBI Background check verification papers</label>
                  <div
                    className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent flex items-center cursor-pointer overflow-hidden"
                    onClick={() => handleFileClick(driversLicenseRef)}
                  >
                    <span className={`flex-1 truncate ${formData.driversLicense ? 'text-black' : 'text-gray-400'}`}>
                      {formData.driversLicense ? truncateFileName(formData.driversLicense.name) : "BCI/FBI Background check verification papers"}
                    </span>
                    <HiUpload className="text-gray-500" />
                  </div>
                  <input
                    type="file"
                    name="driversLicense"
                    accept="image/jpeg,image/png"
                    onChange={handleInputChange}
                    className="hidden"
                    ref={driversLicenseRef}
                  />
                </div>

                <div>
  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">
    Hourly Rate (USD)
  </label>
  <input
    type="number"
    name="hourlyRate"
    value={formData.hourlyRate}
    onChange={handleInputChange}
    placeholder="Enter your hourly rate"
    min="0"
    step="1"
    className="w-full px-3 py-2 border border-gray-300 rounded-md 
               focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] 
               outline-none text-sm lg:text-base bg-transparent 
               placeholder-gray-400 text-black"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-transparent placeholder-gray-400 text-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
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
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold cursor-pointer">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold cursor-pointer">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center cursor-pointer ${
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

            <p className="text-center text-sm lg:text-[14px] interregular mt-4">
              Already have an account?{' '}
              <button
                onClick={handleSignIn}
                className="text-[#de3b40] inter-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;