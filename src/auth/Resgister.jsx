import React, { useState } from 'react';
import logo from '../images/58B3CDAD-6BA1-480A-BA32-DC545C78A96A[1] 1 1.png';

const Register = () => {
  const [activeTab, setActiveTab] = useState('School');
  const [formData, setFormData] = useState({
    // Common fields
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // School specific fields
    schoolName: '',
    location: '',
    
    // Driver specific fields
    companyName: '',
    cdlClass: '',
    cdlExpDate: '',
    drivingRecord: '',
    vehicleRegistration: '',
    schoolPartner: '',
    city: '',
    cnicFront: '',
    cnicBack: '',
    driversLicense: '',
    vehicleRegistrationDocument: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { activeTab, formData });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-full">
        <div className=" rounded-lg  overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Logo */}
            <div className="lg:  p-8 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="mx-auto w-48 h-48 md:w-64 md:h-64 lg:w-[500px] lg:h-auto object-contain"
                />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-2/3 p-8">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
                <p className="text-gray-600 mb-6 text-sm">Join thousands of schools and drivers</p>

                {/* Toggle Buttons */}
                <div className="flex mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('School')}
                    className={`flex-1 py-4 px-4 text-sm font-medium rounded-l-lg shadow-sm ${
                      activeTab === 'School'
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    School
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Driver')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg shadow-sm ${
                      activeTab === 'Driver'
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Driver
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Common Fields */}
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                    />
                  </div>

                  {/* School Specific Fields */}
                  {activeTab === 'School' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                          type="text"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          placeholder="Enter your school name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter school location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Driver Specific Fields */}
                  {activeTab === 'Driver' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter your CNIC"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">School Partner</label>
                          <input
                            type="text"
                            name="schoolPartner"
                            value={formData.schoolPartner}
                            onChange={handleInputChange}
                            placeholder="Enter your service area"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            placeholder="Enter your service city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Front</label>
                          <input
                            type="file"
                            name="cnicFront"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Back</label>
                          <input
                            type="file"
                            name="cnicBack"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
                          />
                        </div>
                      </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License</label>
                          <input
                            type="file"
                            name="driversLicense"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration Document</label>
                          <input
                            type="file"
                            name="vehicleRegistrationDocument"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
                          />
                        </div>
                    </>
                  )}

                  {/* Password Fields */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                      />
                    </div>

                  {/* Terms and Privacy */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-red-500 hover:text-red-600">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-red-500 hover:text-red-600">Privacy Policy</a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Create Account
                  </button>

                  {/* Sign In Link */}
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <a href="#" className="text-red-500 hover:text-red-600 font-medium">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;