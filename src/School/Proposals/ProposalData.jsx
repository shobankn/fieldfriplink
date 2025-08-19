const proposalsData = [
  {
    id: 1,
    title: "Morning School Pickup – Blue Area",
    type: "Recurring",
    createdDate: "Created 1 day ago",
    schedule: {
      date: "10/09/2025",
      time: "07:30 AM - 01:00 PM",
      tripDate: "10/09/2025",
      pickupTime: "07:30 AM",
      returnTime: "01:00 PM"
    },
   
    pickupAddresses: [
      "Flat #203, Blue Towers, Blue Area",
      "Sector G-8/3, Islamabad",
      "House #78, F-6/2"
    ],
    destination: "The City School, Margalla Campus",
    requirements: {
      students: 22,
      busCapacity: 26,
      driverGender: "Male",
      otherRequests: "Air-conditioned van preferred, punctual pickup required"
    },
    extraInstructions: "Make sure the driver has prior experience in handling school routes in busy areas.",
    quickStats: {
      totalDistance: "~18 km",
      estimatedDuration: "5 hours"
    },
    proposals: 3,
    status: "Open for Proposals",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: 2,
    title: "Evening Tuition Drop",
    type: "One-time",
    createdDate: "Created 3 days ago",
    schedule: {
      date: "12/09/2025",
      time: "04:00 PM - 06:00 PM",
      tripDate: "12/09/2025",
      pickupTime: "04:00 PM",
      returnTime: "06:00 PM"
    },
  
    pickupAddresses: [
      "Street 4, Sector H-13",
      "House #9, E-11/1",
      "Flat 5A, Ghauri Town"
    ],
    destination: "Allied Tuition Center, G-10 Markaz",
    requirements: {
      students: 10,
      busCapacity: 12,
      driverGender: "Female",
      otherRequests: "Preferably a small van with seat belts"
    },
    extraInstructions: "Route should avoid main highways due to rush hour.",
    quickStats: {
      totalDistance: "~12 km",
      estimatedDuration: "2.5 hours"
    },
    proposals: 1,
    status: "Proposal Accepted",
    statusColor: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    title: "Monthly Excursion – Heritage Museum",
    type: "One-time",
    createdDate: "Created 1 week ago",
    schedule: {
      date: "20/09/2025",
      time: "09:00 AM - 03:00 PM",
      tripDate: "20/09/2025",
      pickupTime: "09:00 AM",
      returnTime: "03:00 PM"
    },
   
    pickupAddresses: [
      "School Gate, Phase 4 Bahria Town",
      "Gate #2, DHA Phase 2",
      "Fazaia Colony Parking Area"
    ],
    destination: "Pakistan Monument Museum, Shakarparian",
    requirements: {
      students: 40,
      busCapacity: 45,
      driverGender: "No Preference",
      otherRequests: "Large AC bus with microphone and security camera"
    },
    extraInstructions: "Bus must arrive 15 minutes early, route should be planned ahead to avoid delays.",
    quickStats: {
      totalDistance: "~30 km",
      estimatedDuration: "6.5 hours"
    },
    proposals: 5,
    status: "Open for Proposals",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    title: "Daily College Route – F-11 to Bahria University",
    type: "Recurring",
    createdDate: "Created 4 days ago",
    schedule: {
      date: "09/09/2025",
      time: "07:00 AM - 03:00 PM",
      tripDate: "09/09/2025",
      pickupTime: "07:00 AM",
      returnTime: "03:00 PM"
    },
   
    pickupAddresses: [
      "Flat #14, Block C, F-11 Markaz",
      "Sector E-9, Naval Complex",
      "Street 8, I-9/3"
    ],
    destination: "Bahria University, E-8 Campus",
    requirements: {
      students: 18,
      busCapacity: 20,
      driverGender: "No Preference",
      otherRequests: "Needs mobile tracking support and well-maintained seats"
    },
    extraInstructions: "Attendance needs to be tracked on each ride. Driver should speak Urdu or English fluently.",
    quickStats: {
      totalDistance: "~22 km",
      estimatedDuration: "6 hours"
    },
    proposals: 2,
    status: "Expired",
    statusColor: "bg-red-100 text-red-800"
  }
];

export default proposalsData;
