import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import HeaderTopBar from '../HeaderTopbar';
import TripManagementBody from './TripManagmentBody'

function TripManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-58 sm:ml-0">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="w-full lg:ml-58 sm:ml-0" />
        
        <main className="flex-1  lg:p-6 overflow-y-auto w-full max-w-full">
          <TripManagementBody />
        </main>
      </div>
    </div>
  );
}

export default TripManagement;