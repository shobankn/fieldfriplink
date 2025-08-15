import React, { useState } from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { SlClock } from "react-icons/sl";
import Navbar from '../../Navbar/Navbar';
import Footer from '../footer/Footer';

const Contactus = () => {
  // State for custom dropdowns
  const [interestOpen, setInterestOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('What are you interested in?');
  const [selectedRole, setSelectedRole] = useState('Your Role *');

  // Dropdown options
  const interestOptions = ['Request a Demo', 'General Inquiry'];
  const roleOptions = ['Teacher', 'Administrator', 'Parent', 'Other'];

  return (
    <div className="w-full bg-[#F8F9FB] text-gray-800">
      <Navbar/>
      {/* Hero Section */}
      <div className="bg-[#ea2127] text-white text-center py-[93px] px-4 flex items-center justify-center flex-col">
        <h1 className="text-[60px] archivobold mb-4">Get in Touch</h1>
        <p className="interregular text-[24px] w-[60%] flex items-center">
          Ready to transform your school's transportation experience? Let's discuss how FieldTripLink can help ensure no student misses out.
        </p>
      </div>

      {/* Form & Contact Info Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-[100px]">
        {/* Form */}
        <div className="bg-white shadow-md rounded-[8px] p-6">
          <h2 className="text-[32px] archivobold mb-4">Request a Demo or Pilot</h2>
          <p className="interregular text-[16px] text-[#666666] mb-[29px]">
            Fill out the form below and we'll get back to you within 24 hours to schedule your demo or discuss pilot program opportunities.
          </p>
          <div className="space-y-4">
            {/* Custom Dropdown for Interest */}
            <p className="interregular text-[14px] mb-[0]">What are you interested in? *</p>
            <div className="relative">
              <button
                onClick={() => setInterestOpen(!interestOpen)}
                className="w-full border rounded px-3 py-2 text-left bg-white text-gray-700 "
              >
                {selectedInterest}
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
                        setSelectedInterest(option);
                        setInterestOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-red-100 cursor-pointer text-gray-700"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
            <span className="interregular text-[14px] mb-[0]">Full Name *</span>

              <input type="text" placeholder="Full Name *" className="border rounded px-3 py-2 w-full" /></div>
              <div>
              <span className="interregular text-[14px] mb-[0]">Email Address *</span>
              <input type="email" placeholder="Email Address *" className="border rounded px-3 py-2 w-full" /></div>
              <div>
                <span className="interregular text-[14px] mb-[0]">Phone No</span>
              <input type="text" placeholder="Phone Number" className="border rounded px-3 py-2 w-full" /></div>
              {/* Custom Dropdown for Role */}
              <div>
                <span className="interregular text-[14px] mb-[0]">Your Role *</span>

              <div className="relative">
                <button
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="w-full border rounded px-3 py-2 text-left bg-white  flex items-center text-gray-700 "
                >
                  {selectedRole}
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
                          setSelectedRole(option);
                          setRoleOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-red-100 cursor-pointer text-gray-700"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div></div>
            </div>
            <div>
              <span className="interregular text-[14px] mb-[0]">School/Organization *</span>
               <input type="text" placeholder="School/Organization *" className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <span className="interregular text-[14px] mb-[0]">Message *</span>
           
            <textarea placeholder="Message *" className="border rounded px-3 py-2 w-full" rows="4"></textarea></div>
            <button className="bg-[#ef4444] text-white py-2 px-6 rounded w-full">Send Message</button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6 ">
          <div className="bg-white shadow-md rounded-lg p-[40px]">
            <h3 className="text-[24px] archivobold mb-4">Contact Information</h3>
            <div className="interregular flex gap-[10px] items-center mb-[19px]"><span className='bg-[#FEF2F2] h-[48px] w-[48px] flex items-center justify-center rounded-[100%]'><MdOutlineEmail style={{ fontSize: '24px', color: '#EF4444' }} /></span><div><p className='archivobold text-[16px]'>Email</p><p className='text-[#666666] text-[16px]'>info@fieldtriplink.com </p><p className='text-[#666666] text-[16px]'>For general inquiries</p></div></div>


           <div className="interregular flex gap-[10px] items-center mb-[19px]"><span className='bg-[#FEF2F2] h-[48px] w-[48px] flex items-center justify-center rounded-[100%]'><LuPhone style={{ fontSize: '24px', color: '#EF4444' }} /></span><div><p className='archivobold text-[16px]'>Phone</p><p className='text-[#666666] text-[16px]'>(555) 123-4567</p><p className='text-[#666666] text-[16px]'>Monday - Friday, 8AM - 6PM EST</p></div></div>


           <div className="interregular flex gap-[10px] items-center mb-[19px]"><span className='bg-[#FEF2F2] h-[48px] w-[48px] flex items-center justify-center rounded-[100%]'><IoLocationOutline style={{ fontSize: '24px', color: '#EF4444' }} /></span><div><p className='archivobold text-[16px]'>Location</p><p className='text-[#666666] text-[16px]'>United States </p><p className='text-[#666666] text-[16px]'>Serving schools nationwide</p></div></div>



          <div className="interregular flex gap-[10px] items-center mb-[19px]"><span className='bg-[#FEF2F2] h-[48px] w-[48px] flex items-center justify-center rounded-[100%]'><SlClock style={{ fontSize: '24px', color: '#EF4444' }} /></span><div><p className='archivobold text-[16px]'>Response Time</p><p className='text-[#666666] text-[16px]'>Within 24 hours</p><p className='text-[#666666] text-[16px]'>We typically respond within 4 hours</p></div></div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-[24px] archivobold mb-4">Ready to Get Started?</h3>
            <p className="interregular text-[#4B5563] mb-4">We're excited to show you how FieldTripLink can transform your school's transportation experience. Here's what happens next:</p>
            <ul className="list-disc list-inside space-y-2">
              <p className="interregular text-[#4B5563]"><span className='bg-[#3B82F6] text-[white] py-[5px] px-[11px] me-1 rounded-[50%]'>1</span>We'll contact you within 24 hours to schedule your demo</p>
              <p className="interregular text-[#4B5563]"><span className='bg-[#3B82F6] text-[white] py-[5px] px-[9px] me-1 rounded-[50%]'>2</span>We'll show you the platform and discuss your specific needs</p>
              <p className="interregular text-[#4B5563]"><span className='bg-[#3B82F6] text-[white] py-[5px] px-[9px] me-1 rounded-[50%]'>3</span>We'll work together to set up your pilot program</p>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#F8F9FB] pt-[70px] pb-[38px] px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[32px] archivobold text-center ">Frequently Asked Questions</h2>
          <p className="pb-[30px] interregular text-center text-[16px] text-gray-500 mb-6">Quick answers to common questions about FieldTripLink</p>
          <div className="space-y-6">
            <div className='h-[144px] pt-[34px] px-[30px] bg-[white]'>
              <h4 className="archivobold text-[18px]">How does the pilot program work?</h4>
              <p className="interregular text-[16px] text-gray-700">Our pilot program allows schools to test the platform with a limited number of trips at no cost. This helps you understand the benefits and see how it fits into your transportation workflow before making a commitment.</p>
            </div>
            <div className='h-[144px] pt-[34px] px-[30px] bg-[white]'>
              <h4 className="archivobold text-[18px]">What are the costs involved?</h4>
              <p className="interregular text-[16px] text-gray-700">We offer transparent, competitive pricing with no hidden fees. Costs vary based on your school's size and usage. We'll provide a detailed quote during your demo based on your specific needs.</p>
            </div>
            <div className='h-[144px] pt-[34px] px-[30px] bg-[white]'>
              <h4 className="archivobold text-[18px]">How do you ensure driver quality?</h4>
              <p className="interregular text-[16px] text-gray-700">All drivers undergo comprehensive background checks, drug screening, CDL verification, and safety training. We also use RAP Back integration for continuous monitoring and maintain a rating system for quality assurance.</p>
            </div>
            <div className='h-[144px] pt-[34px] px-[30px] bg-[white]'>
              <h4 className="archivobold text-[18px]">What if no drivers are available for my trip?</h4>
              <p className="interregular text-text-[16px] text-gray-700">Our network is designed to provide reliable coverage, but if no drivers are available, we'll work with you to find alternatives or help you adjust your trip timing. We're committed to ensuring your students don't miss out.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Contactus;