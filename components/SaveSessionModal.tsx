
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/db';

interface SaveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveSessionModal: React.FC<SaveSessionModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSessionName(`Session - ${new Date().toLocaleDateString()}`);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!sessionName.trim() || state.currentPath.length < 2) {
        alert("Please provide a session name and ensure there is a path to save.");
        return;
    }

    const newSession = {
      name: sessionName,
      startTime: state.currentPath[0].timestamp,
      endTime: state.currentPath[state.currentPath.length - 1].timestamp,
      path: state.currentPath,
      distance: state.stats.distance,
      area: state.stats.area,
    };
    
    const id = await db.sessions.add(newSession);
    dispatch({ type: 'ADD_SAVED_SESSION', payload: { ...newSession, id } });
    dispatch({ type: 'RESET_TRACKING' });
    onClose();
  };

  const handleDiscard = () => {
    dispatch({ type: 'RESET_TRACKING' });
    onClose();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Save Session</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enter a name for your tracking session to save it for later.
            </p>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Morning Run"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveSessionModal;
