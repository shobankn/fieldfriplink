import React, { useState } from 'react';
import TopBar from '../Topbar';
import TripTopbar from '../PostTrip/TripTopbar';
import Sidebar from '../Sidebar';
import ProposalDetailsPage from './ProposalDetailPage';
import HeaderTopBar from '../HeaderTopbar';

function ProposalDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <ProposalDetailsPage />
        </main>
      </div>
    </div>
  );
}

export default ProposalDetails;