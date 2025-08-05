import React, { useState } from 'react'
import DashboardTotalTripSection from './TripBody';
import TopBar from '../Topbar';
import Sidebar from '../Sidebar';
import TotalTripTopBar from './TotalTripTopbar';

function Totaltrip() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    
     <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-0">
        <TotalTripTopBar onMenuClick={() => setSidebarOpen(true)}/>

        
       <DashboardTotalTripSection/>
      </div>
    </div>
  )
}

export default Totaltrip;