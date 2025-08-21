import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from '../src/landgingpage/Home/Home'
import Dashboard from './School/Dashboard';
import Totaltrip from './School/Total trip/Totaltrip';
import PostTripForm from './School/PostTrip/PostTripForm';
import Trip from './School/PostTrip/Trip';
import TripManagment from './School/TripManagment/TripManage';
import Location from './School/LiveLocation/Location';
import Proposals from './School/Proposals/Proposals';
import ProposalDetails from './School/Proposals/ProposalDetails';
import InviteDriver from './School/Proposals/InviteDriver/InviteDriver';
import MyHiring from './School/Proposals/MyHaring/Myhiring';
import HireDriver from './School/HireDriver/HireDriver';
import HireDriverDetails from './School/HireDriver/HireDriverDetails';
import Setting from './School/Setting/Setting';
import DriverProposal from './School/DriverProposal/DriverProposal';
import InviteDriverPopUp from './School/Proposals/InviteDriver/InviteDriverPopup';
import About from './landgingpage/About/About';
import Driverdashboard from './drivers/dashboard/Driverdashboard';
import Login from './auth/Login';
import Resgister from './auth/Resgister';
import ForgetPassword from './auth/Forgetpassword';
import Notifications from './drivers/notifications/Notifications';
import MyProporals from './drivers/Proposals/MyProporals'
import MyRides from './drivers/myrides/MyRides';
import AvailableRides from './drivers/Availablerides/AvailableRides';
import Documents from './drivers/Documents/Documents';
import DriverProfile from './drivers/DriverProfile/DriverProfile';
import DriverReviews from './drivers/driverreviews/DriverReviews';
import SchoolResponse from './drivers/schoolresponse/Schoolresponse';
import Contactus from './landgingpage/ContactUs/Contactus';
import LiveGPSTracking from './drivers/myrides/LiveTracking';
import EmailVarification from './auth/EmailVarification';
import PinVarification from './auth/PinVarification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './School/ScrollToTop';
import TripFeedback from './School/TripManagment/TripFeedBack';
import ProtectedRoute from './School/ProtectRoute'
import Messages from './School/messages/Messages';
import DriverChat from './drivers/DChat/DriverChat';
import SchoolProfileView from './School/Setting/ProfileViwPage';
import Profileview from './School/Setting/Profileview';

function App() {

  return (

   
   <Router>
    <ScrollToTop/>
     <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" 
      />
    <Routes>
      <Route path='/dashboard' element={ <ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path='/total-trip' element={<ProtectedRoute><Totaltrip/></ProtectedRoute>}/>
      <Route path='/post-trip' element ={<ProtectedRoute><Trip/></ProtectedRoute>}/>
      <Route path="/post-trip-update/:id" element={<ProtectedRoute><Trip/></ProtectedRoute>} />
      <Route path='/trip-management' element={<ProtectedRoute><TripManagment/></ProtectedRoute>}/>
      <Route path='/live-tracking' element={<ProtectedRoute><Location/></ProtectedRoute>}/>
      <Route path='/job-post' element={<ProtectedRoute><Proposals/></ProtectedRoute>}/>
      <Route path='/job-post/:id' element={<ProtectedRoute><ProposalDetails/></ProtectedRoute>}/>
      <Route path='/job-post/invite-drivers' element={<ProtectedRoute><InviteDriver/></ProtectedRoute>}/>
      <Route path='/my-hires' element={<ProtectedRoute><MyHiring/></ProtectedRoute>}/>
      <Route path='/hire-driver' element={<ProtectedRoute><HireDriver/></ProtectedRoute>}/>
      <Route path='/hire-driver/:id'element={<ProtectedRoute><HireDriverDetails/></ProtectedRoute>}/>
      <Route path='/proposal' element={<ProtectedRoute><DriverProposal/></ProtectedRoute>}/>
      <Route path='/messages' element={<ProtectedRoute><Messages/></ProtectedRoute>}/>
     

      {/* <Route path='/assign-job' element={<InviteDriverPopUp/>}/> */}
            <Route 
        path='/trip-management/feedback/:tripId/:driverId' 
        element={<ProtectedRoute><TripFeedback /></ProtectedRoute>} 
      />

      {/* <Route path='/setting' element={<Setting/>}/> */}
      <Route path='/setting/update-profile' element={<ProtectedRoute><Setting/></ProtectedRoute>} />
       <Route path='/setting' element={<ProtectedRoute><Profileview/></ProtectedRoute>} />



      <Route path='/' element={<Home/>}/>,
      <Route path='/about' element={<About/>}/>
      <Route path='/contactus' element={<Contactus/>}/>
      <Route path='/driverdashboard' element={<Driverdashboard/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Resgister/>}/>
      <Route path='/forgetpassword' element={<ForgetPassword/>}/>
      <Route path='/emailvarification' element={<EmailVarification/>}/>
      <Route path='/pinverification' element={<PinVarification/>}/>
      <Route path='/notifications' element={<Notifications/>}/>
      <Route path='/proposals' element={<MyProporals/>}/>
      <Route path='/myrides' element={<MyRides/>}/>
      <Route path='/availablerides' element={<AvailableRides/>}/>
      <Route path='/documents' element={<Documents/>}/>
      <Route path='/driverprofile' element={<DriverProfile/>}/>
      <Route path='/driverreviews' element={<DriverReviews/>}/>
      <Route path='/schoolresponse' element={<SchoolResponse/>}/>
      <Route path='/driver-live-tracking' element={<LiveGPSTracking/>}/>
      <Route path='/chat' element={<DriverChat/>}/>


    </Routes>
   </Router>
  )
}

export default App;


