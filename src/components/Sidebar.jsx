import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineSwitchHorizontal,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/products', label: 'Products', icon: HiOutlineCube },
];

const operationItems = [
  { path: '/procurement', label: 'Procurement', icon: HiOutlineClipboardList },
  { path: '/delivery', label: 'Delivery', icon: HiOutlineTruck },
  { path: '/intra-warehouse', label: 'Intra Warehouse', icon: HiOutlineSwitchHorizontal },
];

const afterOpsItems = [
  { path: '/warehouses', label: 'Total Warehouses', icon: HiOutlineOfficeBuilding },
  { path: '/projects', label: 'Projects', icon: HiOutlineBriefcase },
];

const bottomItems = [
  { path: '/move-history', label: 'Move History', icon: HiOutlineClock },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar() {
  const [opsOpen, setOpsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('traceflow_user') || sessionStorage.getItem('traceflow_user') || '{}');
  const userName = user?.login_id || 'Inventory Mgr';
  const avatarText = user?.login_id ? user.login_id.substring(0, 2).toUpperCase() : 'IM';

  const isOpsActive = operationItems.some((item) => location.pathname === item.path);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">TF</span>
        </div>
        {!collapsed && <h1 className="sidebar__title">TraceFlow</h1>}
        <button
          className="sidebar__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <HiOutlineChevronRight
            className={`collapse-icon ${collapsed ? '' : 'collapse-icon--rotated'}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__section">
          {!collapsed && <span className="sidebar__section-label">MAIN MENU</span>}
          <ul className="sidebar__list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  title={item.label}
                >
                  <item.icon className="sidebar__link-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}

            {/* Operations Group */}
            <li>
              <button
                className={`sidebar__link sidebar__link--group ${isOpsActive ? 'sidebar__link--active' : ''}`}
                onClick={() => setOpsOpen(!opsOpen)}
                title="Operations"
              >
                <HiOutlineClipboardList className="sidebar__link-icon" />
                {!collapsed && (
                  <>
                    <span>Operations</span>
                    <HiOutlineChevronDown
                      className={`sidebar__chevron ${opsOpen ? 'sidebar__chevron--open' : ''}`}
                    />
                  </>
                )}
              </button>
              {opsOpen && !collapsed && (
                <ul className="sidebar__sublist">
                  {operationItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar__link sidebar__link--sub ${isActive ? 'sidebar__link--active' : ''}`
                        }
                      >
                        <item.icon className="sidebar__link-icon" />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Warehouses & Projects */}
            {afterOpsItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  title={item.label}
                >
                  <item.icon className="sidebar__link-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar__section">
          {!collapsed && <span className="sidebar__section-label">OTHER</span>}
          <ul className="sidebar__list">
            {bottomItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  title={item.label}
                >
                  <item.icon className="sidebar__link-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">{avatarText}</div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{userName}</span>
              <span className="sidebar__user-role">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
