import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleXIcon } from 'lucide-react';

const ProposalIconActions = ({ proposalId, onActionComplete }) => {
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
        onClick={() => handleProposalAction('accepted')}
        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      >
        <CheckCircle className="text-[#4ACF7B] w-4 h-4" />
      </button>
      <button
        onClick={() => handleProposalAction('rejected')}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <CircleXIcon className="text-red-600 w-4 h-4" />
      </button>
    </div>
  );
};

export default ProposalIconActions;
