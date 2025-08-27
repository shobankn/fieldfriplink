import React, { useState } from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { SlClock } from "react-icons/sl";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../Navbar/Navbar';
import Footer from '../footer/Footer';

const Contactus = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Your Role *',
    schoolName: '',
    interest: 'What are you interested in?',
    message: '',
  });
  const [interestOpen, setInterestOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for spinner

  // Dropdown options
  const interestOptions = ['Request a Demo', 'General Inquiry'];
  const roleOptions = ['School Owner', 'Bus Driver'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/common/contact',
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role === 'Your Role *' ? '' : formData.role,
          schoolName: formData.schoolName,
          interest: formData.interest === 'What are you interested in?' ? '' : formData.interest,
          message: formData.message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Message sent successfully!');
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'Your Role *',
        schoolName: '',
        interest: 'What are you interested in?',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full bg-[#F8F9FB] text-gray-800">
      <style>
        {`
          @keyframes slideInLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInBottom {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <Navbar />
      {/* Hero Section */}
      <div className="bg-[#ea2127] text-white text-center py-12 sm:py-16 md:py-20 px-4 flex items-center justify-center flex-col">
        <h1 className="text-4xl sm:text-5xl md:text-6xl archivobold mb-4">Get in Touch</h1>
        <p className="interregular text-lg sm:text-xl md:text-2xl w-full sm:w-3/4 md:w-3/5 flex items-center">
          Ready to transform your school's transportation experience? Let's discuss how FieldTripLink can help ensure no student misses out.
        </p>
      </div>

      {/* Form & Contact Info Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-12 sm:py-16 md:py-20">
        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 animate-move-in-left delay-2000" style={{ animation: 'slideInLeft 0.5s ease-out forwards 2s' }}>
          <h2 className="text-2xl sm:text-3xl archivobold mb-4">Request a Demo or Pilot</h2>
          <p className="interregular text-sm sm:text-base text-[#666666] mb-6">
            Fill out the form below and we'll get back to you within 24 hours to schedule your demo or discuss pilot program opportunities.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Custom Dropdown for Interest */}
            <p className="interregular text-sm sm:text-base mb-0">What are you interested in? *</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setInterestOpen(!interestOpen)}
                className="w-full border rounded px-3 py-2 text-left bg-white text-gray-700 text-sm sm:text-base cursor-pointer"
              >
                {formData.interest}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {interestOpen && (
                <div className="absolute w-full mt-1 bg-white border rounded shadow-lg z-10">
                  {interestOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFormData({ ...formData, interest: option });
                        setInterestOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-red-100 cursor-pointer text-gray-700 text-sm sm:text-base"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="interregular text-sm sm:text-base mb-0">Full Name *</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <span className="interregular text-sm sm:text-base mb-0">Email Address *</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <span className="interregular text-sm sm:text-base mb-0">Phone No</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                />
              </div>
              {/* Custom Dropdown for Role */}
              <div>
                <span className="interregular text-sm sm:text-base mb-0">Your Role *</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(!roleOpen)}
                    className="w-full border rounded px-3 py-2 text-left bg-white flex items-center text-gray-700 text-sm sm:text-base cursor-pointer"
                  >
                    {formData.role}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {roleOpen && (
                    <div className="absolute w-full mt-1 bg-white border rounded shadow-lg z-10">
                      {roleOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            setFormData({ ...formData, role: option });
                            setRoleOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-red-100 cursor-pointer text-gray-700 text-sm sm:text-base"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <span className="interregular text-sm sm:text-base mb-0">School/Organization *</span>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="School/Organization *"
                className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <span className="interregular text-sm sm:text-base mb-0">Message *</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message *"
                className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#ef4444] text-white py-2 px-6 rounded w-full text-sm sm:text-base flex items-center justify-center cursor-pointer relative overflow-hidden group ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
              <span className="relative z-10">
                {loading ? (
                  <>
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
                    Processing...
                  </>
                ) : (
                  'Send Message'
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 animate-move-in-right delay-2000" style={{ animation: 'slideInRight 0.5s ease-out forwards 2s' }}>
            <h3 className="text-xl sm:text-2xl archivobold mb-4">Contact Information</h3>
            <div className="interregular flex gap-3 items-center mb-4">
              <span className="bg-[#FEF2F2] h-12 w-12 flex items-center justify-center rounded-full">
                <MdOutlineEmail style={{ fontSize: '24px', color: '#EF4444' }} />
              </span>
              <div>
                <p className="archivobold text-base sm:text-lg">Email</p>
                <p className="text-[#666666] text-sm sm:text-base">info@fieldtriplink.com</p>
                <p className="text-[#666666] text-sm sm:text-base">For general inquiries</p>
              </div>
            </div>
            <div className="interregular flex gap-3 items-center mb-4">
              <span className="bg-[#FEF2F2] h-12 w-12 flex items-center justify-center rounded-full">
                <LuPhone style={{ fontSize: '24px', color: '#EF4444' }} />
              </span>
              <div>
                <p className="archivobold text-base sm:text-lg">Phone</p>
                <p className="text-[#666666] text-sm sm:text-base">(555) 123-4567</p>
                <p className="text-[#666666] text-sm sm:text-base">Monday - Friday, 8AM - 6PM EST</p>
              </div>
            </div>
            <div className="interregular flex gap-3 items-center mb-4">
              <span className="bg-[#FEF2F2] h-12 w-12 flex items-center justify-center rounded-full">
                <IoLocationOutline style={{ fontSize: '24px', color: '#EF4444' }} />
              </span>
              <div>
                <p className="archivobold text-base sm:text-lg">Location</p>
                <p className="text-[#666666] text-sm sm:text-base">United States</p>
                <p className="text-[#666666] text-sm sm:text-base">Serving schools nationwide</p>
              </div>
            </div>
            <div className="interregular flex gap-3 items-center mb-4">
              <span className="bg-[#FEF2F2] h-12 w-12 flex items-center justify-center rounded-full">
                <SlClock style={{ fontSize: '24px', color: '#EF4444' }} />
              </span>
              <div>
                <p className="archivobold text-base sm:text-lg">Response Time</p>
                <p className="text-[#666666] text-sm sm:text-base">Within 24 hours</p>
                <p className="text-[#666666] text-sm sm:text-base">We typically respond within 4 hours</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 animate-move-in-right delay-2000" style={{ animation: 'slideInRight 0.5s ease-out forwards 2s' }}>
            <h3 className="text-xl sm:text-2xl archivobold mb-4">Ready to Get Started?</h3>
            <p className="interregular text-[#4B5563] mb-4 text-sm sm:text-base">
              We're excited to show you how FieldTripLink can transform your school's transportation experience. Here's what happens next:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <p className="interregular text-[#4B5563] text-sm sm:text-base">
                <span className="bg-[#3B82F6] text-white py-1 px-2 me-1 rounded-full">1</span>
                We'll contact you within 24 hours to schedule your demo
              </p>
              <p className="interregular text-[#4B5563] text-sm sm:text-base">
                <span className="bg-[#3B82F6] text-white py-1 px-2 me-1 rounded-full">2</span>
                We'll show you the platform and discuss your specific needs
              </p>
              <p className="interregular text-[#4B5563] text-sm sm:text-base">
                <span className="bg-[#3B82F6] text-white py-1 px-2 me-1 rounded-full">3</span>
                We'll work together to set up your pilot program
              </p>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#F8F9FB] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-4 animate-move-in-bottom delay-2000" style={{ animation: 'slideInBottom 0.5s ease-out forwards 2s' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl archivobold text-center">Frequently Asked Questions</h2>
          <p className="pb-6 sm:pb-8 interregular text-center text-sm sm:text-base text-gray-500 mb-6">
            Quick answers to common questions about FieldTripLink
          </p>
          <div className="space-y-6">
            <div className="bg-white pt-6 sm:pt-8 px-6 sm:px-8 pb-4 sm:pb-6 rounded-lg">
              <h4 className="archivobold text-base sm:text-lg">How does the pilot program work?</h4>
              <p className="interregular text-sm sm:text-base text-gray-700">
                Our pilot program allows schools to test the platform with a limited number of trips at no cost. This helps you understand the benefits and see how it fits into your transportation workflow before making a commitment.
              </p>
            </div>
            <div className="bg-white pt-6 sm:pt-8 px-6 sm:px-8 pb-4 sm:pb-6 rounded-lg">
              <h4 className="archivobold text-base sm:text-lg">What are the costs involved?</h4>
              <p className="interregular text-sm sm:text-base text-gray-700">
                We offer transparent, competitive pricing with no hidden fees. Costs vary based on your school's size and usage. We'll provide a detailed quote during your demo based on your specific needs.
              </p>
            </div>
            <div className="bg-white pt-6 sm:pt-8 px-6 sm:px-8 pb-4 sm:pb-6 rounded-lg">
              <h4 className="archivobold text-base sm:text-lg">How do you ensure driver quality?</h4>
              <p className="interregular text-sm sm:text-base text-gray-700">
                All drivers undergo comprehensive background checks, drug screening, CDL verification, and safety training. We also use RAP Back integration for continuous monitoring and maintain a rating system for quality assurance.
              </p>
            </div>
            <div className="bg-white pt-6 sm:pt-8 px-6 sm:px-8 pb-4 sm:pb-6 rounded-lg">
              <h4 className="archivobold text-base sm:text-lg">What if no drivers are available for my trip?</h4>
              <p className="interregular text-sm sm:text-base text-gray-700">
                Our network is designed to provide reliable coverage, but if no drivers are available, we'll work with you to find alternatives or help you adjust your trip timing. We're committed to ensuring your students don't miss out.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Contactus;