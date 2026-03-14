import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Procurement from './pages/Procurement';
import Delivery from './pages/Delivery';
import IntraWarehouse from './pages/IntraWarehouse';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import MoveHistory from './pages/MoveHistory';
import './App.css';

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">🚧</div>
        <h2>{title}</h2>
        <p>This module is coming soon. Your team can build it here!</p>
      </div>
    </div>
  );
}

function isAuthenticated() {
  return !!(localStorage.getItem('traceflow_token') || sessionStorage.getItem('traceflow_token'));
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/intra-warehouse" element={<IntraWarehouse />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/move-history" element={<MoveHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected app routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
