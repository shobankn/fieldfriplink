import React, { useState } from 'react';
import { 
Menu
} from 'lucide-react';
const TripManageTopBar = ({ onMenuClick }) => {
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
            <h2 className="text-xl font-semibold text-gray-900 ">Trip Managment </h2>
            <p className="text-sm text-gray-500">Manage and monitor all your transportation requests.</p>
          </div>
        </div>
         <button className="bg-[#2563eb] text-white px-4 py-2 text-[12px] rounded-lg whitespace-nowrap sm:text-sm font-medium hover:bg-red-600 transition-colors">
          Post New Trip
        </button>
      
      </div>
    </div>
  );
};

export default TripManageTopBar;