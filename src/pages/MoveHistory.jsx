import { useState } from 'react';
import { HiOutlineSwitchHorizontal, HiOutlineTruck } from 'react-icons/hi';
import { INITIAL_TRANSFERS } from '../data/intraWarehouseData';
import { INITIAL_DELIVERIES } from '../data/deliveryData';
import IntraHistoryTab    from '../components/movehistory/IntraHistoryTab';
import DeliveryHistoryTab from '../components/movehistory/DeliveryHistoryTab';
import './MoveHistory.css';

export default function MoveHistory() {
  const [activeTab, setActiveTab] = useState('intra');

  const transfers  = INITIAL_TRANSFERS;
  const deliveries = INITIAL_DELIVERIES;

  const intraCount    = transfers.filter(t  => t.status === 'Done').length;
  const deliveryCount = deliveries.filter(d => d.status === 'Delivered').length;

  return (
    <div className="mh-page">

      {/* Page header */}
      <div className="mh-page-header">
        <div>
          <h1 className="mh-page-title">Move History</h1>
          <p className="mh-page-sub">Completed transfers and deliveries</p>
        </div>
        <div className="mh-summary-pills">
          <div className="mh-summary-pill mh-summary-pill--intra">
            <HiOutlineSwitchHorizontal />
            <span>{intraCount} Intra-Warehouse</span>
          </div>
          <div className="mh-summary-pill mh-summary-pill--delivery">
            <HiOutlineTruck />
            <span>{deliveryCount} Site Deliveries</span>
          </div>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="mh-tabs">
        <button
          className={`mh-tab-btn ${activeTab === 'intra' ? 'mh-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('intra')}
        >
          <HiOutlineSwitchHorizontal className="mh-tab-icon" />
          Intra-Warehouse Transfers
          <span className="mh-tab-badge">{intraCount}</span>
        </button>
        <button
          className={`mh-tab-btn ${activeTab === 'delivery' ? 'mh-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          <HiOutlineTruck className="mh-tab-icon" />
          Warehouse → Site Deliveries
          <span className="mh-tab-badge">{deliveryCount}</span>
        </button>
      </div>

      {/* Tab content */}
      <div className="mh-content">
        {activeTab === 'intra' && (
          <IntraHistoryTab transfers={transfers} />
        )}
        {activeTab === 'delivery' && (
          <DeliveryHistoryTab deliveries={deliveries} />
        )}
      </div>

    </div>
  );
}
