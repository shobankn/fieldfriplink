import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from '../src/landgingpage/Home/Home'
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

function App() {
  const [count, setCount] = useState(0)

  return (
   <Router>
    <Routes>
      <Route path='/' element={<Home/>}/>,
      <Route path='/about' element={<About/>}/>
      <Route path='/contactus' element={<Contactus/>}/>
      <Route path='/driverdashboard' element={<Driverdashboard/>}/>
      <Route path='/login' element={<Login/>}/>
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












    </Routes>
   </Router>
  )
}

export default App
