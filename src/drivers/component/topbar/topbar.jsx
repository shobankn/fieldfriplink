import React from 'react';

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#ffffff] border border-[grey]  p-4 flex justify-between items-center z-10">
      <button className="lg:hidden" onClick={toggleSidebar}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1 text-center lg:text-left">
        {/* <h1 className="text-xl font-bold">App Dashboard</h1> */}
      </div>
      <div className="text-lg text-[#000000]">Driver: John Doe</div>
    </div>
  );
};

export default Topbar;