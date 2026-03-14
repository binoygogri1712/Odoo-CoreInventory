import { useState } from 'react';
import { HiOutlinePrinter, HiX, HiChevronDown } from 'react-icons/hi';
import { HiOutlineTruck } from 'react-icons/hi';

// ─── Status helpers ────────────────────────────────────────────────────────────

const DELIVERY_STATUSES = ['In Transit', 'Delivered'];

function StatusBadge({ status }) {
  const cls = {
    'In Transit': 'status-transit',
    'Delivered':  'status-ready',
  }[status] || 'status-draft';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function StatusSelect({ delivId, currentStatus, openId, setOpenId, onUpdate }) {
  const isOpen = openId === delivId;
  return (
    <div className="del-status-wrap">
      <button
        className="del-status-trigger"
        onClick={e => { e.stopPropagation(); setOpenId(isOpen ? null : delivId); }}
      >
        <StatusBadge status={currentStatus} />
        <HiChevronDown className={`del-status-caret ${isOpen ? 'del-status-caret--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="del-status-menu">
          {DELIVERY_STATUSES.map(s => (
            <button
              key={s}
              className={`del-status-option ${s === currentStatus ? 'del-status-option--active' : ''}`}
              onClick={e => { e.stopPropagation(); onUpdate(delivId, s); setOpenId(null); }}
            >
              <StatusBadge status={s} />
              {s === currentStatus && <span className="del-status-tick">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delivery Receipt Print Modal ──────────────────────────────────────────────

function DeliveryReceiptModal({ delivery, onClose }) {
  const handlePrint = () => window.print();

  return (
    <div className="modal-overlay print-hide" onClick={onClose}>
      <div className="del-print-wrap" onClick={e => e.stopPropagation()}>

        {/* Action bar */}
        <div className="del-print-actions print-hide">
          <span className="del-print-title">Delivery Note — {delivery.id}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="del-btn del-btn--primary del-btn--sm" onClick={handlePrint}>
              <HiOutlinePrinter /> Print Delivery Note
            </button>
            <button className="del-btn del-btn--outline del-btn--sm" onClick={onClose}>
              <HiX /> Close
            </button>
          </div>
        </div>

        {/* Printable area */}
        <div className="del-print-area">
          <div className="del-print-doc">

            <div className="del-print-header">
              <div className="del-print-logo">
                <HiOutlineTruck style={{ fontSize: 22, marginRight: 6 }} />
                CoreInventory
              </div>
              <div className="del-print-meta">
                <div className="del-print-type">DELIVERY NOTE</div>
                <div className="del-print-ref">{delivery.id}</div>
                <div className="del-print-date">Order Date: {delivery.orderDate}</div>
              </div>
            </div>

            <hr className="del-print-divider" />

            <div className="del-print-fields">
              <div className="del-print-field">
                <span className="del-print-label">From</span>
                <span className="del-print-val">{delivery.from}</span>
              </div>
              <div className="del-print-field">
                <span className="del-print-label">To (Destination)</span>
                <span className="del-print-val">{delivery.to}</span>
              </div>
              <div className="del-print-field">
                <span className="del-print-label">Scheduled Date</span>
                <span className="del-print-val">{delivery.scheduledDate}</span>
              </div>
              <div className="del-print-field">
                <span className="del-print-label">Duration</span>
                <span className="del-print-val">{delivery.duration} day(s)</span>
              </div>
              <div className="del-print-field">
                <span className="del-print-label">Status</span>
                <span className="del-print-val">{delivery.status}</span>
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
                  {delivery.items.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="del-sku-cell">{item.sku}</td>
                      <td>{item.product}</td>
                      <td>{item.unit}</td>
                      <td className="num">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="del-print-footer">
              <div className="del-sign-block">
                <div className="del-sign-line" />
                <div className="del-sign-label">Dispatched By</div>
              </div>
              <div className="del-sign-block">
                <div className="del-sign-line" />
                <div className="del-sign-label">Received By</div>
              </div>
              <div className="del-sign-block">
                <div className="del-sign-line" />
                <div className="del-sign-label">Authorised By</div>
              </div>
            </div>

            <div className="del-print-watermark">
              {delivery.status === 'Delivered' ? 'DELIVERED' : delivery.status.toUpperCase()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Delivery Tab ──────────────────────────────────────────────────────────────

export default function DeliveryTab({ deliveries, onUpdateStatus }) {
  const [openStatusId, setOpenStatusId] = useState(null);
  const [printDelivery, setPrintDelivery] = useState(null);

  return (
    <div
      className="del-tab"
      onClick={() => setOpenStatusId(null)}
    >
      {/* Backdrop to close status dropdown */}
      {openStatusId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setOpenStatusId(null)}
        />
      )}

      <div className="del-table-card">
        <table className="del-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Order Date</th>
              <th>Scheduled Date</th>
              <th>From</th>
              <th>To</th>
              <th>Items</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 && (
              <tr><td colSpan="8" className="del-empty-row">No deliveries yet</td></tr>
            )}
            {deliveries.map(d => (
              <tr key={d.id} className="del-row">
                <td className="del-id-cell">{d.id}</td>
                <td className="del-date-cell">{d.orderDate}</td>
                <td className="del-date-cell">{d.scheduledDate}</td>
                <td>{d.from}</td>
                <td><span className="del-site-pill">{d.to}</span></td>
                <td className="del-items-cell">
                  {d.items.map((it, i) => (
                    <div key={i} className="del-item-chip">{it.product} <span>×{it.qty} {it.unit}</span></div>
                  ))}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <StatusSelect
                    delivId={d.id}
                    currentStatus={d.status}
                    openId={openStatusId}
                    setOpenId={setOpenStatusId}
                    onUpdate={onUpdateStatus}
                  />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button
                    className="del-receipt-btn"
                    title="Print Delivery Note"
                    onClick={() => setPrintDelivery(d)}
                  >
                    <HiOutlinePrinter /> Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {printDelivery && (
        <DeliveryReceiptModal
          delivery={printDelivery}
          onClose={() => setPrintDelivery(null)}
        />
      )}
    </div>
  );
}
