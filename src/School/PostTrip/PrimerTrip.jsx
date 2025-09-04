import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PremiumTrip = ({ onConfirm, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);


const handlePayment = async () => {
  if (!selectedPlan) return;

  try {
    setLoading(true);

    // 1. Get token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    // 2. Call payment API
    const res = await axios.post(
      "https://fieldtriplinkbackend-production.up.railway.app/api/school/trip/payment",
      { plan: selectedPlan }, // body payload if needed
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Bearer token
          "Content-Type": "application/json",
        },
      }
    );

    // 3. Redirect to Stripe checkout URL
    if (res.data?.url) {
      window.location.href = res.data.url; // 🔀 redirect
    } else {
      toast.error("Payment session could not be created.");
    }
  } catch (err) {
    console.error("Payment failed:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className=" cursor-pointer absolute top-3 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Card */}
        <div
          onClick={() => setSelectedPlan("basic")}
          className={`relative flex flex-col justify-between cursor-pointer transition-all duration-200 rounded-lg border p-6 ${
            selectedPlan === "basic"
              ? "bg-red-100 border-red-400 shadow-md"
              : "border-gray-200 hover:bg-red-100"
          }`}
        >
          {/* --- Top --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Premium Trip Posting
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Unlock posting with just $50 per trip.
              </p>
            </div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">$50</span>
              <span className="text-gray-600 ml-2">/per trip</span>
            </div>
          </div>

          {/* --- Bottom --- */}
          <div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </span>
                <span className="ml-2 text-gray-700">
                  Flexible for schools posting fewer trips
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </span>
                <span className="ml-2 text-gray-700">
                  $50 per completed trip
                </span>
              </li>
            </ul>

<button
  onClick={() => {
    if (selectedPlan === "basic") {
      // Second click → proceed to payment
      handlePayment();
    } else {
      // First click → just select the plan
      setSelectedPlan("basic");
    }
  }}
  disabled={loading}
  className={`cursor-pointer w-full py-2 px-4 rounded-lg transition-all duration-200 transform ${
    selectedPlan === "basic"
      ? "bg-[#E83E3E] text-white hover:scale-[1.02] active:scale-[0.98]"
      : "bg-gray-300 text-gray-700 hover:bg-[#E83E3E] hover:text-white hover:scale-[1.02]"
  }`}
>
  {loading
    ? "Processing..."
    : selectedPlan === "basic"
    ? "Proceed to Payment"
    : "Get Plan"}
</button>



          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumTrip;
