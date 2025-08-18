import Sidebar from './Sidebar';
import TopBar from './Topbar';
import DashboardStats from './DashboardStatusCard';
import QuickActions from './QuickAction';
import Notification from './Notification';
import ActiveTrips from './ActiveTrip';
import UpcomingTrips from './UpcomingTrip';
import { useState } from 'react';
import HeaderTopBar from './HeaderTopbar';
import HeaderText from './DashboardHeaderText';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <HeaderTopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <HeaderText />
          {/* Top Stats */}
          <DashboardStats />

          {/* Equal Height Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 mt-4">
            {/* Left Column */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                <QuickActions />
                <Notification />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between ">
              <UpcomingTrips />
            </div>
          </div>

          {/* Bottom Full Width Component */}
          <div className="mt-6 w-full pr-0 sm:pr-4">
            <ActiveTrips />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;