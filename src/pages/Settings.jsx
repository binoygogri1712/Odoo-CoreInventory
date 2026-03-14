import { useNavigate } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('traceflow_token');
    localStorage.removeItem('traceflow_user');
    sessionStorage.removeItem('traceflow_token');
    sessionStorage.removeItem('traceflow_user');
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Settings</h2>
        <p>Manage your account settings here.</p>
        
        <div className="settings-section">
          <h3>Account Actions</h3>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
