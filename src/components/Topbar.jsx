import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineCalendar,
} from 'react-icons/hi';
import './Topbar.css';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/procurement': 'Procurement',
  '/delivery': 'Delivery',
  '/intra-warehouse': 'Intra Warehouse',
  '/warehouses': 'Total Warehouses',
  '/projects': 'Projects',
  '/move-history': 'Move History',
  '/profile': 'Profile',
};

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';
  
  const user = JSON.parse(localStorage.getItem('traceflow_user') || sessionStorage.getItem('traceflow_user') || '{}');
  const userName = user?.login_id || 'Inventory Mgr';
  const avatarText = user?.login_id ? user.login_id.substring(0, 2).toUpperCase() : 'IM';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('traceflow_token');
    sessionStorage.removeItem('traceflow_token');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onMenuToggle}>
          <HiOutlineMenu />
        </button>
        <div className="topbar__title-group">
          <h1 className="topbar__title">{currentTitle}</h1>
          <span className="topbar__date">
            <HiOutlineCalendar />
            {today}
          </span>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__divider"></div>

        <div 
            className="topbar__profile-wrapper" 
            style={{ position: 'relative' }}
            ref={dropdownRef}
        >
            <button 
                className="topbar__profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="topbar__profile-avatar">{avatarText}</div>
              <div className="topbar__profile-info">
                <span className="topbar__profile-name">{userName}</span>
                <span className="topbar__profile-role">Admin</span>
              </div>
            </button>

            {profileDropdownOpen && (
                <div className="topbar__profile-dropdown">
                    <button onClick={() => { setProfileDropdownOpen(false); navigate('/profile'); }}>Profile</button>
                    <button onClick={handleLogout} className="logout-text">Logout</button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
