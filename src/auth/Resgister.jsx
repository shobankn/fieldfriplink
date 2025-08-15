import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/58B3CDAD-6BA1-480A-BA32-DC545C78A96A[1] 1 1.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    vehicleRegistrationDocument: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (activeTab === 'Driver') {
      // Validate required fields for driver
      const requiredFields = ['UserName', 'email', 'phone', 'password', 'cnicNumber', 'city', 'schoolId', 'cnicFront', 'cnicBack', 'driversLicense', 'vehicleRegistrationDocument'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in the ${field} field`);
          toast.error(`Please fill in the ${field} field`);
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
      formDataToSend.append('city', formData.city);
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
          // Reset form
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
            city: ''
          });
          // Redirect to /login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.message || 'Failed to register driver. Please try again.');
          toast.error(data.message || 'Failed to register driver. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while registering. Please check your network or try again later.');
        toast.error('An error occurred while registering. Please check your network or try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Validate required fields for school admin
      const requiredFields = ['UserName', 'email', 'password', 'schoolName', 'city', 'location'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in the ${field} field`);
          toast.error(`Please fill in the ${field} field`);
          setLoading(false);
          return;
        }
      }

      // Prepare data for school admin API
      const dataToSend = {
        name: formData.UserName,
        email: formData.email,
        password: formData.password,
        schoolName: formData.schoolName,
        location: {
          city: formData.city,
          fullAddress: formData.location,
          coordinates: {
            lat: 31.5204,
            lng: 74.3587
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
          // Reset form
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
            city: ''
          });
          // Redirect to /login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.message || 'Failed to register school admin. Please try again.');
          toast.error(data.message || 'Failed to register school admin. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while registering. Please check your network or try again later.');
        toast.error('An error occurred while registering. Please check your network or try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[55%] bg-[#f9fafb] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-10 lg:py-10">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Create your Account</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">Join thousands of schools and drivers</p>

        {/* Toggle */}
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
            {/* Common Fields */}
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
                placeholder="Enter your phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
              />
            </div>

            {/* School Specific Fields */}
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
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter school location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
                  />
                </div>
              </>
            )}

            {/* Driver Specific Fields */}
            {activeTab === 'Driver' && (
              <>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">CNIC Number</label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your CNIC number"
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
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">CNIC Front</label>
                    <input
                      type="file"
                      name="cnicFront"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm lg:text-[14px] inter-semibold mb-1">CNIC Back</label>
                    <input
                      type="file"
                      name="cnicBack"
                      accept="image/*"
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
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Vehicle Registration Document</label>
                  <input
                    type="file"
                    name="vehicleRegistrationDocument"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base bg-white"
                  />
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#de3b40] focus:border-[#de3b40] outline-none text-sm lg:text-base"
              />
            </div>

            {/* Terms and Privacy */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 text-[#de3b40] focus:ring-[#de3b40] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm lg:text-[14px] text-[#666666] interregular">
                I agree to the{' '}
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#de3b40] hover:underline inter-semibold">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button with Spinner */}
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

            {/* Error/Success Messages */}
            {error && <p className="text-red-500 text-sm lg:text-[14px] interregular mt-4 text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm lg:text-[14px] interregular mt-4 text-center">{success}</p>}

            {/* Sign In Link */}
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
      </div>
    </div>
  );
};

export default Register;