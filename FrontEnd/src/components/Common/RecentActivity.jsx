import React from 'react';
import { 
  ClockIcon, 
  CalendarDaysIcon, 
  UserIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance':
        return ClockIcon;
      case 'leave':
        return CalendarDaysIcon;
      case 'employee':
        return UserIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'attendance':
        return 'text-green-600 bg-green-100';
      case 'leave':
        return 'text-blue-600 bg-blue-100';
      case 'employee':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (activities.length === 0) {
    return (
      <div className="p-6 text-center">
        <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;