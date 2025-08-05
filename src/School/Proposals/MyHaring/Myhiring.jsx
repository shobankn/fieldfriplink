import React, { useState } from 'react'
import Sidebar from '../../Sidebar';
import ProposalTopBar from '../PropostalTopbar';


function MyHiring() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    
     <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-0">
        <ProposalTopBar onMenuClick={() => setSidebarOpen(true)}/>

        
     
      </div>
    </div>
  )
}

export default MyHiring;