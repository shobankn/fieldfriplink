import React, { useState } from 'react';
import TopBar from '../Topbar';
import PostTripForm from './PostTripForm';
import Sidebar from '../Sidebar';
import HeaderTopBar from '../HeaderTopbar';

function Trip() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <PostTripForm />
        </main>
      </div>
    </div>
  );
}

export default Trip;