import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLogout } from 'react-icons/hi';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    login_id: 'Admin',
    email: 'admin@traceflow.com',
    role: 'Administrator'
  });

  useEffect(() => {
    const userStr = localStorage.getItem('traceflow_user') || sessionStorage.getItem('traceflow_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfile({
          login_id: user.login_id || 'Admin',
          email: user.email || 'admin@traceflow.com',
          role: 'Administrator'
        });
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('traceflow_token');
    sessionStorage.removeItem('traceflow_token');
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.substring(0, 1).toUpperCase() : 'A';
  };

  return (
    <div className="profile-page">
      <div className="profile-header-area">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-large">
              {getInitial(profile.login_id)}
            </div>
            <div className="profile-header-info">
              <h2>{profile.login_id}</h2>
              <span className="profile-badge">{profile.role}</span>
            </div>
          </div>
          
          <div className="profile-card-body">
            <div className="profile-field">
              <span className="profile-field-icon"><HiOutlineUser /></span>
              <div className="profile-field-text">
                <span className="profile-label">Username</span>
                <span className="profile-val">{profile.login_id}</span>
              </div>
            </div>

            <div className="profile-field">
              <span className="profile-field-icon"><HiOutlineMail /></span>
              <div className="profile-field-text">
                <span className="profile-label">Email Address</span>
                <span className="profile-val">{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-card-footer">
            <button className="btn-logout" onClick={handleLogout}>
              <HiOutlineLogout /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
