import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const [billingType, setBillingType] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan
   const navigate = useNavigate();

   const handleCardClick = (plan) => {
    setSelectedPlan(plan);
    navigate('/register', { state: { userType: 'School', selectedPlan: plan } }); 
    // 👆 You can pass the plan info to the Register page
  };
  

  // 🔥 Common hover/active styles
  const baseCardClasses =
    "cursor-pointer bg-white rounded-xl border p-4 sm:p-6 transition-all duration-300 transform";
  const hoverClasses =
    "hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:border-red-300 hover:shadow-xl hover:-translate-y-2";
  const activeClasses =
    "bg-gradient-to-br from-red-50 to-pink-50 border-red-300 shadow-xl -translate-y-2";

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-red-500 font-medium text-sm mb-4 tracking-wide uppercase">Pricing</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Choose the Right Plans for your Needs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Select a Plan that fits your usage and budget. Both plans offer unlimited access 
            and posting, with different trip fee structures.
          </p>
        </div>

        {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-0 sm:px-4">
  {/* Basic Plan */}
  <div
     onClick={() => handleCardClick('basic')}
            className={`${baseCardClasses} ${
              selectedPlan === 'basic'
                ? activeClasses
                : `border-gray-200 ${hoverClasses} group`
            } relative flex flex-col justify-between h-full`}
 
  >
    {/* --- Top (title, description, price) --- */}
   <div className="flex flex-col sm:flex-row justify-between items-start  mb-8">
  {/* Left side: Title + description */}
  <div className="mb-4 sm:mb-0">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pilot Monthly Plan</h3>
    <p className="text-gray-600 leading-relaxed">
      Unlimited access and $50 fee only on completed trip + Driver wage (Minimum $25 per hour)
    </p>
  </div>

  {/* Right side: Pricing */}
  <div className="flex items-baseline">
    <span className="text-4xl md:text-4xl font-bold text-gray-900">$105.00</span>
    <span className="text-gray-600 ml-2">
      {billingType === 'monthly' ? '/month' : '/year'}
    </span>
  </div>
</div>


    {/* --- Bottom (features + button) --- */}
    <div>
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">Unlimited access and posting</span>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">
            You need to pay $50 per completed trip 
          </span>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">
            You need to pay driver wages (Minimun $25 per hour)
          </span>
        </div>
      </div>

      <button
        className="w-full bg-[#CCCCCC] text-black 
          group-hover:bg-[#E83E3E] group-hover:text-white 
          inter-semibold py-2 px-4 rounded-lg 
          transition-all duration-200 transform 
          group-hover:scale-[1.02] active:scale-[0.98]"
      >
        Choose Plan
      </button>
    </div>
  </div>

  {/* Yearly Plan */}
  <div
     onClick={() => handleCardClick('yearly')}
            className={`${baseCardClasses} ${
              selectedPlan === 'yearly'
                ? activeClasses
                : `border-gray-200 ${hoverClasses} group`
            } relative flex flex-col justify-between h-full`}
  >
    {/* --- Top content (title + price) --- */}
  <div>
  <div className="flex flex-col sm:flex-row justify-between items-start  mb-8">
    {/* Left: Title + Badge + Description */}
    <div className="mb-4 sm:mb-0 w-[60%]">
      <div className="flex whitespace-nowrap items-center justify-start mb-2">
        <h3 className="text-2xl font-bold text-gray-900">Pilot Annual Offer</h3>
        
      </div>
      <p className="text-gray-600 leading-relaxed">
        It will be $4200 from next year + Driver wages (Minimum $25 per hour )
      </p>
    </div>

    {/* Right: Price */}
    <div className="flex items-baseline ml-0 ">
      <span className="text-4xl md:text-3xl font-bold text-gray-900">$3750</span>
      <span className="text-gray-600 ml-2">/for first year</span>
    </div>
  </div>
</div>


    {/* --- Bottom content (features + button) --- */}
    <div>
      <div className="space-y-4 mb-6">
         <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">Get discount on first year</span>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">Unlimited access and posting</span>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">Zero trip fees </span>
        </div>
         <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-700">
            You need to pay driver wages (Minimun $25 per hour)
          </span>
        </div>
      </div>

      <button
        className="w-full bg-[#CCCCCC] text-black 
          group-hover:bg-[#E83E3E] group-hover:text-white 
          inter-semibold py-2 px-4 rounded-lg 
          transition-all duration-200 transform 
          group-hover:scale-[1.02] active:scale-[0.98]"
      >
        Choose Plan
      </button>
    </div>
  </div>
        </div>

      </div>
    </div>
  );
};

export default PricingSection;
