
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import SaveSessionModal from './SaveSessionModal';
import { PlayIcon, PauseIcon, StopIcon, SaveIcon, TrashIcon } from './icons/Icons';

const Controls: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { isTracking, isPaused, currentPath } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    navigator.geolocation.getCurrentPosition(
      () => dispatch({ type: 'START_TRACKING' }),
      (err) => alert(`Please enable location services to start tracking. Error: ${err.message}`)
    );
  };
  
  const handlePauseResume = () => {
    if (isPaused) {
      dispatch({ type: 'RESUME_TRACKING' });
    } else {
      dispatch({ type: 'PAUSE_TRACKING' });
    }
  };

  const handleStop = () => {
    dispatch({ type: 'STOP_TRACKING' });
    if(currentPath.length > 1) {
      setIsModalOpen(true);
    } else {
      dispatch({ type: 'RESET_TRACKING' });
    }
  };
  
  const handleReset = () => {
      dispatch({ type: 'STOP_TRACKING' });
      dispatch({ type: 'RESET_TRACKING' });
  };

  return (
    <>
      <div className="absolute bottom-6 right-6 flex flex-col items-center space-y-4">
        {!isTracking ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Start Tracking"
          >
            <PlayIcon className="w-8 h-8" />
          </motion.button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePauseResume}
              className={`${isPaused ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded-full p-3 shadow-lg transition-colors focus:outline-none focus:ring-2`}
              aria-label={isPaused ? "Resume Tracking" : "Pause Tracking"}
            >
              {isPaused ? <PlayIcon className="w-6 h-6" /> : <PauseIcon className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              aria-label="Stop Tracking"
            >
              <StopIcon className="w-8 h-8" />
            </motion.button>
          </div>
        )}
      </div>
      { currentPath.length > 1 && (
        <div className="absolute bottom-6 left-6 flex flex-col items-center space-y-4">
            {isTracking ? (
                 <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2"
                  aria-label="Reset Tracking"
                >
                  <TrashIcon className="w-6 h-6" />
                </motion.button>
            ) : (
                 <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2"
                  aria-label="Save Session"
                >
                  <SaveIcon className="w-6 h-6" />
                </motion.button>
            )}
        </div>
      )}
      <SaveSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Controls;
