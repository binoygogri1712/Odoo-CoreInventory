import { useState, useMemo } from 'react';
import {
  HiOutlineSearch,
  HiPlus,
  HiOutlineEye,
  HiX,
} from 'react-icons/hi';
import './Procurement.css';
import './Delivery.css';

// Local seed data — purely front-end
const INITIAL_WAREHOUSES = [
  {
    id: 'WH-MAIN',
    name: 'Main Central Warehouse',
    location: 'Pune',
    products: [
      { sku: 'SKU-STEEL-001', name: 'Steel Bars', qty: 80, unit: 'tons' },
      { sku: 'SKU-CEMENT-001', name: 'Cement (OPC 53)', qty: 200, unit: 'bags' },
      { sku: 'SKU-SAND-001', name: 'River Sand', qty: 300, unit: 'bags' },
    ],
  },
  {
    id: 'WH-SITE-01',
    name: 'Project Site 1 Store',
    location: 'Mumbai – Site 1',
    products: [
      { sku: 'SKU-STEEL-001', name: 'Steel Bars', qty: 40, unit: 'tons' },
      { sku: 'SKU-TMT-001', name: 'TMT Rods', qty: 120, unit: 'kg' },
    ],
  },
  {
    id: 'WH-SITE-02',
    name: 'Project Site 2 Store',
    location: 'Mumbai – Site 2',
    products: [
      { sku: 'SKU-BRICK-001', name: 'Bricks (Red Clay)', qty: 800, unit: 'pcs' },
      { sku: 'SKU-CEMENT-001', name: 'Cement (OPC 53)', qty: 120, unit: 'bags' },
    ],
  },
];

function WarehouseModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: initial?.id || '',
    name: initial?.name || '',
    location: initial?.location || '',
  }));

  const canSave =
    form.id.trim() &&
    form.name.trim() &&
    form.location.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: form.id.trim(),
      name: form.name.trim(),
      location: form.location.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={e => e.stopPropagation()}>
        <div className="wizard-header">
          <div>
            <h3 className="wizard-title">
              {mode === 'edit' ? 'Edit Warehouse' : 'Add Warehouse'}
            </h3>
            <p className="wizard-sub">
              Define the warehouse ID, name and physical location. This is front-end only.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <HiX />
          </button>
        </div>

        <div className="wizard-body">
          <div className="confirm-inputs">
            <div className="cinput-group">
              <label>Warehouse ID</label>
              <input
                type="text"
                className="rdoc-input"
                placeholder="e.g. WH-MAIN"
                value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
              />
            </div>
            <div className="cinput-group">
              <label>Warehouse Name</label>
              <input
                type="text"
                className="rdoc-input"
                placeholder="e.g. Main Central Warehouse"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="cinput-group">
              <label>Location</label>
              <input
                type="text"
                className="rdoc-input"
                placeholder="City / Site name"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="wizard-footer">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!canSave}
              onClick={handleSave}
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Warehouse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WarehouseProductsModal({ warehouse, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="del-print-wrap" onClick={e => e.stopPropagation()}>
        <div className="del-print-actions">
          <span className="del-print-title">
            Products in {warehouse.name} ({warehouse.id})
          </span>
          <button className="del-btn del-btn--outline del-btn--sm" onClick={onClose}>
            <HiX /> Close
          </button>
        </div>

        <div className="del-print-area">
          <div className="del-print-doc">
            <div className="del-print-header" style={{ marginBottom: 16 }}>
              <div className="del-print-logo">
                Total Warehouses
              </div>
              <div className="del-print-meta">
                <div className="del-print-type">WAREHOUSE INVENTORY</div>
                <div className="del-print-ref">{warehouse.id}</div>
                <div className="del-print-date">Location: {warehouse.location}</div>
              </div>
            </div>

            <div className="del-print-table-wrap">
              <table className="del-print-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Unit</th>
                    <th className="num">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouse.products?.length ? warehouse.products.map((p, idx) => (
                    <tr key={p.sku + idx}>
                      <td>{idx + 1}</td>
                      <td className="del-sku-cell">{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.unit}</td>
                      <td className="num">{p.qty}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        No products recorded for this warehouse yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [activeWarehouse, setActiveWarehouse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewProductsFor, setViewProductsFor] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return warehouses.filter(w =>
      w.id.toLowerCase().includes(q) ||
      w.name.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q)
    );
  }, [warehouses, search]);

  const openAdd = () => {
    setModalMode('add');
    setActiveWarehouse(null);
    setShowEditModal(true);
  };

  const openEdit = (wh) => {
    setModalMode('edit');
    setActiveWarehouse(wh);
    setShowEditModal(true);
  };

  const closeEdit = () => {
    setActiveWarehouse(null);
    setShowEditModal(false);
  };

  const handleSaveWarehouse = (data) => {
    setWarehouses(prev => {
      if (modalMode === 'edit' && activeWarehouse) {
        return prev.map(w => w.id === activeWarehouse.id ? { ...w, ...data } : w);
      }
      const existingIdx = prev.findIndex(w => w.id === data.id);
      if (existingIdx !== -1) {
        return prev.map((w, i) => i === existingIdx ? { ...w, ...data } : w);
      }
      return [{ ...data, products: [] }, ...prev];
    });
    setActiveWarehouse(null);
    setShowEditModal(false);
  };

  return (
    <div className="procurement-page">
      <div className="proc-content" style={{ padding: '24px' }}>
        {/* Toolbar with search and Add Warehouse button */}
        <div className="tab-toolbar">
          <div className="proc-search-box">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search by warehouse ID, name or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={openAdd}>
              <HiPlus /> Add Warehouse
            </button>
          </div>
        </div>

        {/* Warehouses table */}
        <div className="table-card">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Warehouse ID</th>
                <th>Warehouse Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-row">
                    No warehouses found. Click &quot;Add Warehouse&quot; to create one.
                  </td>
                </tr>
              )}
              {filtered.map(w => (
                <tr key={w.id} className="proc-row">
                  <td className="ref-cell">{w.id}</td>
                  <td className="prod-cell">{w.name}</td>
                  <td>{w.location}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-outline btn-sm action-btn"
                      onClick={() => openEdit(w)}
                    >
                      Edit
                    </button>
                    <button
                      className="del-receipt-btn"
                      onClick={() => setViewProductsFor(w)}
                    >
                      <HiOutlineEye /> View Products
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <WarehouseModal
          mode={modalMode}
          initial={activeWarehouse}
          onClose={closeEdit}
          onSave={handleSaveWarehouse}
        />
      )}

      {viewProductsFor && (
        <WarehouseProductsModal
          warehouse={viewProductsFor}
          onClose={() => setViewProductsFor(null)}
        />
      )}
    </div>
  );
}

