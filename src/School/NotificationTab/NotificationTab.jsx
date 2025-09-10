import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import HeaderTopBar from '../HeaderTopbar';
import DriverRequestsComponent from '../DriverProposal/DriverProposalBody';
import NotificationBody from './NotificationBody';


function NotificationTab() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-58 sm:ml-0">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="w-full lg:ml-58 sm:ml-0" />
        
        <main className="flex-1 lg:p-4 overflow-y-auto w-full max-w-full">
        </main>
        <NotificationBody/>
      </div>
    </div>
  );
}

export default NotificationTab;