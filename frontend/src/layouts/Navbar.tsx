import React, { useState } from "react";
import { Menu, Bell, Search, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { teacherProfile, notifications } from "../data/dummyData";
import "./Navbar.css";

interface NavbarProps {
  onMenuToggle: () => void;
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const storedNotifications =
    JSON.parse(localStorage.getItem("teacher_notifications") || "null") ||
    notifications;

  const unreadCount = storedNotifications.filter((n: any) => !n.read).length;
  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <h1 className="navbar__title">{title}</h1>
      </div>

      <div className="navbar__right">
        <div className="navbar__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="navbar__search-input"
          />
        </div>

        <div className="navbar__notifications">
          <Link to="/notifications">
            <button
              className="navbar__icon-btn"
              onClick={() => setShowNotifications(false)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="navbar__badge">{unreadCount}</span>
              )}
            </button>
          </Link>

          {showNotifications && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <h3>Notifications</h3>
                <span className="navbar__dropdown-count">
                  {unreadCount} new
                </span>
              </div>

              <div className="navbar__dropdown-list">
                {storedNotifications.slice(0, 4).map((n: any) => (
                  <div
                    key={n.id}
                    className={`navbar__notification ${
                      !n.read ? "navbar__notification--unread" : ""
                    }`}
                  >
                    <div
                      className={`navbar__notification-dot navbar__notification-dot--${n.type}`}
                    />

                    <div className="navbar__notification-content">
                      <p className="navbar__notification-title">{n.title}</p>
                      <p className="navbar__notification-msg">{n.message}</p>
                      <span className="navbar__notification-time">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="navbar__icon-btn">
          <Settings size={20} />
        </button>

        <Link to="/profile" className="navbar__profile">
          <div className="navbar__avatar">SM</div>

          <div className="navbar__profile-info">
            <p className="navbar__profile-name">{teacherProfile.name}</p>

            <p className="navbar__profile-role">{teacherProfile.subject}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
