import { useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineViewList,
  HiOutlineViewBoards,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePrinter,
  HiOutlineTrash,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { PRODUCTS, UNITS, nextTransferId, skuForProduct } from '../../data/intraWarehouseData';

const STATUS_ORDER = ['Draft', 'Ready', 'In Transit', 'Done'];

function statusClass(status) {
  switch (status) {
    case 'Draft':      return 'status-draft';
    case 'Ready':      return 'status-waiting';
    case 'In Transit': return 'status-transit';
    case 'Done':       return 'status-done';
    default:           return 'status-draft';
  }
}

// ─── Transfer View Modal ──────────────────────────────────────────────────────
function TransferViewModal({ transfer, warehouses, onClose, onValidate, onPrint }) {
  const currentIdx = STATUS_ORDER.indexOf(transfer.status);
  const fromWH = warehouses.find(w => w.name === transfer.fromWarehouse);
  const toWH   = warehouses.find(w => w.name === transfer.toWarehouse);

  return (
    <div className="intra-modal-overlay" onClick={onClose}>
      <div className="intra-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trf-view-header">
          <div>
            <div className="trf-view-ref">{transfer.id}</div>
            <div className="trf-view-date">Requested: {transfer.requestDate}</div>
          </div>
          <div className="trf-view-actions">
            <button className="btn btn-outline btn-sm" onClick={onPrint}>
              <HiOutlinePrinter /> Print
            </button>
            <button className="close-btn" onClick={onClose}><HiOutlineX /></button>
          </div>
        </div>

        <div className="trf-view-body">
          {/* Route display */}
          <div className="trf-route-display">
            <div className="trf-route-wh">
              <div className="trf-route-wh-name">{transfer.fromWarehouse}</div>
              <div className="trf-route-wh-loc">{fromWH?.location || '—'}</div>
            </div>
            <HiOutlineArrowRight className="trf-route-arrow-lg" />
            <div className="trf-route-wh">
              <div className="trf-route-wh-name">{transfer.toWarehouse}</div>
              <div className="trf-route-wh-loc">{toWH?.location || '—'}</div>
            </div>
          </div>

          {/* Fields grid */}
          <div className="trf-fields-grid">
            <div className="trf-field">
              <span className="trf-field-label">Schedule Date</span>
              <span className="trf-field-value">{transfer.scheduleDate}</span>
            </div>
            <div className="trf-field">
              <span className="trf-field-label">Responsible</span>
              <span className="trf-field-value">{transfer.responsible}</span>
            </div>
            <div className="trf-field">
              <span className="trf-field-label">Status</span>
              <span className={`status-badge ${statusClass(transfer.status)}`}>{transfer.status}</span>
            </div>
            {transfer.note && (
              <div className="trf-field">
                <span className="trf-field-label">Note</span>
                <span className="trf-field-value">{transfer.note}</span>
              </div>
            )}
          </div>

          {/* Status sections */}
          <div style={{ marginBottom: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Status
          </div>
          <div className="status-sections">
            {STATUS_ORDER.map((s, i) => {
              const state = i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'idle';
              return (
                <button
                  key={s}
                  className={`status-section status-section--${state}`}
                  onClick={() => onValidate(transfer.id, s)}
                  title={`Set status to ${s}`}
                >
                  <span className="status-section-num">{i + 1}</span>
                  <span className="status-section-label">{s}</span>
                  {state === 'done' && <HiOutlineCheck className="status-section-check" />}
                </button>
              );
            })}
          </div>

          {/* Products table */}
          <div className="product-table-wrap">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {transfer.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.sku}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.qty}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Print Preview Modal ──────────────────────────────────────────────────────
function PrintPreviewModal({ transfer, onClose }) {
  return (
    <div className="trf-print-overlay">
      <div className="trf-print-wrap">
        <div className="trf-print-actions">
          <button className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#444' }} onClick={onClose}>
            <HiOutlineX /> Close
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <HiOutlinePrinter /> Print
          </button>
        </div>
        <div className="trf-print-area">
          <div className="trf-print-watermark">TRANSFER</div>
          <div className="trf-print-doc-header">
            <div>
              <div className="trf-print-logo">TF</div>
              <div className="trf-print-subtitle">TraceFlow — Warehouse Transfer Document</div>
            </div>
            <div>
              <div className="trf-print-title">TRANSFER ORDER</div>
              <div className="trf-print-ref">{transfer.id}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div><strong>From:</strong> {transfer.fromWarehouse}</div>
            <div><strong>To:</strong> {transfer.toWarehouse}</div>
            <div><strong>Request Date:</strong> {transfer.requestDate}</div>
            <div><strong>Schedule Date:</strong> {transfer.scheduleDate}</div>
            <div><strong>Responsible:</strong> {transfer.responsible}</div>
            <div><strong>Status:</strong> {transfer.status}</div>
          </div>

          {transfer.note && (
            <div style={{ marginBottom: '16px', padding: '10px', background: '#f9f9f9', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Note:</strong> {transfer.note}
            </div>
          )}

          <table className="trf-print-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>SKU</th>
                <th style={{ textAlign: 'right' }}>Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {transfer.items.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.product}</td>
                  <td style={{ fontFamily: 'monospace' }}>{item.sku}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.qty}</td>
                  <td>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="trf-print-footer">
            <div className="trf-print-sign">Dispatched By</div>
            <div className="trf-print-sign">Received By</div>
            <div className="trf-print-sign">Authorized By</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── New Transfer Wizard ──────────────────────────────────────────────────────
function NewTransferWizard({ warehouses, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [fromWH, setFromWH] = useState('');
  const [toWH, setToWH] = useState('');
  const [items, setItems] = useState([{ product: '', sku: '', qty: '', unit: 'pcs', search: '', showDropdown: false }]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [note, setNote] = useState('');

  // ── Step 1 helpers ──
  const whNames = warehouses.map(w => w.name);
  const step1Valid = fromWH && toWH && fromWH !== toWH;

  // ── Step 2 helpers ──
  const updateItem = (idx, field, value) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  };
  const setProductSearch = (idx, val) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, search: val, product: val, showDropdown: true } : it));
  };
  const pickProduct = (idx, name) => {
    const p = PRODUCTS.find(p => p.name === name);
    setItems(prev => prev.map((it, i) => i === idx
      ? { ...it, product: name, sku: skuForProduct(name), unit: p?.defaultUnit || 'pcs', search: name, showDropdown: false }
      : it
    ));
  };
  const addRow = () => setItems(prev => [...prev, { product: '', sku: '', qty: '', unit: 'pcs', search: '', showDropdown: false }]);
  const removeRow = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const step2Valid = items.some(it => it.product && it.qty > 0);

  const filteredProducts = (search) =>
    PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // ── Confirm & Submit ──
  const today = new Date().toISOString().split('T')[0];
  const defaultSchedule = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const handleSubmit = () => {
    const validItems = items.filter(it => it.product && it.qty > 0);
    const transfer = {
      id: nextTransferId(),
      fromWarehouse: fromWH,
      toWarehouse: toWH,
      requestDate: today,
      scheduleDate: scheduleDate || defaultSchedule,
      status: 'Draft',
      responsible: 'Inventory Mgr',
      note,
      items: validItems.map(it => ({ product: it.product, sku: it.sku, qty: Number(it.qty), unit: it.unit })),
    };
    onSubmit(transfer);
    onClose();
  };

  const stepLabel = ['Route', 'Products', 'Confirm'];

  return (
    <div className="intra-modal-overlay" onClick={onClose}>
      <div className="intra-modal" onClick={e => e.stopPropagation()}>
        {/* Wizard header */}
        <div className="wizard-header">
          <div className="wizard-title">New Transfer Order</div>
          <div className="wizard-steps">
            {stepLabel.map((label, i) => {
              const n = i + 1;
              const isDone   = n < step;
              const isActive = n === step;
              return (
                <>
                  <div key={label} className={`wizard-step ${isActive ? 'wizard-step--active' : ''} ${isDone ? 'wizard-step--done' : ''}`}>
                    <div className="wizard-step-dot">
                      {isDone ? <HiOutlineCheck /> : n}
                    </div>
                    <span className="wizard-step-label">{label}</span>
                  </div>
                  {i < stepLabel.length - 1 && (
                    <div key={`c-${i}`} className={`wizard-connector ${isDone ? 'wizard-connector--done' : ''}`} />
                  )}
                </>
              );
            })}
          </div>
        </div>

        {/* Step 1 — Route */}
        {step === 1 && (
          <div className="wizard-body">
            <div className="wh-selector-wrap">
              <div className="wh-select-group">
                <label className="form-label">From Warehouse <span>*</span></label>
                <select className="form-select" value={fromWH} onChange={e => setFromWH(e.target.value)}>
                  <option value="">Select warehouse…</option>
                  {whNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <HiOutlineArrowRight className="wh-arrow-icon" />
              <div className="wh-select-group">
                <label className="form-label">To Warehouse <span>*</span></label>
                <select className="form-select" value={toWH} onChange={e => setToWH(e.target.value)}>
                  <option value="">Select warehouse…</option>
                  {whNames.filter(n => n !== fromWH).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            {fromWH && toWH && fromWH !== toWH && (
              <div className="wh-preview">
                <HiOutlineArrowRight />
                Transfer from <strong>{fromWH}</strong> → <strong>{toWH}</strong>
              </div>
            )}
            {fromWH && toWH && fromWH === toWH && (
              <div style={{ marginTop: '12px', color: 'var(--status-late)', fontSize: '0.85rem' }}>
                Source and destination cannot be the same warehouse.
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Products */}
        {step === 2 && (
          <div className="wizard-body">
            <div className="product-table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Product</th>
                    <th>SKU</th>
                    <th style={{ width: '80px' }}>Qty</th>
                    <th>Unit</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="product-search-wrap">
                          <input
                            className="form-input"
                            style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                            placeholder="Search product…"
                            value={item.search}
                            onChange={e => setProductSearch(idx, e.target.value)}
                            onFocus={() => updateItem(idx, 'showDropdown', true)}
                            onBlur={() => setTimeout(() => updateItem(idx, 'showDropdown', false), 150)}
                          />
                          {item.showDropdown && item.search && (
                            <div className="product-dropdown">
                              {filteredProducts(item.search).map(p => (
                                <div
                                  key={p.name}
                                  className="product-dropdown-item"
                                  onMouseDown={() => pickProduct(idx, p.name)}
                                >
                                  {p.name}
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>({p.defaultUnit})</span>
                                </div>
                              ))}
                              {filteredProducts(item.search).length === 0 && (
                                <div className="product-dropdown-item" style={{ color: 'var(--text-muted)' }}>No products found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.sku || '—'}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="qty-input"
                          min="1"
                          value={item.qty}
                          onChange={e => updateItem(idx, 'qty', e.target.value)}
                        />
                      </td>
                      <td>
                        <select className="unit-select" value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)}>
                          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </td>
                      <td>
                        {items.length > 1 && (
                          <button className="remove-row-btn" onClick={() => removeRow(idx)}><HiOutlineTrash /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-outline btn-sm" onClick={addRow}>
              <HiOutlinePlus /> Add Product
            </button>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="wizard-body">
            <div className="confirm-summary">
              <div className="confirm-summary-row">
                <span className="confirm-summary-label">Route</span>
                <span className="confirm-summary-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {fromWH} <HiOutlineArrowRight style={{ color: 'var(--primary)' }} /> {toWH}
                </span>
              </div>
              <div className="confirm-summary-row">
                <span className="confirm-summary-label">Products</span>
                <div className="confirm-items-list" style={{ textAlign: 'right' }}>
                  {items.filter(it => it.product && it.qty > 0).map((it, i) => (
                    <span key={i} className="confirm-item-chip">{it.qty} {it.unit} — {it.product}</span>
                  ))}
                </div>
              </div>
              <div className="confirm-summary-row">
                <span className="confirm-summary-label">Responsible</span>
                <span className="confirm-summary-value">Inventory Mgr</span>
              </div>
            </div>

            <div className="form-row form-row--2">
              <div className="form-group">
                <label className="form-label">Schedule Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={scheduleDate || defaultSchedule}
                  onChange={e => setScheduleDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Responsible</label>
                <input type="text" className="form-input" value="Inventory Mgr" readOnly />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Note (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Add a note…"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="wizard-footer">
          <button className="btn btn-outline" onClick={step === 1 ? onClose : () => setStep(s => s - 1)}>
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          {step < 3 ? (
            <button
              className="btn btn-primary"
              disabled={step === 1 ? !step1Valid : !step2Valid}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              <HiOutlineCheck /> Create Transfer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main TransfersTab ────────────────────────────────────────────────────────
export default function TransfersTab({ transfers, warehouses, onAddTransfer, onUpdateStatus }) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [showWizard, setShowWizard] = useState(false);
  const [viewTransfer, setViewTransfer] = useState(null);
  const [printTransfer, setPrintTransfer] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const toggleSection = (status) =>
    setCollapsed(prev => ({ ...prev, [status]: !prev[status] }));

  const filtered = transfers.filter(t => {
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.fromWarehouse.toLowerCase().includes(q) ||
      t.toWarehouse.toLowerCase().includes(q) ||
      t.items.some(it => it.product.toLowerCase().includes(q))
    );
  });

  const handleValidate = (id, status) => {
    onUpdateStatus(id, status);
    if (viewTransfer?.id === id) {
      setViewTransfer(prev => ({ ...prev, status }));
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="intra-toolbar">
        <div className="intra-search-wrap">
          <HiOutlineSearch className="intra-search-icon" />
          <input
            className="intra-search"
            placeholder="Search by reference, product or warehouse…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="intra-toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === 'list' ? 'view-toggle-btn--active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <HiOutlineViewList />
            </button>
            <button
              className={`view-toggle-btn ${view === 'kanban' ? 'view-toggle-btn--active' : ''}`}
              onClick={() => setView('kanban')}
              title="Kanban view"
            >
              <HiOutlineViewBoards />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
            <HiOutlinePlus /> New Transfer
          </button>
        </div>
      </div>

      {/* List View — Collapsible sections */}
      {view === 'list' && (
        <div className="intra-sections">
          {filtered.length === 0 && (
            <div className="intra-sections-empty">No transfers found</div>
          )}
          {[
            { status: 'Draft',      cls: 'draft'   },
            { status: 'Ready',      cls: 'ready'   },
            { status: 'In Transit', cls: 'transit' },
            { status: 'Done',       cls: 'done'    },
          ].map(({ status, cls }) => {
            const rows = filtered.filter(t => t.status === status);
            const isOpen = !collapsed[status];
            return (
              <div key={status} className={`intra-section intra-section--${cls}`}>
                {/* Section header */}
                <button
                  className={`intra-section-header intra-section-header--${cls}`}
                  onClick={() => toggleSection(status)}
                >
                  <div className="intra-section-header-left">
                    <span className={`intra-section-dot intra-section-dot--${cls}`} />
                    <span className="intra-section-title">{status}</span>
                    <span className="intra-section-count">{rows.length}</span>
                  </div>
                  <HiOutlineChevronDown
                    className={`intra-section-chevron ${isOpen ? 'intra-section-chevron--open' : ''}`}
                  />
                </button>

                {/* Section body */}
                {isOpen && (
                  <div className="intra-section-body">
                    {rows.length === 0 ? (
                      <div className="intra-section-empty">No {status.toLowerCase()} transfers</div>
                    ) : (
                      <table className="intra-table">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Route</th>
                            <th>Items</th>
                            <th>Schedule Date</th>
                            <th>Responsible</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(t => (
                            <tr key={t.id} onClick={() => setViewTransfer(t)}>
                              <td><span className="ref-link">{t.id}</span></td>
                              <td>
                                <div className="route-cell">
                                  <span className="route-wh">{t.fromWarehouse}</span>
                                  <HiOutlineArrowRight className="route-arrow" />
                                  <span className="route-wh">{t.toWarehouse}</span>
                                </div>
                              </td>
                              <td>{t.items.length} item{t.items.length !== 1 ? 's' : ''}</td>
                              <td>{t.scheduleDate}</td>
                              <td>{t.responsible}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="intra-kanban">
          {[
            { status: 'Draft',      cls: 'draft'   },
            { status: 'Ready',      cls: 'ready'   },
            { status: 'In Transit', cls: 'transit' },
            { status: 'Done',       cls: 'done'    },
          ].map(col => {
            const colCards = filtered.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="kanban-col">
                <div className={`kanban-col-header kanban-col-header--${col.cls}`}>
                  {col.status}
                  <span className="kanban-col-count">{colCards.length}</span>
                </div>
                <div className="kanban-cards">
                  {colCards.map(t => (
                    <div key={t.id} className="kanban-card" onClick={() => setViewTransfer(t)}>
                      <div className="kanban-card-ref">{t.id}</div>
                      <div className="kanban-card-route">
                        {t.fromWarehouse}
                        <HiOutlineArrowRight style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        {t.toWarehouse}
                      </div>
                      <div className="kanban-card-meta">
                        <span>{t.items.length} item{t.items.length !== 1 ? 's' : ''}</span>
                        <span>{t.scheduleDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showWizard && (
        <NewTransferWizard
          warehouses={warehouses}
          onClose={() => setShowWizard(false)}
          onSubmit={onAddTransfer}
        />
      )}

      {viewTransfer && (
        <TransferViewModal
          transfer={viewTransfer}
          warehouses={warehouses}
          onClose={() => setViewTransfer(null)}
          onValidate={handleValidate}
          onPrint={() => { setPrintTransfer(viewTransfer); setViewTransfer(null); }}
        />
      )}

      {printTransfer && (
        <PrintPreviewModal
          transfer={printTransfer}
          onClose={() => setPrintTransfer(null)}
        />
      )}
    </>
  );
}
