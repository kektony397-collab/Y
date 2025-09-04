
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/db';
import { generatePdf } from '../services/pdfGenerator';
import { CalendarIcon, ClockIcon, RouteIcon, AreaIcon, TrashIcon, DownloadIcon } from './icons/Icons';

const SessionList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { savedSessions } = state;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      await db.sessions.delete(id);
      dispatch({ type: 'DELETE_SAVED_SESSION', payload: id });
    }
  };
  
  const handleExport = async (session: typeof savedSessions[0]) => {
      if (!session.id) return;
      const fullSession = await db.sessions.get(session.id);
      if(fullSession){
          alert("Generating PDF... this may take a moment.");
          await generatePdf(fullSession);
      }
  };
  
  return (
    <div className="space-y-4">
       <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Session History</h2>
       {savedSessions.length === 0 ? (
         <p className="text-center text-gray-500 dark:text-gray-400 py-8">No saved sessions yet. Start tracking to create one!</p>
       ) : (
        <AnimatePresence>
            {savedSessions.sort((a,b) => b.startTime - a.startTime).map((session) => (
            <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md flex flex-col space-y-3"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{session.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3"/>
                            {new Date(session.startTime).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleExport(session)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Export to PDF">
                            <DownloadIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDelete(session.id!)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors" aria-label="Delete Session">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <RouteIcon className="w-4 h-4 text-gray-400"/>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{session.distance.toFixed(2)} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400"/>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{Math.round((session.endTime - session.startTime) / 60000)} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <AreaIcon className="w-4 h-4 text-gray-400"/>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{(session.area * 1000000).toFixed(1)} m²</span>
                    </div>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
       )}
    </div>
  );
};

export default SessionList;
