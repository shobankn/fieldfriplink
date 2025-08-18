import React, { useState } from 'react';
import { Search, Filter, Eye,  Trash2, Briefcase, UserPlus, Share2, Edit } from 'lucide-react';
import proposalsData from './ProposalData'
import { useNavigate } from 'react-router-dom';
import Navbar from './InviteDriver/Navbar';

const JobProposalsInterface = () => {
  const [activeTab, setActiveTab] = useState('All Job Posts');
  const [searchTerm, setSearchTerm] = useState('');
   const navigate = useNavigate();

   
  const handleNavigate = (id) => {
    navigate(`/job-post/${id}`);
  };




  const getTypeColor = (type) => {
    return type === "Recurring" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-orange-100 text-orange-800";
  };

  const filteredProposals = proposalsData.filter(proposal =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const tabs = [
    {
      label: 'View Job Posts',
      icon: <Briefcase className="w-4 h-4 mr-2" />,
      path: '/view-job-posts'
    },
    {
      label: 'Invite Drivers',
      icon: <UserPlus className="w-4 h-4 mr-2" />,
      path: '/invite-drivers'
    }
  ];

 

  return (
    <>
      {/* Top Navigation */}
      <Navbar/>




    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      



      <div className="max-w-full  mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 capitalize">your all posted jobs</h1>
  

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search job postings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-400" />
              Filters
            </button>
            <button onClick={()=> navigate('/post-trip')} className="bg-red-600 cursor-pointer hover:bg-red-700  justify-center text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <span className="text-lg">+</span>
              Post New Job
            </button>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <div
             key={proposal.id}
               onClick={() => handleNavigate(proposal.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1">
                      <div className='flex justify-between'> 
                        <h3 className="text-lg inter-semibold text-gray-900 mb-2">{proposal.title}</h3>
                         <div className="hidden lg:flex">
                    <span className={`px-3 py-1 justify-center items-center text-center content-center rounded-full text-sm inter-medium ${proposal.statusColor}`}>
                      {proposal.status}
                    </span>
                  </div>
                  </div>
                      <div>
                        
                      </div>
                     
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm inter-medium ${getTypeColor(proposal.type)}`}>
                          {proposal.type}
                        </span>
                        <span className="text-sm inter-regular text-gray-500">{proposal.createdDate}</span>
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      <span className={`px-3 py-1  rounded-full text-sm inter-medium ${proposal.statusColor}`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 inter-regular block">Schedule:</span>
                      <span className="inter-medium text-gray-900">{proposal.schedule.date}</span>
                      <br />
                      <span className="text-gray-600 inter-regular">{proposal.schedule.time}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 inter-regular block">Students:</span>
                      <span className="inter-medium text-gray-900">{proposal.requirements?.students}</span>
                    </div>

                  
                    <div>
                      <span className="text-gray-500 inter-regular block">Proposals:</span>
                      <span className="inter-medium text-gray-900">{proposal.proposals}</span>
                    </div>
                      <div className="flex my-auto  justify-end gap-2">
                      <Share2 className="w-5 h-5 text-[#636AE8]"/>
                      <Eye className="w-5 h-5 text-[#3498DB]" />
                      <Edit className="w-5 h-5 text-[#27AE60]"/>
                      <Trash2 className="w-5 h-5 text-[#E74C3C]" />
                  </div>
                  </div>
                </div>

               
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default JobProposalsInterface;