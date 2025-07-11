import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { holidayAPI } from '../../services/api';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await holidayAPI.getUpcoming({ limit: 5 });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'National': return 'bg-red-900/20 text-red-400 border-red-700/30';
      case 'Regional': return 'bg-orange-900/20 text-orange-400 border-orange-700/30';
      case 'Company': return 'bg-blue-900/20 text-blue-400 border-blue-700/30';
      case 'Optional': return 'bg-gray-700/20 text-gray-400 border-gray-600/30';
      default: return 'bg-blue-900/20 text-blue-400 border-blue-700/30';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Upcoming Events</h3>
            <p className="text-sm text-gray-400 mt-1">Holidays and important dates</p>
          </div>
          <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="group flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                      {event.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-400">{formatDate(event.date)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className={`font-medium ${
                    getDaysUntil(event.date) === 'Today' ? 'text-green-400' :
                    getDaysUntil(event.date) === 'Tomorrow' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {getDaysUntil(event.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SparklesIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No upcoming events</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;