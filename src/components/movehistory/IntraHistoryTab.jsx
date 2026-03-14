import { useState } from 'react';
import { HiOutlineArrowRight, HiOutlineSearch } from 'react-icons/hi';

export default function IntraHistoryTab({ transfers }) {
  const [search, setSearch] = useState('');

  const done = transfers
    .filter(t => t.status === 'Done')
    .filter(t => {
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.fromWarehouse.toLowerCase().includes(q) ||
        t.toWarehouse.toLowerCase().includes(q) ||
        t.items.some(it => it.product.toLowerCase().includes(q))
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
            placeholder="Search by reference, warehouse or product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="mh-count-badge">{done.length} completed transfer{done.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="mh-table-card">
        <table className="mh-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Route</th>
              <th>Items</th>
              <th>Schedule Date</th>
              <th>Responsible</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {done.length === 0 && (
              <tr>
                <td colSpan="6" className="mh-empty-row">
                  {search ? 'No matching completed transfers found' : 'No completed intra-warehouse transfers yet'}
                </td>
              </tr>
            )}
            {done.map(t => (
              <tr key={t.id} className="mh-row">
                <td className="mh-ref-cell">{t.id}</td>
                <td>
                  <div className="mh-route">
                    <span className="mh-route-wh">{t.fromWarehouse}</span>
                    <HiOutlineArrowRight className="mh-route-arrow" />
                    <span className="mh-route-wh">{t.toWarehouse}</span>
                  </div>
                </td>
                <td>
                  <div className="mh-items-list">
                    {t.items.map((it, i) => (
                      <div key={i} className="mh-item-chip">
                        <span className="mh-item-sku">{it.sku}</span>
                        {it.product}
                        <span className="mh-item-qty">×{it.qty} {it.unit}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="mh-date-cell">{t.scheduleDate}</td>
                <td className="mh-resp-cell">{t.responsible}</td>
                <td>
                  <span className="status-badge status-done">Done</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
