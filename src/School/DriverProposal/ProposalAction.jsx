import React from 'react';
import { CheckCircle, CircleXIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProposalActions = ({ proposalId, onProposalUpdate,disabled }) => {
      const navigate = useNavigate();


const handleProposalDecision = async (status) => {
      if (disabled) return; // ✅ prevent API call if disabled

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(
      `https://fieldtriplinkbackend-production.up.railway.app/api/school/proposal/${proposalId}/decision`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Always show success toast (backend message if exists, otherwise default)
    toast.success(response.data.message || `Proposal ${status} successfully!`, {
      autoClose: 3000,
    });

    if (status === 'rejected') {
      setTimeout(() => {
        onProposalUpdate(proposalId);
      }, 300);
    }

    // Navigate back after a short delay so user sees the toast
    setTimeout(() => {
      navigate(-1);
    }, 1000);

  } catch (err) {
    // ✅ Show backend error message or fallback messages
    const errorMessage =
      err.response?.data?.message ||
      (err.response?.status === 401
        ? 'Unauthorized: Invalid or expired token'
        : `Failed to ${status} proposal. Please try again.`);

    toast.error(errorMessage, { autoClose: 4000 });
  }
};



  return (
    <div className="mt-auto flex flex-col space-y-3">
      <button
        onClick={() => handleProposalDecision('accepted')}
         disabled={disabled}
className={`text-center cursor-pointer  justify-center flex py-3 px-4 rounded-lg font-medium w-full transition-colors
          ${disabled
            ? "bg-gray-300 cursor-not-allowed opacity-50"
            : "bg-green-500 text-white hover:bg-green-600"
          }`}      >
        <CheckCircle className="mr-2" />
        Accept Proposal
      </button>
      <button
        onClick={() => handleProposalDecision('rejected')}
disabled={disabled}
        className={`flex  !cursor-pointer justify-center py-3 px-4 rounded-lg font-medium w-full transition-colors
          ${disabled
            ? "bg-gray-300 cursor-not-allowed opacity-50"
            : "bg-red-500 text-white hover:bg-red-600"
          }`}      >
        <CircleXIcon className="mr-2" />
        Reject Proposal
      </button>
    </div>
  );
};

export default ProposalActions;