import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardCheck,
  FileText,
  ClipboardList,
  Presentation,
  BarChart3,
  MessageSquareWarning,
  MessageCircle,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/topics', label: 'Topics & Chapters', icon: BookOpen },
  { path: '/classes', label: 'Class Management', icon: Video },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/assignments', label: 'Assignments', icon: FileText },
  { path: '/assessments', label: 'Assessments', icon: ClipboardList },
  { path: '/creator', label: 'PPT & Mind Maps', icon: Presentation },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/grievances', label: 'Grievances', icon: MessageSquareWarning },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <GraduationCap size={28} />
          {!collapsed && <span className="sidebar__brand">EDDVA</span>}
        </div>
        <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeft size={18} className={collapsed ? 'sidebar__toggle-icon--rotated' : ''} />
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            end={item.path === '/'}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="sidebar__link-icon" />
            {!collapsed && <span className="sidebar__link-text">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">SM</div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <p className="sidebar__user-name">Dr. Sarah Mitchell</p>
              <p className="sidebar__user-role">Mathematics</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
