import React from 'react';

const Contactus = () => {
  return (
    <div className="w-full bg-[#f8f9fb]  text-gray-800">
      {/* Hero Section */}
      <div className="bg-red-500 text-white text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Ready to transform your school's transportation experience? Let's discuss how FieldTripLink can help ensure no student misses out.
        </p>
      </div>

      {/* Form & Contact Info Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-[100px]">
        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Request a Demo or Pilot</h2>
          <form className="space-y-4">
            <select className="w-full border rounded px-3 py-2">
              <option>Request a Demo</option>
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="border rounded px-3 py-2 w-full" />
              <input type="email" placeholder="Email Address" className="border rounded px-3 py-2 w-full" />
              <input type="text" placeholder="Phone Number" className="border rounded px-3 py-2 w-full" />
              <select className="border rounded px-3 py-2 w-full">
                <option>Select Your Role</option>
              </select>
            </div>
            <input type="text" placeholder="School/Organization" className="border rounded px-3 py-2 w-full" />
            <textarea placeholder="Tell us about your transportation needs..." className="border rounded px-3 py-2 w-full" rows="4"></textarea>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded w-full">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <p><strong>Email:</strong> info@fieldtriplink.com</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Location:</strong> United States</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Ready to Get Started?</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>We'll contact you within 24 hours to schedule your demo</li>
              <li>We'll show you the platform and discuss your specific needs</li>
              <li>We'll work together to set up your pilot program</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">How does the pilot program work?</h4>
              <p className="text-sm text-gray-700">Our pilot program allows schools to test the platform with a limited number of trips at no cost...</p>
            </div>
            <div>
              <h4 className="font-semibold">What are the costs involved?</h4>
              <p className="text-sm text-gray-700">We offer transparent, competitive pricing with no hidden fees...</p>
            </div>
            <div>
              <h4 className="font-semibold">How do you ensure driver quality?</h4>
              <p className="text-sm text-gray-700">All drivers undergo comprehensive background checks, drug screening, and CDL verification...</p>
            </div>
            <div>
              <h4 className="font-semibold">What if no drivers are available for my trip?</h4>
              <p className="text-sm text-gray-700">Our network is designed to provide reliable coverage, but if no drivers are available...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
