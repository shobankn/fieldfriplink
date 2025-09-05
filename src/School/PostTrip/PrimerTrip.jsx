import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PremiumTrip = ({ onConfirm, onClose, pendingTrips, pendingCost, costPerTrip }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in.");
        return;
      }

      const res = await axios.post(
        "https://fieldtriplinkbackend-production.up.railway.app/api/school/trip/payment",
        { plan: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Payment session could not be created.");
      }
    } catch (err) {
      console.error("Payment failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback to costPerTrip if pendingCost is not provided
  const displayCost = pendingCost !== null && pendingCost !== undefined ? pendingCost : costPerTrip || 50;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Pricing Card */}
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
                Pending Payment Required
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Unlock posting with just ${displayCost}.
              </p>
            </div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">${displayCost}</span>
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
                <span className="ml-2 text-gray-700">${displayCost} per completed trip</span>
              </li>
            </ul>

            <button
              onClick={() => {
                if (selectedPlan === "basic") {
                  handlePayment();
                } else {
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