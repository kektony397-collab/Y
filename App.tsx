
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import MapView from './components/MapView';
import Controls from './components/Controls';
import StatsDisplay from './components/StatsDisplay';
import SessionList from './components/SessionList';
import { MapPinIcon, ListBulletIcon } from './components/icons/Icons';

type View = 'tracking' | 'history';

const App: React.FC = () => {
  const [view, setView] = useState<View>('tracking');

  return (
    <AppProvider>
      <div className="flex flex-col h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="flex-grow flex flex-col relative">
          {view === 'tracking' && (
            <div className="flex-grow flex flex-col md:flex-row h-full">
              <div className="w-full md:w-2/3 h-1/2 md:h-full relative">
                <MapView />
                <Controls />
              </div>
              <div className="w-full md:w-1/3 h-1/2 md:h-full p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <StatsDisplay />
              </div>
            </div>
          )}
          {view === 'history' && (
            <div className="p-4 h-full overflow-y-auto">
              <SessionList />
            </div>
          )}
        </main>
        <footer className="w-full bg-white dark:bg-gray-800 shadow-t-lg p-2 flex justify-around">
          <button
            onClick={() => setView('tracking')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              view === 'tracking' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <MapPinIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Tracking</span>
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              view === 'history' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ListBulletIcon className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
