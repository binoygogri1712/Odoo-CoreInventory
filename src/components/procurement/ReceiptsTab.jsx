import { useState, useMemo } from 'react';
import { HiOutlineSearch, HiPlus, HiX, HiOutlinePrinter, HiOutlineEye } from 'react-icons/hi';
import { PRODUCTS, UNITS, nextReceiptId, nextOrderId } from '../../data/procurementData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cls = { Draft: 'status-draft', Ready: 'status-ready', Done: 'status-done' }[status] || 'status-draft';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function StatusFlow({ status }) {
  return (
    <div className="status-flow">
      {['Draft', 'Ready', 'Done'].map((s, i) => (
        <>
          {i > 0 && <span key={`a${i}`} className="flow-arrow">›</span>}
          <span key={s} className={`flow-step ${status === s ? 'flow-step--active' : ''}`}>{s}</span>
        </>
      ))}
    </div>
  );
}

// ─── Receipt View Modal (read-only row click) ─────────────────────────────────

function ReceiptViewModal({ receipt, onClose }) {
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
            <StatusFlow status={status} />
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
            <div className="rdoc-field-val">{receipt.scheduleDate || '—'}</div>
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
                <td>₹{receipt.pricePerUnit?.toLocaleString() || '—'}</td>
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

// ─── New Receipt Form Modal ───────────────────────────────────────────────────

function NewReceiptModal({ onClose, onSave }) {
  const [receiptId] = useState(() => nextReceiptId());
  const [orderId]   = useState(() => nextOrderId());
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    receiveFrom: '',
    scheduleDate: '',
    responsible: 'Inventory Mgr',
    product: '',
    quantity: '',
    unit: 'bags',
    pricePerUnit: '',
    status: 'Draft',
  });

  const [prodSearch, setProdSearch] = useState('');
  const [showDrop,   setShowDrop]   = useState(false);

  const filteredProds = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const selectProd = (p) => {
    setForm(f => ({ ...f, product: p.name, unit: p.defaultUnit, pricePerUnit: String(p.basePrice) }));
    setProdSearch(p.name);
    setShowDrop(false);
  };

  const validate = () => {
    setForm(f => ({
      ...f,
      status: f.status === 'Draft' ? 'Ready' : f.status === 'Ready' ? 'Done' : 'Done',
    }));
  };

  const total = parseFloat(form.quantity || 0) * parseFloat(form.pricePerUnit || 0);

  const handleSave = () => {
    const receipt = {
      id: receiptId,
      orderId,
      receiveFrom: form.receiveFrom,
      product: form.product,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      pricePerUnit: parseFloat(form.pricePerUnit),
      totalPrice: total,
      responsible: form.responsible,
      scheduleDate: form.scheduleDate,
      status: form.status,
      date: today,
    };
    const order = {
      id: orderId,
      product: form.product,
      sku: '',
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      pricePerUnit: parseFloat(form.pricePerUnit),
      totalPrice: total,
      vendor: form.receiveFrom,
      status: form.status === 'Done' ? 'Completed' : form.status === 'Ready' ? 'Ready' : 'Ordered',
      date: today,
    };
    onSave(receipt, order);
  };

  const canSave = form.product && form.quantity && form.receiveFrom && form.pricePerUnit;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="receipt-doc receipt-doc--form" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rdoc-header">
          <div className="rdoc-header-left">
            <h2 className="rdoc-title">New Receipt</h2>
          </div>
          <div className="rdoc-header-right">
            <button
              className={`btn btn-sm ${form.status !== 'Done' ? 'btn-primary' : 'btn-outline'}`}
              onClick={validate}
              disabled={form.status === 'Done'}
            >
              {form.status === 'Draft' ? 'Validate → Ready' : form.status === 'Ready' ? 'Validate → Done' : 'Validated ✓'}
            </button>
            <button className="btn btn-outline btn-sm"><HiOutlinePrinter /> Print</button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <StatusFlow status={form.status} />
          </div>
        </div>

        <div className="rdoc-ref">{receiptId}</div>

        {/* Fields */}
        <div className="rdoc-fields">
          <div className="rdoc-field">
            <label>Receive From</label>
            <input
              type="text"
              className="rdoc-input"
              placeholder="Vendor / supplier name"
              value={form.receiveFrom}
              onChange={e => setForm(f => ({ ...f, receiveFrom: e.target.value }))}
            />
          </div>
          <div className="rdoc-field">
            <label>Schedule Date</label>
            <input
              type="date"
              className="rdoc-input"
              value={form.scheduleDate}
              onChange={e => setForm(f => ({ ...f, scheduleDate: e.target.value }))}
            />
          </div>
          <div className="rdoc-field">
            <label>Responsible <span className="auto-tag">auto-filled</span></label>
            <input type="text" className="rdoc-input rdoc-input--ro" value={form.responsible} readOnly />
          </div>
        </div>

        {/* Products table */}
        <div className="rdoc-products">
          <div className="rdoc-products-hd">Products</div>
          <table className="rdoc-table">
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Unit</th><th>Price / Unit</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr>
                {/* Product search cell */}
                <td style={{ position: 'relative', minWidth: 200 }}>
                  <input
                    type="text"
                    className="rdoc-table-input"
                    placeholder="Search product…"
                    value={prodSearch}
                    onChange={e => { setProdSearch(e.target.value); setShowDrop(true); }}
                    onFocus={() => setShowDrop(true)}
                  />
                  {showDrop && prodSearch && (
                    <div className="prod-dropdown prod-dropdown--table">
                      {filteredProds.map(p => (
                        <div key={p.name} className="prod-option" onClick={() => selectProd(p)}>
                          {p.name}
                        </div>
                      ))}
                      {filteredProds.length === 0 && (
                        <div className="prod-option prod-option--none">No match</div>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="number" min="1" className="rdoc-table-input rdoc-table-input--sm"
                    placeholder="Qty"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </td>
                <td>
                  <select
                    className="rdoc-table-input rdoc-table-input--sm"
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  >
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </td>
                <td>
                  <input
                    type="number" min="0" className="rdoc-table-input rdoc-table-input--sm"
                    placeholder="₹"
                    value={form.pricePerUnit}
                    onChange={e => setForm(f => ({ ...f, pricePerUnit: e.target.value }))}
                  />
                </td>
                <td className="total-cell">
                  {total > 0 ? `₹${total.toLocaleString()}` : '—'}
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="new-prod-row">+ New Product</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rdoc-footer rdoc-footer--form">
          <button className="btn btn-outline" onClick={onClose}>Discard</button>
          <button className="btn btn-primary" disabled={!canSave} onClick={handleSave}>
            Save &amp; Add to Orders
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Print Preview Modal ───────────────────────────────────────────────────────

function PrintPreviewModal({ receipt, onClose }) {
  const handlePrint = () => window.print();

  return (
    <div className="modal-overlay print-hide" onClick={onClose}>
      <div className="print-preview-wrap" onClick={e => e.stopPropagation()}>
        {/* action bar — hidden on print */}
        <div className="print-preview-actions print-hide">
          <span className="print-preview-title">Receipt Preview</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <HiOutlinePrinter /> Print this Receipt
            </button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              <HiX /> Close
            </button>
          </div>
        </div>

        {/* printable area */}
        <div className="print-area" id="print-area">
          <div className="print-doc">
            <div className="print-doc-header">
              <div className="print-doc-logo">CoreInventory</div>
              <div className="print-doc-meta">
                <div className="print-doc-type">GOODS RECEIPT NOTE</div>
                <div className="print-doc-ref">{receipt.id}</div>
                <div className="print-doc-date">Date: {receipt.date}</div>
              </div>
            </div>

            <hr className="print-divider" />

            <div className="print-fields">
              <div className="print-field">
                <span className="print-label">Order Reference</span>
                <span className="print-val">{receipt.orderId}</span>
              </div>
              <div className="print-field">
                <span className="print-label">Receive From</span>
                <span className="print-val">{receipt.receiveFrom}</span>
              </div>
              <div className="print-field">
                <span className="print-label">Responsible</span>
                <span className="print-val">{receipt.responsible}</span>
              </div>
              <div className="print-field">
                <span className="print-label">Schedule Date</span>
                <span className="print-val">{receipt.scheduleDate || '—'}</span>
              </div>
              <div className="print-field">
                <span className="print-label">Status</span>
                <span className="print-val">{receipt.status}</span>
              </div>
            </div>

            <div className="print-table-wrap">
              <table className="print-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Unit</th>
                    <th className="num">Qty</th>
                    <th className="num">Price / Unit</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{receipt.product}</td>
                    <td>{receipt.unit}</td>
                    <td className="num">{receipt.quantity}</td>
                    <td className="num">₹{receipt.pricePerUnit?.toLocaleString()}</td>
                    <td className="num">₹{receipt.totalPrice?.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="num"><strong>Grand Total</strong></td>
                    <td className="num"><strong>₹{receipt.totalPrice?.toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="print-footer">
              <div className="print-sign-block">
                <div className="print-sign-line" />
                <div className="print-sign-label">Receiver Signature</div>
              </div>
              <div className="print-sign-block">
                <div className="print-sign-line" />
                <div className="print-sign-label">Authorised By</div>
              </div>
            </div>

            <div className="print-watermark">{receipt.status === 'Done' ? 'RECEIVED' : receipt.status.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Receipts Tab ─────────────────────────────────────────────────────────────

export default function ReceiptsTab({ receipts, onAddReceipt, onAddOrder }) {
  const [search,        setSearch]        = useState('');
  const [showNew,       setShowNew]       = useState(false);
  const [viewReceipt,   setViewReceipt]   = useState(null);
  const [printReceipt,  setPrintReceipt]  = useState(null);

  const filtered = useMemo(() =>
    receipts.filter(r =>
      r.product?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase()) ||
      r.receiveFrom?.toLowerCase().includes(search.toLowerCase())
    ), [receipts, search]);

  const handleSave = (receipt, order) => {
    onAddReceipt(receipt);
    onAddOrder(order);
    setShowNew(false);
  };

  return (
    <div className="receipts-tab">
      {/* Toolbar */}
      <div className="tab-toolbar">
        <div className="proc-search-box">
          <HiOutlineSearch />
          <input
            type="text"
            placeholder="Search receipts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <HiPlus /> New Receipt
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="proc-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Order Ref</th>
              <th>Product</th>
              <th>Receive From</th>
              <th className="num-col">Qty</th>
              <th className="num-col">Total</th>
              <th>Responsible</th>
              <th>Schedule Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="9" className="empty-row">No receipts found</td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} className="proc-row proc-row--click" onClick={() => setViewReceipt(r)}>
                <td className="ref-cell">{r.id}</td>
                <td className="ref-cell">{r.orderId}</td>
                <td className="prod-cell">{r.product}</td>
                <td>{r.receiveFrom}</td>
                <td className="num-col">{r.quantity} {r.unit}</td>
                <td className="num-col">₹{r.totalPrice?.toLocaleString()}</td>
                <td>{r.responsible}</td>
                <td className="date-cell">{r.scheduleDate || '—'}</td>
                <td className="actions-cell" onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-outline btn-sm action-btn"
                    title="View Receipt"
                    onClick={() => setViewReceipt(r)}
                  >
                    <HiOutlineEye /> View
                  </button>
                  <button
                    className="btn btn-outline btn-sm action-btn"
                    title="Print Receipt"
                    onClick={() => setPrintReceipt(r)}
                  >
                    <HiOutlinePrinter /> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && <NewReceiptModal onClose={() => setShowNew(false)} onSave={handleSave} />}
      {viewReceipt && <ReceiptViewModal receipt={viewReceipt} onClose={() => setViewReceipt(null)} />}
      {printReceipt && <PrintPreviewModal receipt={printReceipt} onClose={() => setPrintReceipt(null)} />}
    </div>
  );
}
