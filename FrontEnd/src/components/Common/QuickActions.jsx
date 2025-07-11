import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ actions = [] }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    green: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    red: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100">Quick Actions</h3>
        <p className="text-sm text-gray-400 mt-1">Frequently used actions</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Component = action.link ? Link : 'button';
            const props = action.link 
              ? { to: action.link }
              : { onClick: action.action, disabled: action.disabled };

            return (
              <Component
                key={index}
                {...props}
                className={`
                  group p-4 rounded-xl text-white text-center transition-all duration-200 relative overflow-hidden
                  ${colorClasses[action.color] || colorClasses.blue}
                  ${action.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg transform hover:-translate-y-1'
                  }
                `}
              >
                <div className="relative z-10">
                  {action.icon && (
                    <action.icon className="w-6 h-6 mx-auto mb-2" />
                  )}
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{action.description}</p>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;