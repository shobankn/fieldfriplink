// DeleteChatModal.jsx
import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";
import axios from "axios";
import customer from "../../../images/customer.png";
import { useSocketContext } from "./SocketContext";

const BASE_URL = "https://fieldtriplinkbackend-production.up.railway.app/api";

const DeleteChatModal = ({ isOpen, chat, onClose, onDeleted }) => {
  const socket = useSocketContext();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [animationState, setAnimationState] = React.useState('closed');

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setAnimationState('open'), 10);
    } else {
      setAnimationState('closing');
      setTimeout(() => {
        setAnimationState('closed');
        setIsVisible(false);
      }, 250);
    }
  }, [isOpen]);

  if (!isVisible || !chat) return null;

  const handleDeleteChat = async () => {
    if (!chat) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/chat/${chat.chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        onDeleted(chat.chatId);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const participantUser = chat?.participants?.find((p) => p._id !== socket.userId);

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-250 ease-out ${
        animationState === 'open' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Professional Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-250 ${
          animationState === 'open' ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container with Advanced Animation */}
      <div 
        className={`relative w-full max-w-md mx-auto transform transition-all duration-250 ease-out ${
          animationState === 'open'
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-90 translate-y-6 opacity-0'
        }`}
      >
        {/* Professional White Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Animated Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-red-50 rounded-xl border border-red-100 transition-all duration-300 ${
                  animationState === 'open' ? 'scale-100 rotate-0' : 'scale-90 rotate-12'
                }`}>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className={`transition-all duration-300 delay-100 ${
                  animationState === 'open' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                  <h2 className="text-xl font-semibold text-slate-900 leading-tight">
                    Delete Conversation
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 py-5">
            
            {/* Warning Message */}
            <div className={`mb-6 transition-all duration-400 delay-200 ${
              animationState === 'open' ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}>
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to delete this conversation? All messages and media 
                will be permanently removed and cannot be recovered.
              </p>
            </div>

            {/* User Info Card with Animation */}
            {participantUser && (
              <div className={`mb-6 transition-all duration-500 delay-300 ${
                animationState === 'open' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
              }`}>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <img
                        src={participantUser.profilePicture || customer}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg transition-transform duration-200 group-hover:scale-105"
                        alt={participantUser.fullName || "User"}
                        onError={(e) => {
                          e.target.src = customer;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate text-base">
                        {participantUser.fullName || "Unknown User"}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Chat conversation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`px-6 pb-6 transition-all duration-500 delay-400 ${
            animationState === 'open' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                disabled={isDeleting}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-400 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center justify-center gap-2.5 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Overlay */}
          {isDeleting && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-opacity duration-200">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-red-300 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-900">Deleting conversation</p>
                  <p className="text-sm text-slate-500 mt-1">Please wait...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteChatModal;