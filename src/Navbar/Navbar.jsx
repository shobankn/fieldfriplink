import React, { useState } from 'react';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    navigate('/register');
  };

  return (
    <header className="shadow-md bg-white px-[41px] py-[16px]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Text */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="" className="h-[50px] w-[89px]" />
          <div>
            <h1 className="text-[18px] interbold">FieldTripLink</h1>
            <p className="text-[12px] text-[#555555] leading-4">
              Shared Drivers. Connected Trips. Enriched Learning.
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#/" className="text-[#de3b40] inter-medium border-b-2 border-[#de3b40] pb-0.5">Home</a>
          <a href="/about" className="text-gray-800 inter-medium hover:text-[#de3b40]">About Us</a>
          <a href="#" className="text-gray-800 inter-medium hover:text-[#de3b40]">Contact</a>
          <button
            className="bg-[#de3b40] inter-medium hover:bg-[#de3b40] text-white px-4 py-2 rounded-md"
            onClick={handleCreateAccountClick}
          >
            Create Account
          </button>
        </nav>

        {/* Mobile Toggle Button (you can replace with your own icons/images) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {/* You can replace below spans with your own icon or image */}
            <span className="text-2xl">
              {isOpen ? '✖' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-4 px-4 py-3">
            <a href="#" className="text-red-600 border-b-2 border-red-600 w-fit">Home</a>
            <a href="#" className="text-gray-800 hover:text-red-600">About Us</a>
            <a href="#" className="text-gray-800 hover:text-red-600">Contact</a>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md w-fit"
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