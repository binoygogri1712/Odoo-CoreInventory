import { useNavigate } from 'react-router-dom';
import './OperationCard.css';

export default function OperationCard({ title, icon: Icon, stats, total, path, gradient, delay = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      className="op-card animate-slide-in"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(path)}
    >
      <div className="op-card__header">
        <div className="op-card__title-group">
          <div className="op-card__icon-wrap" style={{ background: gradient }}>
            <Icon className="op-card__icon" />
          </div>
          <div>
            <h3 className="op-card__title">{title}</h3>
            <span className="op-card__total">{total} operations</span>
          </div>
        </div>
        <button className="op-card__view-btn">View All →</button>
      </div>

      <div className="op-card__stats">
        {stats.map((stat, i) => (
          <div className="op-card__stat" key={i}>
            <div className="op-card__stat-header">
              <span
                className="op-card__stat-dot"
                style={{ background: stat.color }}
              ></span>
              <span className="op-card__stat-label">{stat.label}</span>
            </div>
            <span className="op-card__stat-value">{stat.value}</span>
            <div className="op-card__stat-bar">
              <div
                className="op-card__stat-bar-fill"
                style={{
                  width: `${(stat.value / total) * 100}%`,
                  background: stat.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
