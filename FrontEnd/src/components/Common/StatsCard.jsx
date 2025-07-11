import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change, 
  changeType, 
  subtitle 
}) => {
  const colorClasses = {
    blue: 'bg-blue-900/20 text-blue-400 border-blue-700/30',
    green: 'bg-green-900/20 text-green-400 border-green-700/30',
    yellow: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30',
    red: 'bg-red-900/20 text-red-400 border-red-700/30',
    purple: 'bg-purple-900/20 text-purple-400 border-purple-700/30'
  };

  const changeColorClasses = {
    increase: 'text-green-400 bg-green-900/20',
    decrease: 'text-red-400 bg-red-900/20'
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-100 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColorClasses[changeType]}`}>
              {changeType === 'increase' ? '↗' : '↘'} {change}
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;