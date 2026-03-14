import { useEffect, useRef, useState } from 'react';
import './KPICard.css';

export default function KPICard({ icon: Icon, title, value, trend, trendLabel, gradient, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const numVal = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(numVal)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * numVal);
      setDisplayValue(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="kpi-card animate-slide-in" style={{ animationDelay: `${delay}ms` }} ref={cardRef}>
      <div className="kpi-card__accent" style={{ background: gradient }}></div>
      <div className="kpi-card__content">
        <div className="kpi-card__header">
          <div className="kpi-card__icon-wrap" style={{ background: gradient }}>
            <Icon className="kpi-card__icon" />
          </div>
          {trend !== undefined && (
            <span className={`kpi-card__trend ${trend >= 0 ? 'kpi-card__trend--up' : 'kpi-card__trend--down'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="kpi-card__body">
          <span className="kpi-card__value">{displayValue.toLocaleString()}</span>
          <span className="kpi-card__title">{title}</span>
        </div>
        {trendLabel && <span className="kpi-card__trend-label">{trendLabel}</span>}
      </div>
    </div>
  );
}
