import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    navigate('/register');
  };

  return (
    <header className="shadow-md bg-white px-4 sm:px-10 py-4">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Text */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="FieldTripLink Logo" className="h-[50px] w-[89px]" />
          <div>
            <h1 className="text-lg sm:text-xl interbold">FieldTripLink</h1>
            <p className="text-xs sm:text-sm text-[#555555] leading-4">
              Shared Drivers. Connected Trips. Enriched Learning.
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `inter-medium pb-0.5 ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `inter-medium pb-0.5 ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contactus"
            className={({ isActive }) =>
              `inter-medium pb-0.5 ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
            }
          >
            Contact
          </NavLink>
          <button
            className="bg-[#de3b40] inter-medium hover:bg-[#c53035] text-white px-4 py-2 rounded-md"
            onClick={handleCreateAccountClick}
          >
            Create Account
          </button>
        </nav>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <span className="text-2xl">{isOpen ? '✖' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-4 px-4 py-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `inter-medium w-fit ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `inter-medium w-fit ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contactus"
              className={({ isActive }) =>
                `inter-medium w-fit ${isActive ? 'text-[#de3b40] border-b-2 border-[#de3b40]' : 'text-gray-800 hover:text-[#de3b40]'}`
              }
            >
              Contact
            </NavLink>
            <button
              className="bg-[#de3b40] inter-medium hover:bg-[#c53035] text-white px-4 py-2 rounded-md w-fit"
              onClick={handleCreateAccountClick}
            >
              Create Account
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;