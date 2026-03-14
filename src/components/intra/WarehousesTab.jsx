import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineX,
} from 'react-icons/hi';
import { nextWarehouseId } from '../../data/intraWarehouseData';

export default function WarehousesTab({ warehouses, transfers, onAddWarehouse }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName]           = useState('');
  const [location, setLocation]   = useState('');
  const [capacity, setCapacity]   = useState('');
  const [error, setError]         = useState('');

  const transferCount = (whName) =>
    transfers.filter(t => t.fromWarehouse === whName || t.toWarehouse === whName).length;

  const activeCount = (whName) =>
    transfers.filter(t =>
      (t.fromWarehouse === whName || t.toWarehouse === whName) &&
      t.status !== 'Done'
    ).length;

  const handleAdd = () => {
    if (!name.trim() || !location.trim()) {
      setError('Name and location are required.');
      return;
    }
    if (warehouses.some(w => w.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('A warehouse with this name already exists.');
      return;
    }
    onAddWarehouse({
      id: nextWarehouseId(),
      name: name.trim(),
      location: location.trim(),
      capacity: capacity ? Number(capacity) : 0,
    });
    setName('');
    setLocation('');
    setCapacity('');
    setError('');
    setShowModal(false);
  };

  const handleClose = () => {
    setName(''); setLocation(''); setCapacity(''); setError('');
    setShowModal(false);
  };

  return (
    <>
      <div className="wh-page-header">
        <span className="wh-page-title">{warehouses.length} Warehouse{warehouses.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Add Warehouse
        </button>
      </div>

      <div className="wh-grid">
        {warehouses.map(wh => (
          <div key={wh.id} className="wh-card">
            <div className="wh-card-top">
              <div className="wh-card-avatar">
                <HiOutlineOfficeBuilding />
              </div>
              <div>
                <div className="wh-card-name">{wh.name}</div>
                <div className="wh-card-loc">
                  <HiOutlineLocationMarker style={{ fontSize: '0.85rem' }} />
                  {wh.location}
                </div>
              </div>
            </div>

            <div className="wh-card-stats">
              <div className="wh-stat">
                <div className="wh-stat-value">{transferCount(wh.name)}</div>
                <div className="wh-stat-label">Total Transfers</div>
              </div>
              <div className="wh-stat">
                <div className="wh-stat-value" style={{ color: activeCount(wh.name) > 0 ? 'var(--status-waiting)' : 'var(--text-muted)' }}>
                  {activeCount(wh.name)}
                </div>
                <div className="wh-stat-label">Active</div>
              </div>
              {wh.capacity > 0 && (
                <div className="wh-stat">
                  <div className="wh-stat-value" style={{ fontSize: '0.9rem' }}>{wh.capacity.toLocaleString()}</div>
                  <div className="wh-stat-label">Capacity</div>
                </div>
              )}
            </div>

            <div className="wh-card-id">{wh.id}</div>
          </div>
        ))}
      </div>

      {/* Add Warehouse Modal */}
      {showModal && (
        <div className="intra-modal-overlay" onClick={handleClose}>
          <div className="intra-modal intra-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="add-wh-modal-header">
              <span className="add-wh-modal-title">Add New Warehouse</span>
              <button className="close-btn" onClick={handleClose}><HiOutlineX /></button>
            </div>
            <div className="add-wh-modal-body">
              {error && (
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'var(--status-late-bg)', color: 'var(--status-late)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Warehouse Name <span>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. North Storage Yard"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Location <span>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chennai"
                  value={location}
                  onChange={e => { setLocation(e.target.value); setError(''); }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Capacity (optional)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000"
                  min="0"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  <HiOutlinePlus /> Add Warehouse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
