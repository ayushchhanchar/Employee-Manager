import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClockIcon, 
  CalendarIcon, 
  SpeakerWaveIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { CollapsedAtom } from '../../atom/Collapsed';
import { userRoleSelector } from '../../store/authStore';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useRecoilState(CollapsedAtom);
  const userRole = useRecoilValue(userRoleSelector);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      roles: ['admin', 'hr', 'user'],
      description: 'Overview & Analytics'
    },
    {
      name: 'Employees',
      icon: UsersIcon,
      path: '/employees',
      roles: ['admin', 'hr'],
      description: 'Manage Team Members'
    },
    {
      name: 'Attendance',
      icon: ClockIcon,
      path: '/attendance',
      roles: ['admin', 'hr', 'user'],
      description: 'Track Work Hours'
    },
    {
      name: 'Leave Management',
      icon: CalendarIcon,
      path: '/leaves',
      roles: ['admin', 'hr', 'user'],
      description: 'Request & Approve Leaves'
    },
    {
      name: 'Payroll',
      icon: CurrencyDollarIcon,
      path: '/payroll',
      roles: ['admin', 'hr', 'user'],
      description: 'Salary & Benefits'
    },
    {
      name: 'Announcements',
      icon: SpeakerWaveIcon,
      path: '/announcements',
      roles: ['admin', 'hr', 'user'],
      description: 'Company Updates'
    },
    {
      name: 'Holidays',
      icon: CalendarDaysIcon,
      path: '/holidays',
      roles: ['admin', 'hr', 'user'],
      description: 'Holiday Calendar'
    },
    {
      name: 'Notifications',
      icon: BellIcon,
      path: '/notifications',
      roles: ['admin', 'hr', 'user'],
      description: 'System Alerts'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 shadow-lg
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EMS Pro</h1>
              <p className="text-xs text-gray-500">Employee Management</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          ) : (
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={`
                    group flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role Badge */}
      {!isCollapsed && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                userRole === 'admin' ? 'bg-red-500' : 
                userRole === 'hr' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {userRole === 'admin' ? 'A' : userRole === 'hr' ? 'H' : 'E'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{userRole}</p>
                <p className="text-xs text-gray-500">
                  {userRole === 'admin' ? 'System Administrator' : 
                   userRole === 'hr' ? 'Human Resources' : 'Employee'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;