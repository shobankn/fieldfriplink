import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/logo3.png';

const Footer = () => {
  const navigate = useNavigate();

  // Handle logo click to navigate to home page
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <footer className="bg-[#212121] py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[80px] flex flex-col lg:flex-row justify-between gap-8 pt-[68px]">
        <div className="lg:w-1/3">
          <div className="flex items-center mb-4 cursor-pointer" onClick={handleLogoClick}>
            <img src={logo} className="h-[65px] w-[65px]" alt="FieldTripLink Logo" />
            <h3 className="archivobold text-[20px] ms-[10px] text-[white]">FieldTripLink</h3>
          </div>
          <p className="interregular text-[14px] text-[#bbbbbb]">
            Connecting schools with certified school bus drivers through a secure, easy-to-use platform that ensures students never miss out on enrichment opportunities.
          </p>
          <p className="text-red-500 text-sm mt-2 interregular text-[14px]">
            "Shared Drivers. Connected Trips. Enriched Learning."
          </p>
        </div>
        <div className="lg:w-1/3 flex flex-col lg:flex-row justify-between">
          <div>
            <h4 className="archivobold text-[18px] text-[white] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `interregular text-[14px] cursor-pointer ${
                      isActive ? 'text-[#de3b40]' : 'text-[#bbbbbb] hover:text-white'
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `interregular text-[14px] cursor-pointer ${
                      isActive ? 'text-[#de3b40]' : 'text-[#bbbbbb] hover:text-white'
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contactus"
                  className={({ isActive }) =>
                    `interregular text-[14px] cursor-pointer ${
                      isActive ? 'text-[#de3b40]' : 'text-[#bbbbbb] hover:text-white'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:w-1/3">
          <h4 className="mb-4 archivobold text-[18px] text-[white]">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="text-[#bbbbbb] interregular text-[14px]">
              <a href="mailto:info@fieldtriplink.com" className="hover:text-white cursor-pointer">
                info@fieldtriplink.com
              </a>
            </li>
            <li className="text-[#bbbbbb] interregular text-[14px]">
              <a href="tel:+5551234567" className="hover:text-white cursor-pointer">
                (555) 123-4567
              </a>
            </li>
            <li className="text-[#bbbbbb] interregular text-[14px]">United States</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white-800 mt-8 pt-4 pb-[50px] max-w-[1920px] mx-auto px-4 sm:px-6 w-[90%]">
        <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-[#bbbbbb] interregular text-[14px]">
          <p>&copy; 2025 FieldTripLink. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <a href="#" className="hover:text-white text-[#bbbbbb] cursor-pointer">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white text-[#bbbbbb] cursor-pointer">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;