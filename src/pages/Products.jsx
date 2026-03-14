import { useState, useMemo } from 'react';
import {
  HiOutlineSearch,
  HiPlus,
  HiOutlinePencil,
  HiX,
} from 'react-icons/hi';
import './Procurement.css';

// Local seed data for the Products tab (front-end only)
const INITIAL_PRODUCTS = [
  { sku: 'SKU-STEEL-001', name: 'Steel Bars',        referencePrice: 900,  totalStock: 150 },
  { sku: 'SKU-CEMENT-001', name: 'Cement (OPC 53)',  referencePrice: 75,   totalStock: 320 },
  { sku: 'SKU-SAND-001',   name: 'River Sand',       referencePrice: 40,   totalStock: 540 },
  { sku: 'SKU-TMT-001',    name: 'TMT Rods',         referencePrice: 65,   totalStock: 80  },
  { sku: 'SKU-BRICK-001',  name: 'Bricks (Red Clay)',referencePrice: 8,    totalStock: 1200 },
];

function ProductModal({ mode, initialProduct, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    sku: initialProduct?.sku || '',
    name: initialProduct?.name || '',
    referencePrice: initialProduct?.referencePrice?.toString() || '',
    totalStock: initialProduct?.totalStock?.toString() || '',
  }));

  const canSave =
    form.sku.trim() &&
    form.name.trim() &&
    form.referencePrice !== '' &&
    form.totalStock !== '';

  const handleSave = () => {
    if (!canSave) return;
    const cleaned = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      referencePrice: Number(form.referencePrice) || 0,
      totalStock: Number(form.totalStock) || 0,
    };
    onSave(cleaned);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={e => e.stopPropagation()}>
        <div className="wizard-header">
          <div>
            <h3 className="wizard-title">
              {mode === 'edit' ? 'Edit Product' : 'Add Product'}
            </h3>
            <p className="wizard-sub">
              Define SKU, reference price and total quantity in stock for this product.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <HiX />
          </button>
        </div>

        <div className="wizard-body">
          <div className="confirm-inputs">
            <div className="cinput-group">
              <label>SKU ID</label>
              <input
                type="text"
                className="rdoc-input"
                placeholder="e.g. SKU-STEEL-001"
                value={form.sku}
                onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
              />
            </div>
            <div className="cinput-group">
              <label>Name of Product</label>
              <input
                type="text"
                className="rdoc-input"
                placeholder="e.g. Steel Bars"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="cinput-group">
              <label>Reference Price (per unit)</label>
              <div className="input-affix input-affix--pre">
                <span className="affix-label">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="rdoc-input"
                  placeholder="0.00"
                  value={form.referencePrice}
                  onChange={e =>
                    setForm(f => ({ ...f, referencePrice: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="cinput-group">
              <label>Total Quantity in Stock (all warehouses)</label>
              <input
                type="number"
                min="0"
                className="rdoc-input"
                placeholder="e.g. 150"
                value={form.totalStock}
                onChange={e =>
                  setForm(f => ({ ...f, totalStock: e.target.value }))
                }
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
              {mode === 'edit' ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter(p => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }),
    [products, search]
  );

  const openAddModal = () => {
    setModalMode('add');
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleSaveProduct = (product) => {
    setProducts(prev => {
      if (modalMode === 'edit' && editingProduct) {
        return prev.map(p => (p.sku === editingProduct.sku ? product : p));
      }
      // Add new product at the top
      const existingIndex = prev.findIndex(p => p.sku === product.sku);
      if (existingIndex !== -1) {
        // If SKU already exists, update instead of duplicating
        return prev.map((p, i) => (i === existingIndex ? product : p));
      }
      return [product, ...prev];
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <div className="procurement-page">
      <div className="proc-content" style={{ padding: '24px' }}>
        {/* Toolbar with search and Add Product button */}
        <div className="tab-toolbar">
          <div className="proc-search-box">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search by SKU or product name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={openAddModal}>
              <HiPlus /> Add Product
            </button>
          </div>
        </div>

        {/* Products table */}
        <div className="table-card">
          <table className="proc-table">
            <thead>
              <tr>
                <th>SKU ID</th>
                <th>Name of Product</th>
                <th className="num-col">Reference Price</th>
                <th className="num-col">Total Qty in Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No products found. Click &quot;Add Product&quot; to create one.
                  </td>
                </tr>
              )}
              {filtered.map(p => (
                <tr key={p.sku} className="proc-row">
                  <td className="ref-cell">{p.sku}</td>
                  <td className="prod-cell">{p.name}</td>
                  <td className="num-col">₹{p.referencePrice.toLocaleString()}</td>
                  <td className="num-col">{p.totalStock.toLocaleString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-outline btn-sm action-btn"
                      onClick={() => openEditModal(p)}
                    >
                      <HiOutlinePencil /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductModal
          mode={modalMode}
          initialProduct={modalMode === 'edit' ? editingProduct : null}
          onClose={closeModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

