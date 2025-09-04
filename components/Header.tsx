
import React from 'react';
import { CompassIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center space-x-3">
      <CompassIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Offline GPS Tracker</h1>
    </header>
  );
};

export default Header;
