import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Topbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<PlaceholderPage title="Products" />} />
              <Route path="/procurement" element={<PlaceholderPage title="Procurement" />} />
              <Route path="/delivery" element={<PlaceholderPage title="Delivery" />} />
              <Route path="/intra-warehouse" element={<PlaceholderPage title="Intra Warehouse" />} />
              <Route path="/warehouses" element={<PlaceholderPage title="Total Warehouses" />} />
              <Route path="/projects" element={<PlaceholderPage title="Projects" />} />
              <Route path="/move-history" element={<PlaceholderPage title="Move History" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
