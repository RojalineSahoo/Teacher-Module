import React, { useEffect, useState } from "react";
import { Camera, Mail, Phone, Shield, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Computer Science",
    role: "",
    bio: "Passionate educator focused on interactive learning.",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Teacher",
        phone: localStorage.getItem("teacher_phone") || "",
        department:
          localStorage.getItem("teacher_department") || "Computer Science",
        bio:
          localStorage.getItem("teacher_bio") ||
          "Passionate educator focused on interactive learning.",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("teacher_phone", profile.phone);
    localStorage.setItem("teacher_department", profile.department);
    localStorage.setItem("teacher_bio", profile.bio);

    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name?.charAt(0)}
          <button className="profile-avatar-btn">
            <Camera size={16} />
          </button>
        </div>

        <div>
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Personal Information</h2>

          <div className="profile-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={profile.department}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Bio</label>
            <textarea
              rows={4}
              name="bio"
              value={profile.bio}
              onChange={handleChange}
            />
          </div>

          <button className="profile-save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <BookOpen size={22} />
            <div>
              <h3>24</h3>
              <p>Topics Created</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <Shield size={22} />
            <div>
              <h3>98%</h3>
              <p>Attendance Rate</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <Mail size={22} />
            <div>
              <h3>156</h3>
              <p>Assignments Reviewed</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <Phone size={22} />
            <div>
              <h3>12</h3>
              <p>Classes Managed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
