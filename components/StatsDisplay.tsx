
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SpeedIcon, DistanceIcon, TimerIcon, AreaIcon } from './icons/Icons';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; unit: string; }> = ({ icon, title, value, unit }) => (
  <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  </div>
);

const StatsDisplay: React.FC = () => {
  const { state } = useAppContext();
  const { stats } = state;

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");
  };

  return (
    <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Live Statistics</h2>
      <StatCard 
        icon={<SpeedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} 
        title="Speed" 
        value={stats.speed.toFixed(1)} 
        unit="km/h"
      />
      <StatCard 
        icon={<DistanceIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} 
        title="Distance" 
        value={stats.distance.toFixed(2)} 
        unit="km"
      />
      <StatCard 
        icon={<TimerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} 
        title="Duration" 
        value={formatDuration(stats.duration)} 
        unit=""
      />
      <StatCard 
        icon={<AreaIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} 
        title="Area Covered" 
        value={(stats.area * 1000000).toFixed(1)} // km² to m²
        unit="m²"
      />
    </div>
  );
};

export default StatsDisplay;
