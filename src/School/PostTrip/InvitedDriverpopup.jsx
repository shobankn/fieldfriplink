import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Send, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InviteDriverPopup = ({ isOpen, onClose, tripId, onPublish }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]); // ✅ multiple
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('Please accept the invitation');
  const baseURL = 'https://fieldtriplinkbackend-production.up.railway.app/api';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to view drivers.', { autoClose: 3000 });
          return;
        }

        const res = await axios.get(
          `${baseURL}/school/drivers?myDriversOnly=true&status=approved`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data.drivers) {
          setDrivers(res.data.drivers);
        } else {
          toast.error('Unexpected response from server', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Failed to fetch drivers', { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [isOpen]);

  // ✅ toggle driver selection
  const toggleDriver = (driver) => {
    setSelectedDrivers((prev) =>
      prev.some((d) => d._id === driver._id)
        ? prev.filter((d) => d._id !== driver._id) // remove if already selected
        : [...prev, driver] // add new
    );
  };

  const handleSendJobPost = async () => {
    if (selectedDrivers.length === 0) {
      toast.error('Please select at least one driver.', { autoClose: 3000 });
      return;
    }
    if (inviting) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required. Please log in.', { autoClose: 3000 });
      return;
    }

    try {
      setInviting(true);
      // ✅ send invitation to all selected drivers
      await Promise.all(
        selectedDrivers.map((driver) =>
          axios.post(
            `${baseURL}/school/trip/${tripId}/invite-driver`,
            { driverId: driver._id, note },
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
          )
        )
      );

      toast.success('Invitations sent successfully.', {
        autoClose: 3000,
        onClose: () => {
          setSelectedDrivers([]);
          setNote('Please accept the invitation');
        },
      });
    } catch (err) {
      toast.warning('Some drivers may have already been invited.', { autoClose: 3000 });
    } finally {
      setInviting(false);
    }
  };

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required. Please log in.', { autoClose: 3000 });
      return;
    }

    try {
      await axios.patch(
        `${baseURL}/school/trip/${tripId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      toast.success('Trip published successfully!', { autoClose: 3000 });

      setTimeout(() => {
        onClose();
        navigate('/job-post');
      }, 3000);
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish trip', { autoClose: 3000 });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invite Drivers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver list */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-red-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <div
                    key={driver._id}
                    onClick={() => toggleDriver(driver)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDrivers.some((d) => d._id === driver._id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-500">{driver.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{driver.gender}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No approved drivers found.</p>
              )}
            </div>
          )}

          {/* Note field */}
          {selectedDrivers.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invitation Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                rows={3}
                placeholder="Enter a note for the driver(s)"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end p-4 border-t border-gray-200 space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSendJobPost}
            disabled={inviting || selectedDrivers.length === 0}
            className={`px-4 py-2 flex items-center justify-center rounded-lg text-white ${
              inviting || selectedDrivers.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            {inviting ? 'Sending...' : 'Send Invitations'}
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Publish Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InviteDriverPopup;
