import React from 'react';
import { Users, UserCheck, FileText, ClipboardList, Clock, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import { dashboardStats, upcomingClasses, notifications, studentActivityFeed, attendanceSummary, performanceChartData } from '../data/dummyData';
import './Dashboard.css';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={24} />,
  UserCheck: <UserCheck size={24} />,
  FileText: <FileText size={24} />,
  ClipboardList: <ClipboardList size={24} />,
};

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {dashboardStats.map((stat, idx) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType as any}
            icon={iconMap[stat.icon]}
            className={`stagger-${idx + 1}`}
          />
        ))}
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__main">
          <GlassCard className="dashboard__card">
            <div className="dashboard__card-header">
              <h3>Attendance Summary</h3>
              <Badge variant="info">This Week</Badge>
            </div>
            <div className="dashboard__attendance-list">
              {attendanceSummary.map((item) => (
                <div key={item.class} className="dashboard__attendance-item">
                  <div className="dashboard__attendance-info">
                    <span className="dashboard__attendance-class">Class {item.class}</span>
                    <span className="dashboard__attendance-numbers">{item.present}/{item.total} present</span>
                  </div>
                  <ProgressBar value={item.percentage} size="sm" showValue={false} />
                  <span className="dashboard__attendance-pct">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="dashboard__card">
            <div className="dashboard__card-header">
              <h3>Performance Trend</h3>
              <Badge variant="success">Improving</Badge>
            </div>
            <div className="dashboard__chart-placeholder">
              <div className="dashboard__mini-chart">
                {performanceChartData.map((item) => (
                  <div key={item.month} className="dashboard__chart-bar-wrapper">
                    <div
                      className="dashboard__chart-bar"
                      style={{ height: `${item.avgScore}%` }}
                    />
                    <span className="dashboard__chart-label">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="dashboard__chart-legend">
                <span>Avg Score</span>
                <span className="dashboard__chart-trend"><TrendingUp size={14} /> +13pts</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="dashboard__side">
          <GlassCard className="dashboard__card">
            <div className="dashboard__card-header">
              <h3>Upcoming Classes</h3>
              <Badge variant="purple">4 today</Badge>
            </div>
            <div className="dashboard__classes-list">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="dashboard__class-item">
                  <div className="dashboard__class-time">
                    <Clock size={14} />
                    <span>{cls.time}</span>
                  </div>
                  <div className="dashboard__class-info">
                    <p className="dashboard__class-subject">{cls.subject}</p>
                    <div className="dashboard__class-meta">
                      <span><MapPin size={12} /> {cls.room}</span>
                      <span>Class {cls.class}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="dashboard__card">
            <div className="dashboard__card-header">
              <h3>Notifications</h3>
              <Badge variant="error">3 new</Badge>
            </div>
            <div className="dashboard__notifications-list">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className={`dashboard__notification ${!n.read ? 'dashboard__notification--unread' : ''}`}>
                  <div className={`dashboard__notification-icon dashboard__notification-icon--${n.type}`}>
                    {n.type === 'error' ? <AlertCircle size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="dashboard__notification-content">
                    <p className="dashboard__notification-title">{n.title}</p>
                    <span className="dashboard__notification-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="dashboard__card">
            <div className="dashboard__card-header">
              <h3>Student Activity</h3>
            </div>
            <div className="dashboard__activity-list">
              {studentActivityFeed.map((activity) => (
                <div key={activity.id} className="dashboard__activity-item">
                  <div className="dashboard__activity-avatar">
                    {activity.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="dashboard__activity-content">
                    <p><strong>{activity.student}</strong> {activity.action} <span className="dashboard__activity-target">{activity.target}</span></p>
                    <span className="dashboard__activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
