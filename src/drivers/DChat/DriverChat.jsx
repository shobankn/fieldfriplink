import React, { useState } from 'react'
import Topbar from '../component/topbar/topbar'
import Sidebar from '../component/sidebar/Sidebar'
import Inbox from '../../School/Chat/Inbox';

function DriverChat() {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
     <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block lg:w-[17%]">
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar drawer for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#7676767a] bg-opacity-50 lg:hidden" onClick={toggleSidebar}>
          <div
            className="absolute left-0 top-0 h-full w-[75%] sm:w-[60%] bg-white shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:w-[83%]">
        <Topbar toggleSidebar={toggleSidebar} />
        </div>
        <main className='mt-[100px]'>

            <Inbox/>


        </main>
        </div>

    
  )
}

export default DriverChat