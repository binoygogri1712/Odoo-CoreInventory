import { useState } from 'react';
import { HiCheck, HiX, HiOutlineClipboardList } from 'react-icons/hi';

// ─── Status Badge ──────────────────────────────────────────────────────────────

function ReqStatusBadge({ status }) {
  const cls = {
    Pending:  'status-waiting',
    Approved: 'status-ready',
    Partial:  'status-transit',
  }[status] || 'status-draft';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

// ─── Request Detail Modal ──────────────────────────────────────────────────────

function RequestDetailModal({ request, onClose, onApprove }) {
  const [checked, setChecked] = useState(
    () => request.items.reduce((acc, _, i) => ({ ...acc, [i]: request.items[i].approved }), {})
  );

  const toggleItem = idx =>
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));

  const approveAll = () =>
    setChecked(request.items.reduce((acc, _, i) => ({ ...acc, [i]: true }), {}));

  const anyChecked    = Object.values(checked).some(Boolean);
  const allUnapproved = request.items.every(it => !it.approved);

  const handleApprove = () => {
    onApprove(request.id, checked);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="req-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="req-modal-header">
          <div className="req-modal-title-row">
            <HiOutlineClipboardList className="req-modal-icon" />
            <div>
              <div className="req-modal-id">{request.id}</div>
              <div className="req-modal-site">
                Material Request — <strong>{request.site}</strong>
              </div>
            </div>
          </div>
          <div className="req-modal-meta">
            <span className="req-modal-date">Requested: {request.requestDate}</span>
            <ReqStatusBadge status={request.status} />
            <button className="req-close-btn" onClick={onClose}><HiX /></button>
          </div>
        </div>

        {/* Items Table */}
        <div className="req-modal-body">
          <div className="req-items-header">
            <span className="req-items-title">Requested Materials</span>
            {allUnapproved && (
              <button className="del-btn del-btn--outline del-btn--sm" onClick={approveAll}>
                <HiCheck /> Approve All
              </button>
            )}
          </div>

          <table className="del-table req-items-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>SKU</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {request.items.map((item, i) => (
                <tr key={i} className={`req-item-row ${checked[i] ? 'req-item-row--checked' : ''}`}>
                  <td>
                    <label className="req-checkbox-label">
                      <input
                        type="checkbox"
                        className="req-checkbox"
                        checked={!!checked[i]}
                        onChange={() => toggleItem(i)}
                        disabled={item.approved}
                      />
                      <span className="req-checkbox-custom" />
                    </label>
                  </td>
                  <td className="del-sku-cell">{item.sku}</td>
                  <td className="req-prod-cell">{item.product}</td>
                  <td><strong>{item.qty}</strong></td>
                  <td>{item.unit}</td>
                  <td>
                    {item.approved
                      ? <span className="status-badge status-ready">Approved</span>
                      : checked[i]
                        ? <span className="status-badge status-transit">Selected</span>
                        : <span className="status-badge status-draft">Pending</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="req-modal-footer">
          <button className="del-btn del-btn--outline" onClick={onClose}>Cancel</button>
          {anyChecked && !request.items.every(it => it.approved) && (
            <button className="del-btn del-btn--approve" onClick={handleApprove}>
              <HiCheck /> APPROVE Selected
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Requests Tab ──────────────────────────────────────────────────────────────

export default function RequestsTab({ requests, onApprove }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pending  = requests.filter(r => r.status !== 'Approved').length;

  return (
    <div className="del-tab">

      {pending > 0 && (
        <div className="req-alert-banner">
          <HiOutlineClipboardList className="req-alert-icon" />
          <span><strong>{pending}</strong> material request{pending !== 1 ? 's' : ''} awaiting approval from site(s)</span>
        </div>
      )}

      <div className="req-list">
        {requests.length === 0 && (
          <div className="del-empty-state">
            <HiOutlineClipboardList className="del-empty-icon" />
            <p>No site requests yet</p>
          </div>
        )}

        {requests.map(req => (
          <div
            key={req.id}
            className={`req-card ${req.status === 'Approved' ? 'req-card--approved' : ''}`}
            onClick={() => setSelectedRequest(req)}
          >
            <div className="req-card-left">
              <div className="req-card-site">{req.site}</div>
              <div className="req-card-id">{req.id}</div>
              <div className="req-card-date">Requested on {req.requestDate}</div>
            </div>
            <div className="req-card-center">
              <div className="req-card-items-preview">
                {req.items.slice(0, 2).map((it, i) => (
                  <span key={i} className="req-item-tag">
                    {it.product} <em>×{it.qty} {it.unit}</em>
                  </span>
                ))}
                {req.items.length > 2 && (
                  <span className="req-item-tag req-item-tag--more">+{req.items.length - 2} more</span>
                )}
              </div>
            </div>
            <div className="req-card-right">
              <ReqStatusBadge status={req.status} />
              <span className="req-card-count">{req.items.length} item{req.items.length !== 1 ? 's' : ''}</span>
              <span className="req-view-hint">Click to review →</span>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={onApprove}
        />
      )}
    </div>
  );
}
