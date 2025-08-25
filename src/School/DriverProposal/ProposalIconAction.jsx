import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleXIcon, X } from 'lucide-react';

const ProposalIconActions = ({ proposalId, onActionComplete, disabled }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(null); // null, 'accepted', or 'rejected'

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

  const confirmAction = (status) => {
    setShowConfirm(null);
    handleProposalAction(status);
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => setShowConfirm('accepted')}
          disabled={disabled}
          className={`group p-2 cursor-pointer text-gray-500 rounded-lg transition-all duration-200 ease-in-out 
            ${disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:text-green-600 hover:bg-green-50 hover:scale-105 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            }`}
        >
          <CheckCircle className="w-4 h-4 text-[#4ACF7B] group-hover:text-green-600 transition-colors duration-200" />
        </button>
        <button
          onClick={() => setShowConfirm('rejected')}
          disabled={disabled}
          className={`group p-2 cursor-pointer text-gray-500 rounded-lg transition-all duration-200 ease-in-out 
            ${disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:text-red-600 hover:bg-red-50 hover:scale-105 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            }`}
        >
          <CircleXIcon className="w-4 h-4 text-red-600 group-hover:text-red-600 transition-colors duration-200" />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {showConfirm === 'accepted' ? 'Acceptance' : 'Rejection'}
              </h3>
              <button
                onClick={() => setShowConfirm(null)}
                className="p-1 cursor-pointer  text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {showConfirm === 'accepted' ? 'accept' : 'reject'} this proposal?
              {showConfirm === 'rejected' && ' This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 cursor-pointer  text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmAction(showConfirm)}
                className={`px-4 cursor-pointer  py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${showConfirm === 'accepted'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                  }`}
              >
                {showConfirm === 'accepted' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProposalIconActions;