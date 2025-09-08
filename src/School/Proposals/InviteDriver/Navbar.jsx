import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { UserPlus, Eye, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: 'View Job Posts',
      icon: <Eye className="w-5 h-5 mr-2" />,
      path: '/job-post',
    },
    {
      label: 'Invite Drivers',
      icon: <UserPlus className="w-5 h-5 mr-2" />,
      path: '/job-post/invite-drivers',
    },
    {
      label: 'My Hired Drivers',
      icon: <User className="w-5 h-5 mr-2" />,
      path: '/job-post/my-hired-driver',
    },
  ];

 

  const initialActiveTab =
    tabs.find((tab) => tab.path === location.pathname)?.label ||
    'View Job Posts';
  const [activeMainTab, setActiveMainTab] = useState(initialActiveTab);

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) {
      setActiveMainTab(currentTab.label);
    }
  }, [location.pathname]);

  const handleNavigation = (tab) => {
    setActiveMainTab(tab.label);
    navigate(tab.path);
  };

  return (

    <>

       <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    <nav className="bg-white shadow mt-6 sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center">
          {/* Scrollable Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleNavigation(tab)}
                className={`flex items-center flex-shrink-0 px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                  ${
                    activeMainTab === tab.label
                      ? 'text-[#B00000] border-b-2 border-[#B00000]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                aria-current={activeMainTab === tab.label ? 'page' : undefined}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
    </>

 
  );
};

export default Navbar;
