import React from 'react';
import { useRecoilValue } from 'recoil';
import Sidebar from './Sidebar';
import Header from './Header';
import { CollapsedAtom } from '../../atom/Collapsed';

const Layout = ({ children }) => {
  const isCollapsed = useRecoilValue(CollapsedAtom);

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Header />
      <main className={`
        pt-16 transition-all duration-300 bg-gray-900
        ${isCollapsed ? 'ml-16' : 'ml-64'}
      `}>
        <div className="p-6 bg-gray-900 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;