import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleXIcon } from 'lucide-react';

const ProposalIconActions = ({ proposalId, onActionComplete,disabled }) => {
  const navigate = useNavigate();

  const handleProposalAction = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `https://fieldtriplinkbackend-production.up.railway.app/api/school/proposal/${proposalId}/decision`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || `Proposal ${status} successfully!`);

      // Optional callback to parent if provided
      if (onActionComplete) {
        onActionComplete(proposalId, status);
      }

   

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Unauthorized: Invalid or expired token'
          : `Failed to ${status} proposal`);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
         onClick={() => handleProposalAction("accepted")}
        disabled={disabled}
        className={`group p-2 text-gray-500 rounded-lg transition-all duration-200 ease-in-out 
          ${disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:text-green-600 hover:bg-green-50 hover:scale-105 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
          }`}
      >

        <CheckCircle className="w-4 h-4 text-[#4ACF7B] group-hover:text-green-600 transition-colors duration-200" />
      </button>
      <button
         onClick={() => handleProposalAction("rejected")}
        disabled={disabled}
        className={`group p-2 text-gray-500 rounded-lg transition-all duration-200 ease-in-out 
          ${disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:text-red-600 hover:bg-red-50 hover:scale-105 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
          }`}
        
        
      >
        <CircleXIcon className="w-4 h-4 text-red-600 group-hover:text-blue-600 transition-colors duration-200" />
      </button>
    </div>
  );
};

export default ProposalIconActions;
