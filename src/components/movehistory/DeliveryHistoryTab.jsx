import { useState } from 'react';
import { HiOutlineArrowRight, HiOutlineSearch } from 'react-icons/hi';

export default function DeliveryHistoryTab({ deliveries }) {
  const [search, setSearch] = useState('');

  const delivered = deliveries
    .filter(d => d.status === 'Delivered')
    .filter(d => {
      const q = search.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.from.toLowerCase().includes(q) ||
        d.to.toLowerCase().includes(q) ||
        d.items.some(it => it.product.toLowerCase().includes(q))
      );
    });

  return (
    <div className="mh-tab">
      {/* Toolbar */}
      <div className="mh-toolbar">
        <div className="mh-search-box">
          <HiOutlineSearch className="mh-search-icon" />
          <input
            className="mh-search-input"
            placeholder="Search by delivery ID, site or product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="mh-count-badge">{delivered.length} completed deliver{delivered.length !== 1 ? 'ies' : 'y'}</span>
      </div>

      {/* Table */}
      <div className="mh-table-card">
        <table className="mh-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Order Date</th>
              <th>Route</th>
              <th>Items</th>
              <th>Scheduled Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {delivered.length === 0 && (
              <tr>
                <td colSpan="6" className="mh-empty-row">
                  {search ? 'No matching delivered orders found' : 'No completed deliveries yet'}
                </td>
              </tr>
            )}
            {delivered.map(d => (
              <tr key={d.id} className="mh-row">
                <td className="mh-ref-cell">{d.id}</td>
                <td className="mh-date-cell">{d.orderDate}</td>
                <td>
                  <div className="mh-route">
                    <span className="mh-route-wh">{d.from}</span>
                    <HiOutlineArrowRight className="mh-route-arrow" />
                    <span className="mh-route-site">{d.to}</span>
                  </div>
                </td>
                <td>
                  <div className="mh-items-list">
                    {d.items.map((it, i) => (
                      <div key={i} className="mh-item-chip">
                        <span className="mh-item-sku">{it.sku}</span>
                        {it.product}
                        <span className="mh-item-qty">×{it.qty} {it.unit}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="mh-date-cell">{d.scheduledDate}</td>
                <td>
                  <span className="status-badge status-ready">Delivered</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
