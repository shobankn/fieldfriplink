import React from 'react';
import { Crown } from 'lucide-react';

const PremiumBanner = () => {
  return (
    <div className="w-full bg-[#FFAE00] px-4 sm:px-6 md:px-14 py-4 flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between shadow-lg gap-1 md:gap-0">
      
      {/* Left Section - Plan Info */}
      <div className="flex items-center justify-center md:justify-start space-x-2">
        <span className="text-white font-medium text-base md:text-[16px] text-center md:text-left">
          Plan yearly: <span className="font-bold">$4200.00</span>
        </span>
      </div>

      {/* Right Section - Premium Package Info */}
      <div className="flex items-center justify-center md:justify-end space-x-2">
        <Crown className="w-5 h-5 text-white flex-shrink-0" />
        <span className="text-white font-medium text-base md:text-[16px] text-center md:text-left">
          Premium Package is Valid till:{" "}
          <span className="font-bold">2026-5-12</span>
        </span>
      </div>
    </div>
  );
};

export default PremiumBanner;
