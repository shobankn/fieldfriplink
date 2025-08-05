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

function App() {

  return (
   <Router>
    <Routes>
      <Route path='/' element={<Home/>}/>
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
    </Routes>
   </Router>
  )
}

export default App;
