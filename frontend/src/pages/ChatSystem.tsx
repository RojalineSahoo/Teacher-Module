import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, User, Headphones, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Tabs from '../components/Tabs';
import { chatContacts } from '../data/dummyData';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ChatSystem.css';

const ChatSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState<any>(chatContacts.students[0]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.on('receive_message', (newMsg: any) => {
      if (newMsg.sender_id !== user?.id) {
        setMessages((prev) => [
          ...prev, 
          {
            id: newMsg.id,
            text: newMsg.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'other'
          }
        ]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (activeContact) {
      socketRef.current?.emit('join_room', activeContact.id);
      fetchMessages(activeContact.id);
    }
  }, [activeContact]);

  const fetchMessages = async (roomId: number) => {
    try {
      const res = await api.get(`/chat/rooms/${roomId}/messages`);
      if (res.data && res.data.data) {
        const formatted = res.data.data.map((m: any) => ({
          id: m.id,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: m.sender_id === user?.id ? 'me' : 'other',
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeContact) return;
    
    const msgData = {
      room_id: activeContact.id,
      sender_id: user?.id || 1,
      text: message,
    };
    
    socketRef.current?.emit('send_message', msgData);
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
      },
    ]);
    setMessage('');
  };


  const renderContactList = (contacts: any[]) => (
    <div className="chat__contacts">
      {contacts
        .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
        .map((contact) => (
          <div
            key={contact.id}
            className={`chat__contact ${activeContact?.id === contact.id ? 'chat__contact--active' : ''}`}
            onClick={() => setActiveContact(contact)}
          >
            <div className="chat__contact-avatar">
              {contact.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              {contact.online && <span className="chat__online-dot" />}
            </div>
            <div className="chat__contact-info">
              <div className="chat__contact-header">
                <span className="chat__contact-name">{contact.name}</span>
                <span className="chat__contact-time">{contact.time}</span>
              </div>
              <div className="chat__contact-footer">
                <span className="chat__contact-msg">{contact.lastMessage}</span>
                {contact.unread > 0 && <span className="chat__unread-badge">{contact.unread}</span>}
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const studentContent = renderContactList(chatContacts.students);
  const parentContent = renderContactList(chatContacts.parents);
  const staffContent = renderContactList(chatContacts.staff);

  return (
    <div className="chat">
      <div className="chat__sidebar">
        <div className="chat__sidebar-header">
          <h3>Messages</h3>
          <button className="chat__icon-btn"><MoreVertical size={18} /></button>
        </div>
        <div className="chat__sidebar-search">
          <SearchBar value={search} onChange={setSearch} placeholder="Search conversations..." />
        </div>
        <Tabs
          tabs={[
            { id: 'students', label: 'Students', icon: <Users size={14} />, content: studentContent },
            { id: 'parents', label: 'Parents', icon: <User size={14} />, content: parentContent },
            { id: 'staff', label: 'Staff', icon: <Headphones size={14} />, content: staffContent },
          ]}
        />
      </div>

      <div className="chat__main">
        {activeContact ? (
          <>
            <div className="chat__header">
              <div className="chat__header-left">
                <div className="chat__header-avatar">
                  {activeContact.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  {activeContact.online && <span className="chat__online-dot" />}
                </div>
                <div>
                  <h3 className="chat__header-name">{activeContact.name}</h3>
                  <span className="chat__header-status">{activeContact.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              <div className="chat__header-actions">
                <button className="chat__icon-btn"><Phone size={18} /></button>
                <button className="chat__icon-btn"><Video size={18} /></button>
                <button className="chat__icon-btn"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="chat__messages">
              {messages.length > 0 ? messages.map((msg) => (
                <div key={msg.id} className={`chat__message chat__message--${msg.sender}`}>
                  <div className="chat__message-bubble">
                    <p>{msg.text}</p>
                    <span className="chat__message-time">{msg.time}</span>
                  </div>
                </div>
              )) : (
                <div className="chat__empty-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            <div className="chat__input-area">
              <button className="chat__icon-btn"><Paperclip size={20} /></button>
              <div className="chat__input-wrapper">
                <input
                  type="text"
                  className="chat__input"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="chat__icon-btn"><Smile size={20} /></button>
              </div>
              <button className="chat__send-btn" disabled={!message.trim()} onClick={handleSendMessage}>
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="chat__empty">
            <Users size={48} className="chat__empty-icon" />
            <h3>Select a conversation</h3>
            <p>Choose a contact from the sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
