import HeaderTopBar from '../HeaderTopbar';
import Sidebar from '../Sidebar';
import Inbox from '../Chat/Inbox'
import { useState } from 'react';

function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen lg:ml-58">
        {/* Header - fixed height */}
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58 flex-shrink-0" />
        
        {/* Main content - takes remaining height */}

         
           <div className=" hidden sm:block ml-13 mt-4 sm:mt-6 pb-[20px]">
          <h1 className="text-2xl lg:text-3xl archivo-bold text-gray-800 ">Messages</h1>
          <p className="text-gray-600">Monitor your active trips in real-time.</p>
        </div>
       

        <main className="flex-1     overflow-y-auto">
          
            
          <div className="">
            <Inbox />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Messages;