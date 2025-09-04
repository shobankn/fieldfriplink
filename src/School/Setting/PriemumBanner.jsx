import React, { useEffect, useState } from "react";
import axios from "axios";
import { Crown } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PremiumBanner = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔑 JWT token from login

        if (!token) {
          console.warn("No token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://fieldtriplinkbackend-production.up.railway.app/api/school/subscription/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Subscription data:", response.data);

        if (response.data?.subscriptions?.length > 0) {
          setSubscription(response.data.subscriptions[0]); // ✅ just take first one
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const formattedDate = subscription
    ? new Date(subscription.expiryDate).toLocaleDateString()
    : null;

  return (
    <div className="w-full bg-[#FFAE00] px-4 sm:px-6 md:px-14 py-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-lg gap-1 md:gap-0">
      
      {/* Left Section - Plan Info */}
      <div className="flex items-center justify-center md:justify-start space-x-2">
        {loading ? (
          <Skeleton width={180} height={20} baseColor="#e6a800" highlightColor="#ffcc4d" />
        ) : subscription ? (
          <span className="text-white font-medium text-base md:text-[16px] text-center md:text-left">
            Plan {subscription.plan.includes("yearly") ? "yearly" : "monthly"}:{" "}
            <span className="font-bold">${subscription.amount}.00</span>
          </span>
        ) : null}
      </div>

      {/* Right Section - Premium Package Info */}
      <div className="flex items-center justify-center md:justify-end space-x-2">
        <Crown className="w-5 h-5 text-white flex-shrink-0" />
        {loading ? (
          <Skeleton width={220} height={20} baseColor="#e6a800" highlightColor="#ffcc4d" />
        ) : subscription ? (
          <span className="text-white font-medium text-base md:text-[16px] text-center md:text-left">
            Premium Package is Valid till:{" "}
            <span className="font-bold">{formattedDate}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PremiumBanner;
