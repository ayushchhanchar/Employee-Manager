import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ actions = [] }) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
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
                  p-4 rounded-lg text-white text-center transition-all duration-200
                  ${colorClasses[action.color] || colorClasses.blue}
                  ${action.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md transform hover:-translate-y-0.5'
                  }
                `}
              >
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-sm opacity-90 mt-1">{action.description}</p>
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;