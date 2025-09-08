import React, { useState } from 'react';
import HeaderTopBar from '../HeaderTopbar'; // Adjust path as per your project structure
import Sidebar from '../Sidebar'; // Adjust path as per your project structure
import Allinvitations from './InviteDriver/Allinvitations';

const Internalinvitations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Allinvitations/>
        </main>
      </div>
    </div>
  );
};

export default Internalinvitations;