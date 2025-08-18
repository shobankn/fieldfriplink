import React from 'react';
import { FaEye, FaUser, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProposalTopBar = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <nav className="flex items-center p-4 bg-white shadow-md">
      <button 
        className={` cursor-pointer flex mr-3 items-center px-4 py-2 rounded-full ${currentPath === '/proposals' ? 'bg-red-500 text-white' : 'bg-gray-100 text-red-500'} hover:${currentPath !== '/proposals' ? 'bg-red-100' : 'bg-red-500'}`}
        onClick={() => navigate('/proposals')}
      >
        <FaEye className="mr-2" /> View Proposals
      </button>
      <button 
        className={` cursor-pointer flex mr-3 items-center px-4 py-2 rounded-full ${currentPath === '/invite-drivers' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:${currentPath !== '/invite-drivers' ? 'bg-gray-200' : 'bg-red-500'}`}
        onClick={() => navigate('/invite-drivers')}
      >
        <FaUser className="mr-2" /> Invite Drivers
      </button>
      <button 
        className={` cursor-pointer flex mr-3 items-center px-4 py-2 rounded-full ${currentPath === '/my-hires' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:${currentPath !== '/my-hires' ? 'bg-gray-200' : 'bg-red-600'}`}
        onClick={() => navigate('/my-hires')}
      >
        <FaUser className="mr-2" /> My Hires <span className="ml-1 bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">1</span>
      </button>
      <button 
        className={` cursor-pointer flex mr-3 items-center px-4 py-2 rounded-full ${currentPath === '/saved' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:${currentPath !== '/saved' ? 'bg-gray-200' : 'bg-red-600'}`}
        onClick={() => navigate('/saved')}
      >
        <FaHeart className="mr-2" /> Saved
      </button>
    </nav>
  );
};

export default ProposalTopBar;