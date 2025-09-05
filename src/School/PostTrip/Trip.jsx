import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TopBar from "../Topbar";
import PostTripForm from "./PostTripForm";
import Sidebar from "../Sidebar";
import HeaderTopBar from "../HeaderTopbar";
import PremiumTrip from "./PrimerTrip";
import { useParams } from "react-router-dom";

function Trip() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingTrips, setPendingTrips] = useState(null);
  const [pendingCost, setPendingCost] = useState(null);
  const [costPerTrip, setCostPerTrip] = useState(50); // Default to 50
  const { id } = useParams(); // Detect if editing

  useEffect(() => {
    // If editing, skip credits check
    if (id) {
      setUnlocked(true);
      setLoading(false);
      return;
    }

    const checkAvailableTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in.");
          return;
        }

        const res = await axios.get(
          "https://fieldtriplinkbackend-production.up.railway.app/api/school/getAvailableTripCredits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.success) {
          const {
            subscriptionType,
            availableTrips,
            canCreateNewTrip,
            pendingTrips,
            totalPendingAmount,
            costPerTrip: apiCostPerTrip,
          } = res.data;

          console.log("Trip Credits API:", res.data);

          // Save for popup use later
          setPendingTrips(pendingTrips);
          setPendingCost(totalPendingAmount); // Set totalPendingAmount
          setCostPerTrip(apiCostPerTrip || 50); // Use API value or fallback to 50

          // Unlock for yearly users or if canCreateNewTrip is true
          if (
            subscriptionType === "yearly" ||
            String(canCreateNewTrip).toLowerCase() === "true"
          ) {
            setUnlocked(true); // Yearly users or those with permission
          } else {
            setUnlocked(false); // No permission
          }
        } else {
          toast.error("Failed to fetch trip credits.");
        }
      } catch (err) {
        console.error("Error fetching available trips:", err);
        toast.error("Error checking available trips.");
      } finally {
        setLoading(false);
      }
    };

    checkAvailableTrips();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-10 w-10 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <HeaderTopBar
          onMenuClick={() => setSidebarOpen(true)}
          className="lg:ml-58"
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {!unlocked ? (
            <PremiumTrip
              onConfirm={() => setUnlocked(true)}
              onClose={() => window.history.back()} // Go back if closed
              pendingTrips={pendingTrips}
              pendingCost={pendingCost} // Pass totalPendingAmount
              costPerTrip={costPerTrip} // Pass dynamic costPerTrip
            />
          ) : (
            <PostTripForm />
          )}
        </main>
      </div>
    </div>
  );
}

export default Trip;