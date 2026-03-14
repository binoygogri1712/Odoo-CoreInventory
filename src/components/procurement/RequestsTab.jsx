import { useState, useMemo } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

export default function RequestsTab({ requests, onApprove }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.product.toLowerCase().includes(q) ||
      r.vendor.toLowerCase().includes(q) ||
      (r.warehouse || '').toLowerCase().includes(q)
    );
  }, [requests, search]);

  return (
    <div className="receipts-tab">
      {/* Toolbar */}
      <div className="tab-toolbar">
        <div className="proc-search-box">
          <HiOutlineSearch />
          <input
            type="text"
            placeholder="Search procurement requests…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="proc-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Order Ref</th>
              <th>Product</th>
              <th>Vendor</th>
              <th>Warehouse</th>
              <th className="num-col">Qty</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-row">
                  No procurement requests yet.
                </td>
              </tr>
            )}
            {filtered.map(req => (
              <tr key={req.id} className="proc-row">
                <td className="ref-cell">{req.id}</td>
                <td className="ref-cell">{req.orderId}</td>
                <td className="prod-cell">{req.product}</td>
                <td>{req.vendor}</td>
                <td>{req.warehouse || '—'}</td>
                <td className="num-col">
                  {req.quantity} {req.unit}
                </td>
                <td>
                  <span
                    className={
                      req.status === 'Approved'
                        ? 'status-badge status-ready'
                        : 'status-badge status-waiting'
                    }
                  >
                    {req.status}
                  </span>
                </td>
                <td className="date-cell">{req.date}</td>
                <td className="actions-cell">
                  {req.status !== 'Approved' && onApprove && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onApprove(req.id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

