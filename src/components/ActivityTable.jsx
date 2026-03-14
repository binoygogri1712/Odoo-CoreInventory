import './ActivityTable.css';

const statusMap = {
  Ready: 'status-ready',
  Waiting: 'status-waiting',
  Late: 'status-late',
  Draft: 'status-draft',
  Done: 'status-done',
};

export default function ActivityTable({ data }) {
  return (
    <div className="activity-table-wrap">
      <div className="activity-table__header">
        <h2 className="activity-table__title">Recent Stock Movements</h2>
        <button className="activity-table__btn">View All →</button>
      </div>
      <div className="activity-table__scroll">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Product</th>
              <th>From</th>
              <th>To</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="activity-table__row" style={{ animationDelay: `${i * 60}ms` }}>
                <td>
                  <span className="activity-table__ref">{row.reference}</span>
                </td>
                <td className="activity-table__date">{row.date}</td>
                <td className="activity-table__product">{row.product}</td>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>
                  <span className={`activity-table__qty ${row.qtyType === 'in' ? 'qty--in' : row.qtyType === 'out' ? 'qty--out' : ''}`}>
                    {row.qtyType === 'in' ? '+' : row.qtyType === 'out' ? '-' : ''}{row.qty}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${statusMap[row.status] || ''}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
