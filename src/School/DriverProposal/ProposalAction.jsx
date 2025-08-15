import React from 'react';
import { CheckCircle, CircleXIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProposalActions = ({ proposalId, onProposalUpdate }) => {
      const navigate = useNavigate();


const handleProposalDecision = async (status) => {
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
        className="text-center justify-center flex bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium w-full"
      >
        <CheckCircle className="mr-2" />
        Accept Proposal
      </button>
      <button
        onClick={() => handleProposalDecision('rejected')}
        className="flex justify-center bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium w-full"
      >
        <CircleXIcon className="mr-2" />
        Reject Proposal
      </button>
    </div>
  );
};

export default ProposalActions;