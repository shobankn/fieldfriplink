import React, { useState } from 'react';
import HeaderTopBar from '../HeaderTopbar';
import Sidebar from '../Sidebar';
import AllHairDriverList from './MyHaring/AllHairDriver';


function MyHairDriver() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <AllHairDriverList/>
        </main>
      </div>
    </div>
  );
}

export default MyHairDriver;