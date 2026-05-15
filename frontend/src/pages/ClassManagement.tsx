import React, { useState, useEffect } from 'react';
import { Video, Calendar, Users, Clock, Eye, Heart, Plus, Radio } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import DataTable from '../components/DataTable';
import { recordedClasses } from '../data/dummyData';import api from '../services/api';

import './ClassManagement.css';

const ClassManagement: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [liveClassData, setLiveClassData] = useState([]);
  const [recordedClassData, setRecordedClassData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);

  const liveColumns = [
    { key: 'title', title: 'Class Title' },
    { key: 'class', title: 'Class', render: (v: string) => <Badge variant="purple">{v}</Badge> },
    { key: 'date', title: 'Date' },
    { key: 'time', title: 'Time', render: (v: string) => <span className="class__time"><Clock size={14} /> {v}</span> },
    { key: 'duration', title: 'Duration' },
    { key: 'status', title: 'Status', render: (v: string) => (
      <Badge variant={v === 'live' ? 'error' : 'info'}>{v === 'live' ? 'Live Now' : 'Scheduled'}</Badge>
    )},
    { key: 'attendees', title: 'Attendees', render: (v: number) => v > 0 ? <span className="class__attendees"><Users size={14} /> {v}</span> : '-' },
  ];

 useEffect(() => {
    fetchSchedules();
    fetchRecordedClasses();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/classes/schedules');    console.log(response.data);
      const formattedData = response.data.data.map((item: any) => ({
        id: item.id,
        title: item.subject_name,
        class: item.class_name,
        date: item.day_of_week,
        time: `${new Date(`1970-01-01T${item.start_time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })} - ${new Date(`1970-01-01T${item.end_time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}`,        
        duration: '-',
        status: 'scheduled',
        attendees: 0,
      }));

      setLiveClassData(formattedData);
      setCalendarData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    }
  };

  const fetchRecordedClasses = async () => {
    try {
      const response = await api.get('/classes/recordings');

      const formattedData = response.data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.recorded_date).toLocaleDateString('en-GB'),
        duration: item.duration,
        views: item.views || 0,
        likes: item.likes || 0,
      }));

      setRecordedClassData(formattedData);
    } catch (error) {
      console.error('Failed to fetch recordings', error);
    }
  };

  const recordedColumns = [
    { key: 'title', title: 'Recording Title' },
    { key: 'date', title: 'Date' },
    { key: 'duration', title: 'Duration' },
    {
      key: 'video_link',
      title: 'Video Link',
      render: (v: string) => (
        <a href={v} target="_blank" rel="noreferrer">
          Watch Recording
        </a>
      ),
    },
  ];

  const liveContent = (
    <div className="class__section">
      <div className="class__section-header">
        <h3>Live Classes</h3>
        <Button icon={<Plus size={16} />} onClick={() => setShowScheduleModal(true)}>Schedule Class</Button>
      </div>
    <DataTable columns={liveColumns} data={liveClassData} />    </div>
  );

  const recordedContent = (
    <div className="class__section">
      <div className="class__section-header">
        <h3>Recorded Classes</h3>
      </div>
      <DataTable columns={recordedColumns} data={recordedClassData} />    </div>
  );

  const calendarContent = (
    <div className="class__section">
      <div className="class__section-header">
        <h3>Class Schedule</h3>
      </div>

      <div className="class__calendar">
        <div className="class__calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="class__calendar-day-header"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;

            const events = calendarData.filter(
              (e: any) =>
                new Date(e.created_at).getDate() === day
            );

            return (
              <div
                key={day}
                className={`class__calendar-cell ${
                  day <= 8
                    ? 'class__calendar-cell--current'
                    : ''
                }`}
              >
                <span className="class__calendar-day">
                  {day}
                </span>

                {events.map((event: any) => (
                  <div
                    key={event.id}
                    className="class__calendar-event"
                  >
                    {event.subject_name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="class">
      <Tabs
        tabs={[
          { id: 'live', label: 'Live Classes', icon: <Radio size={16} />, content: liveContent },
          { id: 'recorded', label: 'Recorded', icon: <Video size={16} />, content: recordedContent },
          { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} />, content: calendarContent },
        ]}
      />

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule New Class">
        <div className="class__modal-form">
          <InputField label="Class Title" placeholder="Enter class title" />
          <SelectField
            label="Subject"
            options={[
              { value: 'math', label: 'Mathematics' },
              { value: 'physics', label: 'Physics' },
              { value: 'chemistry', label: 'Chemistry' },
            ]}
          />
          <SelectField
            label="Class"
            options={[
              { value: '12-A', label: 'Class 12-A' },
              { value: '11-B', label: 'Class 11-B' },
              { value: '12-C', label: 'Class 12-C' },
              { value: '10-A', label: 'Class 10-A' },
            ]}
          />
          <div className="class__modal-row">
            <InputField label="Date" type="date" />
            <InputField label="Time" type="time" />
          </div>
          <InputField label="Duration" placeholder="e.g., 45 min" />
          <div className="class__modal-actions">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await api.post('/classes/schedules', {
                    class_id: 1,
                    subject_id: 1,
                    teacher_id: 3,
                    day_of_week: 'Monday',
                    start_time: '10:00',
                    end_time: '11:00',
                  });

                  fetchSchedules();

                  setShowScheduleModal(false);
                } catch (error) {
                  console.error('Failed to create schedule', error);
                }
              }}
            >
              Schedule Class
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassManagement;
