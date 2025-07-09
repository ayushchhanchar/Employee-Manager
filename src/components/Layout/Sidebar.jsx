import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClockIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  UsersIcon,
  CurrencyDollarIcon,
  SpeakerphoneIcon,
  Bars3Icon,
  XMarkIcon
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
      roles: ['admin', 'hr', 'user']
    },
    {
      name: 'Employees',
      icon: UsersIcon,
      path: '/employees',
      roles: ['admin', 'hr']
    },
    {
      name: 'Attendance',
      icon: ClockIcon,
      path: '/attendance',
      roles: ['admin', 'hr', 'user']
    },
    {
      name: 'Leave Management',
      icon: CalendarIcon,
      path: '/leaves',
      roles: ['admin', 'hr', 'user']
    },
    {
      name: 'Payroll',
      icon: CurrencyDollarIcon,
      path: '/payroll',
      roles: ['admin', 'hr', 'user']
    },
    {
      name: 'Announcements',
      icon: SpeakerphoneIcon,
      path: '/announcements',
      roles: ['admin', 'hr', 'user']
    },
    {
      name: 'Holidays',
      icon: DocumentTextIcon,
      path: '/holidays',
      roles: ['admin', 'hr', 'user']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-blue-400">EMS</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <Bars3Icon className="w-5 h-5" />
          ) : (
            <XMarkIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-slate-400 text-center">
            Employee Management System v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;