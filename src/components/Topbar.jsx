import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineBell,
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
  '/settings': 'Settings',
};

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
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
        <div className={`topbar__search ${searchFocused ? 'topbar__search--focused' : ''}`}>
          <HiOutlineSearch className="topbar__search-icon" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="topbar__search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <button className="topbar__icon-btn topbar__notification-btn">
          <HiOutlineBell />
          <span className="topbar__notification-dot"></span>
        </button>

        <div className="topbar__divider"></div>

        <button className="topbar__profile">
          <div className="topbar__profile-avatar">{avatarText}</div>
          <div className="topbar__profile-info">
            <span className="topbar__profile-name">{userName}</span>
            <span className="topbar__profile-role">Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
