import { useState } from 'react';
import { HiOutlineSearch, HiX, HiPlus } from 'react-icons/hi';
import { HiOutlineTruck } from 'react-icons/hi';
import { PRODUCTS, skuForProduct, SITES } from '../../data/deliveryData';

// ─── Schedule Tab ──────────────────────────────────────────────────────────────

export default function ScheduleTab({ onSchedule }) {
  const [selectedSite,   setSelectedSite]   = useState('');
  const [prodSearch,     setProdSearch]      = useState('');
  const [showDrop,       setShowDrop]        = useState(false);
  const [selectedItems,  setSelectedItems]   = useState([]); // { product, sku, unit, qty }
  const [scheduleDate,   setScheduleDate]    = useState('');
  const [duration,       setDuration]        = useState('');
  const [fromLocation,   setFromLocation]    = useState('Main Warehouse');
  const [submitted,      setSubmitted]       = useState(false);

  const FROM_LOCATIONS = ['Main Warehouse', 'Store Room 1', 'Store Room 2'];

  const filteredProds = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) &&
    !selectedItems.find(si => si.product === p.name)
  );

  const addProduct = (p) => {
    const sku = skuForProduct(p.name);
    setSelectedItems(prev => [...prev, { product: p.name, sku, unit: p.defaultUnit, qty: 1 }]);
    setProdSearch('');
    setShowDrop(false);
  };

  const updateQty = (idx, qty) => {
    setSelectedItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(1, Number(qty)) } : it));
  };

  const removeItem = (idx) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== idx));
  };

  const canSchedule = selectedSite && selectedItems.length > 0 && scheduleDate && duration;

  const handleSchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    const delivery = {
      orderDate:     today,
      scheduledDate: scheduleDate,
      from:          fromLocation,
      to:            selectedSite,
      status:        'In Transit',
      duration:      Number(duration),
      items:         selectedItems.map(it => ({ product: it.product, sku: it.sku, qty: it.qty, unit: it.unit })),
    };
    onSchedule(delivery);
    // Reset form
    setSelectedSite('');
    setProdSearch('');
    setSelectedItems([]);
    setScheduleDate('');
    setDuration('');
    setFromLocation('Main Warehouse');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="del-tab sch-tab">

      {submitted && (
        <div className="sch-success-banner">
          <span>✓</span> Delivery scheduled successfully! View it under the <strong>Delivery</strong> tab.
        </div>
      )}

      <div className="sch-form-card">
        <div className="sch-form-title">
          <HiOutlineTruck className="sch-form-icon" />
          Schedule a New Delivery
        </div>

        {/* Row 1: From / To / Date / Duration */}
        <div className="sch-fields-grid">
          <div className="sch-field">
            <label className="sch-label">From (Origin)</label>
            <select
              className="sch-select"
              value={fromLocation}
              onChange={e => setFromLocation(e.target.value)}
            >
              {FROM_LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="sch-field">
            <label className="sch-label">To (Destination Site) <span className="sch-required">*</span></label>
            <select
              className="sch-select"
              value={selectedSite}
              onChange={e => setSelectedSite(e.target.value)}
            >
              <option value="">— Select a site —</option>
              {SITES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="sch-field">
            <label className="sch-label">Schedule Date <span className="sch-required">*</span></label>
            <input
              type="date"
              className="sch-input"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="sch-field">
            <label className="sch-label">Duration (days) <span className="sch-required">*</span></label>
            <input
              type="number"
              className="sch-input"
              min="1"
              max="90"
              placeholder="e.g. 3"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="sch-divider"><span>Materials</span></div>

        {/* Product search */}
        {selectedSite ? (
          <>
            <div className="sch-search-wrap">
              <div className="sch-search-box">
                <HiOutlineSearch className="sch-search-icon" />
                <input
                  type="text"
                  className="sch-search-input"
                  placeholder="Search material to add (e.g. Steel Bars, Cement…)"
                  value={prodSearch}
                  onChange={e => { setProdSearch(e.target.value); setShowDrop(true); }}
                  onFocus={() => setShowDrop(true)}
                  onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                />
                {prodSearch && (
                  <button className="sch-search-clear" onClick={() => setProdSearch('')}><HiX /></button>
                )}
              </div>

              {showDrop && prodSearch && (
                <div className="sch-prod-dropdown">
                  {filteredProds.length > 0
                    ? filteredProds.map(p => (
                      <div
                        key={p.name}
                        className="sch-prod-option"
                        onMouseDown={() => addProduct(p)}
                      >
                        <div className="sch-prod-opt-name">
                          <span className="sch-prod-sku">{skuForProduct(p.name)}</span>
                          {p.name}
                        </div>
                        <div className="sch-prod-opt-meta">
                          <span>{p.defaultUnit}</span>
                          <span className="sch-add-pill"><HiPlus /> Add</span>
                        </div>
                      </div>
                    ))
                    : <div className="sch-prod-option sch-prod-option--none">No matching materials found</div>
                  }
                </div>
              )}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 ? (
              <div className="sch-items-table-wrap">
                <table className="del-table sch-items-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Unit</th>
                      <th style={{ width: 120 }}>Quantity</th>
                      <th style={{ width: 48 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((it, i) => (
                      <tr key={i} className="sch-item-row">
                        <td className="del-sku-cell">{it.sku}</td>
                        <td className="sch-item-name">{it.product}</td>
                        <td>{it.unit}</td>
                        <td>
                          <input
                            type="number"
                            className="sch-qty-input"
                            min="1"
                            value={it.qty}
                            onChange={e => updateQty(i, e.target.value)}
                          />
                        </td>
                        <td>
                          <button className="sch-remove-btn" onClick={() => removeItem(i)} title="Remove">
                            <HiX />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sch-empty-materials">
                <HiPlus className="sch-empty-icon" />
                <p>Search and add materials above to include in this delivery</p>
              </div>
            )}
          </>
        ) : (
          <div className="sch-empty-materials sch-empty-site">
            <p>☝️ Select a destination site to start adding materials</p>
          </div>
        )}

        {/* SCHEDULE button */}
        <div className="sch-footer">
          <div className="sch-summary">
            {selectedItems.length > 0 && (
              <span className="sch-summary-text">
                {selectedItems.length} material{selectedItems.length !== 1 ? 's' : ''} selected for <strong>{selectedSite}</strong>
              </span>
            )}
          </div>
          <button
            className={`del-btn del-btn--schedule ${canSchedule ? '' : 'del-btn--disabled'}`}
            disabled={!canSchedule}
            onClick={handleSchedule}
          >
            <HiOutlineTruck /> SCHEDULE DELIVERY
          </button>
        </div>

      </div>
    </div>
  );
}
