import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentPopup = ({ onSuccess, onClose,token }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Validate token format (JWT typically has three parts separated by dots)
  const validateToken = (token) => {
    if (!token) return false;
    const tokenParts = token.split('.');
    return tokenParts.length === 3; // Basic JWT format check
  };

  const handleCardClick = (plan) => {
    setSelectedPlan(plan);
  };

const handlePaymentSubmit = async (plan) => {
 if (!plan) {
    toast.error("Please select a plan first.");
    return;
  }

  // Ensure selectedPlan is updated
  if (selectedPlan !== plan) {
    setSelectedPlan(plan);
  }

  if (!token || !validateToken(token)) {
    toast.error('Invalid or missing authentication token. Please log in again.');
    return;
  }

  setPaymentLoading(true);
  try {
    // Map selected plan to backend format
    const planKey = selectedPlan === 'basic' ? 'pro_monthly' : 'pro_yearly';

    const response = await fetch(
      'https://fieldtriplinkbackend-production.up.railway.app/api/school/subscription/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planKey }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Payment failed');
    }

    const data = await response.json();

    // ✅ Check if backend returned a URL and redirect
    if (data?.url) {
      window.location.href = data.url; 
    } else {
      toast.success('Payment successful!');
      onSuccess(data);
      onClose();
    }
  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  } finally {
    setPaymentLoading(false);
  }
};





  return (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity flex items-center justify-center z-50 px-4 sm:px-6">
  <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 relative">
    <button
      onClick={onClose}
      className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Select a Plan</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Basic Plan */}
      <div
        onClick={() => handleCardClick('basic')}
        className={`relative flex flex-col justify-between h-full cursor-pointer transition-all duration-200 rounded-lg border p-6
          ${selectedPlan === 'basic'
            ? 'bg-red-100 border-red-400 shadow-md'
            : 'border-gray-200 hover:bg-red-100 group'}`}
      >
        {/* --- Top --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
            <p className="text-gray-600 leading-relaxed">
              Unlimited access and posting $50 per completed trip (Plus driver wage)
            </p>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl md:text-5xl font-bold text-gray-900">$75.00</span>
            <span className="text-gray-600 ml-2">/Monthly</span>
          </div>
        </div>

        {/* --- Bottom --- */}
        <div>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Unlimited platform access</span>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">$50 per completed trip (plus driver wage)</span>
            </div>
          </div>

          

  {/* Basic Plan Button */}
<button
  onClick={() => {
    if (selectedPlan === "basic") {
      // If already selected → process payment
      handlePaymentSubmit("basic");
    } else {
      // First click → just select plan
      handleCardClick("basic");
    }
  }}
  disabled={paymentLoading}
  className={`w-full cursor-pointer inter-semibold py-2 px-4 rounded-lg transition-all duration-200 transform 
    ${selectedPlan === "basic"
      ? "bg-[#E83E3E] text-white"
      : "bg-[#CCCCCC] text-black group-hover:bg-[#E83E3E] group-hover:text-white group-hover:scale-[1.02] active:scale-[0.98]"}`}
>
  {paymentLoading && selectedPlan === "basic"
    ? "Processing..."
    : selectedPlan === "basic"
    ? "Proceed to Payment"
    : "Choose Plan"}
</button>






        </div>
      </div>

      {/* Yearly Plan */}
      <div
        onClick={() => handleCardClick('yearly')}
        className={`relative flex flex-col justify-between h-full cursor-pointer transition-all duration-200 rounded-lg border p-6
          ${selectedPlan === 'yearly'
            ? 'bg-red-100 border-red-400 shadow-md'
            : 'border-gray-200 hover:bg-red-100 group'}`}
      >
        {/* --- Top --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="flex whitespace-nowrap items-center justify-start mb-2">
              <h3 className="text-2xl font-bold text-gray-900">Yearly Plan</h3>
               {/* Badge with dynamic bg */}
              {/* <span
                className={`ml-2 text-red-800 text-xs font-semibold px-3 py-1 rounded-full transition-colors duration-200 
                  ${selectedPlan === 'yearly' ? 'bg-red-50' : 'bg-red-100 group-hover:bg-red-50'}`}
              >
                Annual Plan
              </span> */}
            </div>
            <p className="text-gray-600 leading-relaxed">
              Unlimited access and posting Zero trip fees (Plus driver wage)
            </p>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl md:text-5xl font-bold text-gray-900">$4200</span>
            <span className="text-gray-600 ml-2">/year</span>
          </div>
        </div>

        {/* --- Bottom --- */}
        <div>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Early access to new features</span>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Unlimited trip postings (no $50 fee)</span>
            </div>
          </div>



<button
  onClick={() => {
    if (selectedPlan === "yearly") {
      // Already selected → process payment
      handlePaymentSubmit("yearly");
    } else {
      // First click → just select plan
      handleCardClick("yearly");
    }
  }}
  disabled={paymentLoading}
  className={`w-full cursor-pointer inter-semibold py-2 px-4 rounded-lg transition-all duration-200 transform 
    ${selectedPlan === "yearly"
      ? "bg-[#E83E3E] text-white"
      : "bg-[#CCCCCC] text-black group-hover:bg-[#E83E3E] group-hover:text-white group-hover:scale-[1.02] active:scale-[0.98]"}`}
>
  {paymentLoading && selectedPlan === "yearly"
    ? "Processing..."
    : selectedPlan === "yearly"
    ? "Proceed to Payment"
    : "Choose Plan"}
</button>





        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default PaymentPopup;