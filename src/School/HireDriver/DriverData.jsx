const combinedVerificationData = [
  {
    id: 1,
    name: "Ahmed Hassan",
    profileImage: profile,
    email: "ahmed.hassan@email.com",
    phone: "+92 300 1234567",
    cnic: "42101-1234567-8",
    experience: "5 years",
    address: "House #12, Block C, ABC Town, Karachi",
    submittedDate: "Submitted 2 days ago",
    status: "Pending",
    // Optional: include these for consistency
    submittedDocuments: null,
    verificationNotes: null
  },
  {
    id: 2,
    name: "Muhammad Ali",
    profileImage: profile,
    email: "muhammad.ali@email.com",
    phone: "+92 302 3456789",
    cnic: "61101-3456789-0",
    experience: "4 years",
    address: "Street 15, F-8 Sector, Islamabad",
    submittedDate: "Submitted 3 hours ago",
    status: "Pending",
    submittedDocuments: null,
    verificationNotes: null
  },
  {
    id: 3,
    name: "Sara Khan",
    profileImage: profile,
    email: "sara.khan@email.com",
    phone: "+92 321 9876543",
    cnic: "35202-9876543-2",
    experience: "7 years",
    address: "Model Town, Block B, Lahore",
    submittedDate: "Verified 1 week ago",
    status: "Verified",
    submittedDocuments: null,
    verificationNotes: null
  },
  {
    id: 4,
    name: "Hassan Ahmed",
    profileImage: profile,
    email: "hassan.ahmed@email.com",
    phone: "+92 333 5554444",
    cnic: "42101-5554444-6",
    experience: "3 years",
    address: "Gulshan-e-Iqbal, Karachi",
    submittedDate: "Suspended 3 days ago",
    status: "Suspended",
    submittedDocuments: null,
    verificationNotes: null
  },
  {
    id: 5,
    name: "Fatima Sheikh",
    profileImage: "/api/placeholder/200/200",
    email: "fatima.sheikh@email.com",
    phone: "+92 301 2345678",
    cnic: "35202-2345678-9",
    experience: "Not specified",
    address: "Apartment 5B, Green Valley, Lahore",
    submittedDate: "Verified 1 week ago",
    status: "Verified",
    submittedDocuments: {
      cnicFront: {
        name: "CNIC Front",
        uploaded: true,
        fileName: "cnic_front.jpg"
      },
      cnicBack: {
        name: "CNIC Back", 
        uploaded: true,
        fileName: "cnic_back.jpg"
      },
      drivingLicense: {
        name: "Driving License",
        uploaded: true,
        fileName: "driving_license.jpg"
      },
      vehicleRegistration: {
        name: "Vehicle Registration",
        uploaded: true,
        fileName: "vehicle_registration.jpg"
      }
    },
    verificationNotes: "All documents verified successfully. Driver approved for school transport."
  }
];

export default  combinedVerificationData;