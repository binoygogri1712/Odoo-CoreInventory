import { useState, useMemo } from 'react';
import {
  HiOutlineSearch, HiOutlineViewList, HiOutlineViewBoards,
  HiPlus, HiX, HiChevronRight, HiChevronLeft, HiOutlinePrinter, HiChevronDown,
} from 'react-icons/hi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { PRODUCTS, UNITS, nextOrderId, nextReceiptId } from '../../data/procurementData';

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ['Ordered', 'In Transit', 'Delivered'];

const SECTION_META = {
  'Ordered':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  border: '#f59e0b' },
  'In Transit': { color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',  border: '#3b82f6' },
  'Delivered':  { color: '#22c55e', bg: 'rgba(34,197,94,0.07)',   border: '#22c55e' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cls = {
    'Ordered':    'status-waiting',
    'In Transit': 'status-transit',
    'Delivered':  'status-ready',
  }[status] || 'status-draft';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function StatusSelect({ orderId, currentStatus, openId, setOpenId, onUpdate }) {
  const isOpen = openId === orderId;
  return (
    <div className="status-select-wrap">
      <button
        className="status-select-trigger"
        onClick={e => { e.stopPropagation(); setOpenId(isOpen ? null : orderId); }}
      >
        <StatusBadge status={currentStatus} />
        <HiChevronDown className={`status-caret ${isOpen ? 'status-caret--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="status-select-menu">
          {ORDER_STATUSES.map(s => (
            <button
              key={s}
              className={`status-option ${s === currentStatus ? 'status-option--active' : ''}`}
              onClick={e => { e.stopPropagation(); onUpdate(orderId, s); setOpenId(null); }}
            >
              <StatusBadge status={s} />
              {s === currentStatus && <span className="status-tick">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="proc-stars">
      {[1, 2, 3, 4, 5].map(i =>
        i <= Math.round(rating)
          ? <AiFillStar key={i} className="star-fill" />
          : <AiOutlineStar key={i} className="star-empty" />
      )}
      <span className="star-score">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Sections View ────────────────────────────────────────────────────────────

function SectionsView({ filtered, openStatusId, setOpenStatusId, onUpdateStatus }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (status) => setCollapsed(p => ({ ...p, [status]: !p[status] }));

  return (
    <div className="sections-board">
      {ORDER_STATUSES.map(status => {
        const meta  = SECTION_META[status];
        const items = filtered.filter(o => o.status === status);
        const total = items.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const isCollapsed = collapsed[status];

        return (
          <div
            key={status}
            className="status-section"
            style={{ '--sec-color': meta.color, '--sec-border': meta.border }}
          >
            {/* Section header */}
            <div className="section-header" onClick={() => toggle(status)}>
              <div className="section-header-left">
                <div className="section-dot" style={{ background: meta.color }} />
                <StatusBadge status={status} />
                <span className="section-count">{items.length} order{items.length !== 1 ? 's' : ''}</span>
                {total > 0 && (
                  <span className="section-total">₹{total.toLocaleString()}</span>
                )}
              </div>
              <HiChevronDown className={`section-chevron ${!isCollapsed ? 'section-chevron--open' : ''}`} />
            </div>

            {/* Section body */}
            {!isCollapsed && (
              <div className="section-body">
                {items.length === 0 ? (
                  <div className="section-empty">No orders in this stage</div>
                ) : (
                  <table className="proc-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Vendor</th>
                        <th className="num-col">Qty</th>
                        <th>Unit</th>
                        <th className="num-col">Price / Unit</th>
                        <th className="num-col">Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(o => (
                        <tr key={o.id} className="proc-row">
                          <td className="ref-cell">{o.id}</td>
                          <td className="prod-cell">{o.product}</td>
                          <td className="sku-cell"><span className="sku-dash">—</span></td>
                          <td>{o.vendor}</td>
                          <td className="num-col">{o.quantity}</td>
                          <td>{o.unit}</td>
                          <td className="num-col">₹{o.pricePerUnit?.toLocaleString()}</td>
                          <td className="num-col">₹{o.totalPrice?.toLocaleString()}</td>
                          <td>
                            <StatusSelect
                              orderId={o.id}
                              currentStatus={o.status}
                              openId={openStatusId}
                              setOpenId={setOpenStatusId}
                              onUpdate={onUpdateStatus}
                            />
                          </td>
                          <td className="date-cell">{o.date}</td>
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
  );
}

// ─── Receipt Preview ──────────────────────────────────────────────────────────

function ReceiptPreview({ receipt, onClose }) {
  const [status, setStatus] = useState(receipt.status);
  const validate = () => {
    if (status === 'Draft') setStatus('Ready');
    else if (status === 'Ready') setStatus('Done');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="receipt-doc" onClick={e => e.stopPropagation()}>
        <div className="rdoc-header">
          <div className="rdoc-header-left">
            <button className="btn btn-outline btn-sm">New</button>
            <h2 className="rdoc-title">Receipt</h2>
          </div>
          <div className="rdoc-header-right">
            {status !== 'Done' && (
              <button className="btn btn-primary btn-sm" onClick={validate}>Validate</button>
            )}
            <button className="btn btn-outline btn-sm"><HiOutlinePrinter /> Print</button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <div className="status-flow">
              <span className={status === 'Draft' ? 'flow-step flow-step--active' : 'flow-step'}>Draft</span>
              <span className="flow-arrow">›</span>
              <span className={status === 'Ready' ? 'flow-step flow-step--active' : 'flow-step'}>Ready</span>
              <span className="flow-arrow">›</span>
              <span className={status === 'Done' ? 'flow-step flow-step--active' : 'flow-step'}>Done</span>
            </div>
          </div>
        </div>
        <div className="rdoc-ref">{receipt.id}</div>
        <div className="rdoc-fields">
          <div className="rdoc-field">
            <label>Receive From</label>
            <div className="rdoc-field-val">{receipt.receiveFrom}</div>
          </div>
          <div className="rdoc-field">
            <label>Schedule Date</label>
            <div className="rdoc-field-val">{receipt.scheduleDate}</div>
          </div>
          <div className="rdoc-field">
            <label>Responsible <span className="auto-tag">auto-filled</span></label>
            <div className="rdoc-field-val rdoc-field-auto">{receipt.responsible}</div>
          </div>
        </div>
        <div className="rdoc-products">
          <div className="rdoc-products-hd">Products</div>
          <table className="rdoc-table">
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Unit</th><th>Price / Unit</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>[SKU] {receipt.product}</td>
                <td>{receipt.quantity}</td>
                <td>{receipt.unit}</td>
                <td>₹{receipt.pricePerUnit?.toLocaleString()}</td>
                <td>₹{receipt.totalPrice?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rdoc-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── New Order Wizard ─────────────────────────────────────────────────────────

function NewOrderWizard({ vendors, onClose, onPlaceOrder, onAddVendor }) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', location: '', reliability: '4.0', priceNote: '' });
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null);

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectProduct = (p) => { setSelectedProduct(p); setSelectedUnit(p.defaultUnit); setSearch(p.name); };
  const selectVendor  = (v) => { setSelectedVendor(v); if (selectedProduct) setPricePerUnit(String(selectedProduct.basePrice)); };

  const addVendor = () => {
    if (!newVendor.name.trim()) return;
    onAddVendor({
      id: `V${Date.now()}`,
      name: newVendor.name.trim(),
      location: newVendor.location.trim() || '—',
      reliability: Math.min(5, Math.max(0, parseFloat(newVendor.reliability) || 4.0)),
      priceNote: newVendor.priceNote.trim() || 'Custom vendor',
    });
    setShowAddVendor(false);
    setNewVendor({ name: '', location: '', reliability: '4.0', priceNote: '' });
  };

  const placeOrder = () => {
    const qty = parseFloat(quantity), price = parseFloat(pricePerUnit);
    const orderId = nextOrderId(), receiptId = nextReceiptId();
    const today = new Date().toISOString().split('T')[0];
    const sched = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const order = {
      id: orderId, product: selectedProduct.name, sku: '',
      quantity: qty, unit: selectedUnit, pricePerUnit: price, totalPrice: qty * price,
      vendor: selectedVendor.name, status: 'Ordered', date: today,
    };
    const receipt = {
      id: receiptId, orderId, receiveFrom: selectedVendor.name,
      product: selectedProduct.name, quantity: qty, unit: selectedUnit,
      pricePerUnit: price, totalPrice: qty * price,
      responsible: 'Inventory Mgr', scheduleDate: sched, status: 'Draft', date: today,
    };
    onPlaceOrder(order, receipt);
    setReceiptPreview(receipt);
  };

  const total = parseFloat(quantity || 0) * parseFloat(pricePerUnit || 0);

  if (receiptPreview) return <ReceiptPreview receipt={receiptPreview} onClose={onClose} />;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={e => e.stopPropagation()}>

        <div className="wizard-header">
          <div className="wizard-steps">
            {[['1','Product'],['2','Vendor'],['3','Confirm']].map(([n, label], i) => (
              <div key={n} className={`wstep ${step > i+1 ? 'wstep--done' : ''} ${step === i+1 ? 'wstep--active' : ''}`}>
                <div className="wstep-dot">{step > i+1 ? '✓' : n}</div>
                <span>{label}</span>
                {i < 2 && <div className="wstep-line" />}
              </div>
            ))}
          </div>
          <button className="modal-close" onClick={onClose}><HiX /></button>
        </div>

        {step === 1 && (
          <div className="wizard-body">
            <h3 className="wizard-title">Select Product</h3>
            <p className="wizard-sub">Search by name or SKU code</p>
            <div className="proc-search-box">
              <HiOutlineSearch />
              <input autoFocus type="text" placeholder="e.g. Steel Bars, Cement…"
                value={search} onChange={e => { setSearch(e.target.value); setSelectedProduct(null); }} />
            </div>
            {search && !selectedProduct && (
              <div className="prod-dropdown">
                {filteredProducts.length > 0
                  ? filteredProducts.map(p => (
                    <div key={p.name} className="prod-option" onClick={() => selectProduct(p)}>
                      <span className="prod-opt-name">{p.name}</span>
                      <span className="prod-opt-meta">Base ₹{p.basePrice} / {p.defaultUnit}</span>
                    </div>
                  ))
                  : <div className="prod-option prod-option--none">No products found</div>
                }
              </div>
            )}
            {selectedProduct && (
              <div className="selected-prod-card">
                <div className="sel-prod-name">{selectedProduct.name}</div>
                <div className="field-row">
                  <label>Measurement Unit</label>
                  <select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            )}
            <div className="wizard-footer">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!selectedProduct} onClick={() => setStep(2)}>
                Next <HiChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-body">
            <h3 className="wizard-title">Select Vendor</h3>
            <p className="wizard-sub">Vendors for <strong>{selectedProduct?.name}</strong></p>
            <div className="vendor-grid">
              {vendors.map(v => (
                <div key={v.id}
                  className={`vendor-card ${selectedVendor?.id === v.id ? 'vendor-card--sel' : ''}`}
                  onClick={() => selectVendor(v)}
                >
                  <div className="vcard-top">
                    <div className="vcard-avatar">{v.name[0]}</div>
                    <div className="vcard-info">
                      <div className="vcard-name">{v.name}</div>
                      <div className="vcard-loc">{v.location}</div>
                    </div>
                    {selectedVendor?.id === v.id && <div className="vcard-tick">✓</div>}
                  </div>
                  <Stars rating={v.reliability} />
                  <div className="vcard-note">{v.priceNote}</div>
                </div>
              ))}
              <div className="vendor-card vendor-card--add" onClick={() => setShowAddVendor(true)}>
                <HiPlus className="vadd-icon" />
                <span>Add Vendor</span>
              </div>
            </div>
            {showAddVendor && (
              <div className="add-vendor-form">
                <h4>New Vendor</h4>
                <div className="avf-grid">
                  <input placeholder="Vendor Name *" value={newVendor.name}      onChange={e => setNewVendor(p => ({...p, name: e.target.value}))} />
                  <input placeholder="Location"      value={newVendor.location}  onChange={e => setNewVendor(p => ({...p, location: e.target.value}))} />
                  <input placeholder="Reliability (0–5)" type="number" min="0" max="5" step="0.1"
                    value={newVendor.reliability} onChange={e => setNewVendor(p => ({...p, reliability: e.target.value}))} />
                  <input placeholder="Price note" value={newVendor.priceNote} onChange={e => setNewVendor(p => ({...p, priceNote: e.target.value}))} />
                </div>
                <div className="avf-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowAddVendor(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={addVendor}>Add</button>
                </div>
              </div>
            )}
            <div className="wizard-footer">
              <button className="btn btn-outline" onClick={() => setStep(1)}><HiChevronLeft /> Back</button>
              <button className="btn btn-primary" disabled={!selectedVendor} onClick={() => setStep(3)}>
                Next <HiChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-body">
            <h3 className="wizard-title">Confirm Order</h3>
            <p className="wizard-sub">Review and finalise your order</p>
            <div className="confirm-summary">
              <div className="csrow"><span>Product</span><strong>{selectedProduct?.name}</strong></div>
              <div className="csrow"><span>Vendor</span><strong>{selectedVendor?.name}</strong></div>
              <div className="csrow"><span>Location</span><strong>{selectedVendor?.location}</strong></div>
            </div>
            <div className="confirm-inputs">
              <div className="cinput-group">
                <label>Quantity</label>
                <div className="input-affix">
                  <input type="number" min="1" placeholder="Enter quantity"
                    value={quantity} onChange={e => setQuantity(e.target.value)} />
                  <span className="affix-label">{selectedUnit}</span>
                </div>
              </div>
              <div className="cinput-group">
                <label>Price per {selectedUnit}</label>
                <div className="input-affix input-affix--pre">
                  <span className="affix-label">₹</span>
                  <input type="number" min="0" placeholder="0.00"
                    value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} />
                </div>
              </div>
            </div>
            {quantity && pricePerUnit && (
              <div className="total-preview">
                <span>Estimated Total</span>
                <strong>₹{total.toLocaleString()}</strong>
              </div>
            )}
            <div className="wizard-footer">
              <button className="btn btn-outline" onClick={() => setStep(2)}><HiChevronLeft /> Back</button>
              <button className="btn btn-success" disabled={!quantity || !pricePerUnit} onClick={placeOrder}>
                Place Order &amp; Generate Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

export default function OrdersTab({ orders, vendors, onAddOrder, onAddReceipt, onAddVendor, onUpdateStatus }) {
  const [view,          setView]         = useState('sections');
  const [search,        setSearch]       = useState('');
  const [showWizard,    setShowWizard]   = useState(false);
  const [openStatusId,  setOpenStatusId] = useState(null);

  const filtered = useMemo(() =>
    orders.filter(o =>
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.vendor.toLowerCase().includes(search.toLowerCase())
    ), [orders, search]);

  const handlePlaceOrder = (order, receipt) => { onAddOrder(order); onAddReceipt(receipt); };

  const kanban = {
    'Ordered':    filtered.filter(o => o.status === 'Ordered'),
    'In Transit': filtered.filter(o => o.status === 'In Transit'),
    'Delivered':  filtered.filter(o => o.status === 'Delivered'),
  };

  return (
    <div className="orders-tab" onClick={() => setOpenStatusId(null)}>
      {openStatusId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpenStatusId(null)} />
      )}

      {/* Toolbar */}
      <div className="tab-toolbar">
        <div className="proc-search-box">
          <HiOutlineSearch />
          <input type="text" placeholder="Search by product, reference, vendor…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button className={`view-btn ${view === 'sections' ? 'view-btn--on' : ''}`}
              onClick={() => setView('sections')} title="Sections view">
              <HiOutlineViewList />
            </button>
            <button className={`view-btn ${view === 'kanban' ? 'view-btn--on' : ''}`}
              onClick={() => setView('kanban')} title="Kanban view">
              <HiOutlineViewBoards />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
            <HiPlus /> New Order
          </button>
        </div>
      </div>

      {/* ── Sections View (default) ── */}
      {view === 'sections' && (
        <SectionsView
          filtered={filtered}
          openStatusId={openStatusId}
          setOpenStatusId={setOpenStatusId}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {/* ── Kanban View ── */}
      {view === 'kanban' && (
        <div className="kanban-board">
          {Object.entries(kanban).map(([col, items]) => (
            <div key={col} className="kanban-col">
              <div className="kcol-header">
                <StatusBadge status={col} />
                <span className="kcol-count">{items.length}</span>
              </div>
              <div className="kcol-cards">
                {items.map(o => (
                  <div key={o.id} className="kcard">
                    <div className="kcard-ref">{o.id}</div>
                    <div className="kcard-product">{o.product}</div>
                    <div className="kcard-meta">
                      <span>{o.quantity} {o.unit}</span>
                      <span>₹{o.totalPrice?.toLocaleString()}</span>
                    </div>
                    <div className="kcard-vendor">{o.vendor}</div>
                    <div className="kcard-date">{o.date}</div>
                    <div className="kcard-actions">
                      {o.status !== 'Ordered' && (
                        <button className="kcard-move-btn kcard-move-btn--back"
                          onClick={e => { e.stopPropagation(); onUpdateStatus(o.id, ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) - 1]); }}>
                          ← {ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) - 1]}
                        </button>
                      )}
                      {o.status !== 'Delivered' && (
                        <button className="kcard-move-btn kcard-move-btn--fwd"
                          onClick={e => { e.stopPropagation(); onUpdateStatus(o.id, ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) + 1]); }}>
                          {ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) + 1]} →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="kcol-empty">No orders</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showWizard && (
        <NewOrderWizard
          vendors={vendors}
          onClose={() => setShowWizard(false)}
          onPlaceOrder={handlePlaceOrder}
          onAddVendor={onAddVendor}
        />
      )}
    </div>
  );
}
