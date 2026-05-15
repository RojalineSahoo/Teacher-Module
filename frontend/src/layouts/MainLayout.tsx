import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/topics': 'Topics & Chapters',
  '/classes': 'Class Management',
  '/attendance': 'Attendance System',
  '/assignments': 'Assignments',
  '/assessments': 'Assessments',
  '/creator': 'PPT & Mind Maps',
  '/reports': 'Reports & Analytics',
  '/grievances': 'Grievances',
  '/chat': 'Chat',
};

const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="main-layout">
      <div className={`main-layout__overlay ${mobileMenuOpen ? 'main-layout__overlay--visible' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`main-layout__sidebar ${mobileMenuOpen ? 'main-layout__sidebar--mobile-open' : ''}`}>
        <Sidebar />
      </div>
      <div className="main-layout__main">
        <Navbar title={title} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
