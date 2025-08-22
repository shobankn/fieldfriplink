import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Upload, MapPin, Phone, Mail, Globe, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { requestFcmToken } from "../../../src/Fcm"; // Adjust path if needed
import { useNavigate } from "react-router-dom";


const SchoolSettingsForm = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'Private',
    city: '',
    completeAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    schoolLogo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({
    schoolName: '',
    schoolType: '',
    city: '',
    completeAddress: '',
    phoneNumber: '',
    emailAddress: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();


  const schoolTypes = ['Private', 'Public'];

  // Capitalize first letter for school type
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          'https://fieldtriplinkbackend-production.up.railway.app/api/school/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Profile Response:', res.data);

        const { user, school } = res.data;
        const newFormData = {
          schoolName: school.schoolName || '',
          schoolType: capitalizeFirstLetter(school.type) || 'Private',
          city: school.address?.city || '',
          completeAddress: school.address?.fullAddress || '',
          phoneNumber: school.phoneNumber || '',
          emailAddress: user.email || '',
          website: school.websiteLink || '',
          schoolLogo: school.logo || null,
        };
        setFormData(newFormData);

        if (school.logo) {
          setLogoPreview(school.logo); // Assuming logo is a URL or base64 string
        }

        // Validate fetched data
        setErrors({
          schoolName: !newFormData.schoolName.trim() ? 'School Name is required' : '',
          schoolType: !newFormData.schoolType.trim() ? 'School Type is required' : '',
          city: !newFormData.city.trim() ? 'City is required' : '',
          completeAddress: !newFormData.completeAddress.trim() ? 'Complete Address is required' : '',
          phoneNumber: !newFormData.phoneNumber.trim() ? 'Phone Number is required' : '',
          emailAddress: !newFormData.emailAddress.trim() ? 'Email Address is required' : '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response || err.message);
        toast.error(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (field, value) => {
    if (field === 'website') return ''; // Website is optional
    return !value.trim() ? `${field.replace(/([A-Z])/g, ' $1').trim()} is required` : '';
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleInputBlur = (field, value) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleLogoChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          schoolLogo: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    handleLogoChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoChange(e.dataTransfer.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setSaving(false);
        return;
      }

      // Validate required fields
      const requiredFields = {
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        city: formData.city,
        completeAddress: formData.completeAddress,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
      };

      const newErrors = {};
      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value.trim())
        .map(([field]) => field);

      if (emptyFields.length > 0) {
        emptyFields.forEach((field) => {
          newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
        toast.error(`Please fill all fields`);
        setSaving(false);
        return;
      }

      const { token: fcmToken, error } = await requestFcmToken();
      if (error) {
        console.warn("FCM token error:", error);
      }

      const formDataToSend = new FormData();
      if (formData.schoolName.trim()) {
        formDataToSend.append("schoolName", formData.schoolName);
      }
      if (formData.schoolType.trim()) {
        formDataToSend.append("type", formData.schoolType.toLowerCase());
      }
      if (formData.city.trim() || formData.completeAddress.trim()) {
        formDataToSend.append(
          "address",
          JSON.stringify({
            city: formData.city,
            fullAddress: formData.completeAddress,
          })
        );
      }
      if (formData.phoneNumber.trim()) {
        formDataToSend.append("phoneNumber", formData.phoneNumber);
      }
      if (formData.emailAddress.trim()) {
        formDataToSend.append("email", formData.emailAddress);
      }
      // Website is optional, so include it even if empty
      formDataToSend.append("websiteLink", formData.website);
      if (formData.schoolLogo instanceof File) {
        formDataToSend.append("logo", formData.schoolLogo);
      }

      if (fcmToken) {
        formDataToSend.append("fcmToken", fcmToken);
      }

      const res = await axios.post(
        "https://fieldtriplinkbackend-production.up.railway.app/api/school/profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update Response:", res.data);
      toast.success(res.data?.message || "Profile updated successfully!");
            setTimeout(() => {
        navigate("/setting");
      }, 3000);

      // Clear the form after successful update
      setFormData({
        schoolName: '',
        schoolType: 'Private',
        city: '',
        completeAddress: '',
        phoneNumber: '',
        emailAddress: '',
        website: '',
        schoolLogo: null,
      });
      setLogoPreview(null);
      setErrors({
        schoolName: '',
        schoolType: '',
        city: '',
        completeAddress: '',
        phoneNumber: '',
        emailAddress: '',
      });
    } catch (err) {
      console.error("Error updating profile:", err.response || err.message);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  const handleCancel = () => {
    setFormData({
      schoolName: '',
      schoolType: 'Private',
      city: '',
      completeAddress: '',
      phoneNumber: '',
      emailAddress: '',
      website: '',
      schoolLogo: null,
    });
    setLogoPreview(null);
    setErrors({
      schoolName: '',
      schoolType: '',
      city: '',
      completeAddress: '',
      phoneNumber: '',
      emailAddress: '',
    });

     navigate('/setting');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSchoolTypeSelect = (type) => {
    handleInputChange('schoolType', type);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="min-h-screen bg-gray-50 p-4 sm:px-6 py-2">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl inter-bold text-gray-900 mb-1">
              School Information
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Manage your school profile, users, and system preferences.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-[#333333CC] bg-red-50'
                      : 'border-[#333333CC] hover:border-red-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {loading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                    </div>
                  ) : logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview}
                        alt="School Logo Preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg inter-medium text-gray-900 mb-1">Upload Media</h3>
                        <p className="text-sm text-gray-600 mb-4">Logo uploaded successfully</p>
                        <label htmlFor="logo-upload">
                          <span className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm inter-medium rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Change Logo
                          </span>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg inter-medium text-gray-900 mb-1">Upload Media</h3>
                        <p className="text-sm text-gray-600 mb-4">Drag and drop or click to upload</p>
                        <label htmlFor="logo-upload">
                          <span className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm inter-medium rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </span>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange('schoolName', e.target.value)}
                        onBlur={(e) => handleInputBlur('schoolName', e.target.value)}
                        placeholder="Enter school name"
                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 ${
                          errors.schoolName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.schoolName && (
                        <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    School Type
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <div
                        className={`w-full px-3 py-2.5 border rounded-lg bg-white flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          errors.schoolType ? 'border-red-500' : 'border-gray-300'
                        } ${isDropdownOpen ? 'ring-2 ring-red-500' : ''}`}
                        onClick={toggleDropdown}
                      >
                        <span className="text-gray-900">{formData.schoolType || 'Select type'}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          {schoolTypes.map((type) => (
                            <div
                              key={type}
                              className="px-3 py-2 text-gray-900 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer"
                              onClick={() => handleSchoolTypeSelect(type)}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      )}
                      {errors.schoolType && (
                        <p className="text-red-500 text-xs mt-1">{errors.schoolType}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    City
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        onBlur={(e) => handleInputBlur('city', e.target.value)}
                        placeholder="Location"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Website <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <Globe className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.edu.pk"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <Phone className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        onBlur={(e) => handleInputBlur('phoneNumber', e.target.value)}
                        placeholder="0311xxxxxx"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm inter-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                        onBlur={(e) => handleInputBlur('emailAddress', e.target.value)}
                        placeholder="example@gmail.com"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 ${
                          errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.emailAddress && (
                        <p className="text-red-500 text-xs mt-1">{errors.emailAddress}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm inter-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                {loading ? (
                  <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                    <input
                      value={formData.completeAddress}
                      onChange={(e) => handleInputChange('completeAddress', e.target.value)}
                      onBlur={(e) => handleInputBlur('completeAddress', e.target.value)}
                      placeholder="Location"
                      rows={3}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 resize-none ${
                        errors.completeAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.completeAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.completeAddress}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 text-sm inter-medium text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>

                <motion.button
                  onClick={handleSaveChanges}
                  disabled={saving || loading}
                  whileHover={{ scale: saving || loading ? 1 : 1.02 }}
                  whileTap={{ scale: saving || loading ? 1 : 0.98 }}
                  className="flex-1 px-6 py-3 text-sm inter-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {saving ? (
                      <motion.svg
                        key="spinner"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                        }}
                        className="w-4 h-4 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </motion.svg>
                    ) : null}
                  </AnimatePresence>
                  <span>{saving ? "Saving..." : "Save Change"}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolSettingsForm;