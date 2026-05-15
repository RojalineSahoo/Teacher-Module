import React, { useEffect, useState } from "react";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import "./Notifications.css";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "Assignment Submitted",
    message: "Rahul submitted Assignment 4.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Attendance Updated",
    message: "Attendance marked successfully.",
    time: "10 min ago",
    read: false,
  },
  {
    id: 3,
    title: "New Topic Created",
    message: "AI Fundamentals topic added.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    title: "Assessment Completed",
    message: "Semester Test evaluation completed.",
    time: "3 hours ago",
    read: true,
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("teacher_notifications");
      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        } else {
          setNotifications(defaultNotifications);
        }
      }
    } catch (error) {
      console.error("Notification parsing error:", error);

      localStorage.removeItem("teacher_notifications");

      setNotifications(defaultNotifications);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "teacher_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${
                !notification.read ? "notification-card--unread" : ""
              }`}
            >
              <div className="notification-left">
                <Bell size={20} />
              </div>

              <div className="notification-content">
                <h3>{notification.title}</h3>

                <p>{notification.message}</p>

                <span>{notification.time}</span>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button onClick={() => markAsRead(notification.id)}>
                    <CheckCircle size={18} />
                  </button>
                )}

                <button onClick={() => deleteNotification(notification.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="notification-empty">No notifications available</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
