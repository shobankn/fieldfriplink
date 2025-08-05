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
import MyProposals from './drivers/Proposals/myproporals';
import MyRIdes from './drivers/myrides/MyRIdes';
import AvailableRides from './drivers/Availablerides/AvailableRides';
import Documents from './drivers/Documents/Documents';
import DriverProfile from './drivers/DriverProfile/DriverProfile';
import DriverReviews from './drivers/driverreviews/DriverReviews';
import SchoolResponse from './drivers/schoolresponse/Schoolresponse';
import Contactus from './landgingpage/ContactUs/Contactus';
import LiveGPSTracking from './drivers/myrides/LiveTracking';

function App() {

  return (
   <Router>
    <Routes>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/total-trip' element={<Totaltrip/>}/>
      <Route path='/post-trip' element ={<Trip/>}/>
      <Route path='/trip-management' element={<TripManagment/>}/>
      <Route path='/live-tracking' element={<Location/>}/>
      <Route path='/job-post' element={<Proposals/>}/>
      <Route path='/job-post/:id' element={<ProposalDetails/>}/>
      <Route path='/job-post/invite-drivers' element={<InviteDriver/>}/>
      <Route path='/my-hires' element={<MyHiring/>}/>
      <Route path='/hire-driver' element={<HireDriver/>}/>
      <Route path='/hire-driver/:id'element={<HireDriverDetails/>}/>
      <Route path='/proposal' element={<DriverProposal/>}/>
      {/* <Route path='/assign-job' element={<InviteDriverPopUp/>}/> */}
      <Route path='/setting' element={<Setting/>}/>



      <Route path='/home' element={<Home/>}/>,
      <Route path='/about' element={<About/>}/>
      <Route path='/contactus' element={<Contactus/>}/>
      <Route path='/driverdashboard' element={<Driverdashboard/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Resgister/>}/>
      <Route path='/forgetpassword' element={<ForgetPassword/>}/>
      <Route path='/notifications' element={<Notifications/>}/>
      <Route path='/proposals' element={<MyProposals/>}/>
      <Route path='/myrides' element={<MyRIdes/>}/>
      <Route path='/availablerides' element={<AvailableRides/>}/>
      <Route path='/documents' element={<Documents/>}/>
      <Route path='/driverprofile' element={<DriverProfile/>}/>
      <Route path='/driverreviews' element={<DriverReviews/>}/>
      <Route path='/schoolresponse' element={<SchoolResponse/>}/>
      <Route path='/driver-live-tracking' element={<LiveGPSTracking/>}/>












    </Routes>
   </Router>
  )
}

export default App;
