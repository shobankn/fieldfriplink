import React, { useState } from 'react';
import { 
Menu
} from 'lucide-react';
const TripTopbar = ({ onMenuClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Post New Trip</h2>
            <p className="text-sm text-gray-500">Create New Transportation and find the best driver</p>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default TripTopbar;