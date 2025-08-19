import React, { useState } from 'react'
import Sidebar from '../Sidebar';
import HeaderTopBar from '../HeaderTopbar';



function Trip() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
    <div className="min-h-screen bg-gray-50   flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 relative  lg:ml-0">
         <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} />
            
        
         

      </div>
    </div>
    </>
  )
}

export default Trip