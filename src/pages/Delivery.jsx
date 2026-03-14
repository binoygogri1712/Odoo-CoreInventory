import { useState } from 'react';
import { HiOutlineTruck, HiOutlineClipboardList, HiOutlineCalendar } from 'react-icons/hi';
import {
  INITIAL_DELIVERIES,
  INITIAL_REQUESTS,
  nextDeliveryId,
} from '../data/deliveryData';
import DeliveryTab  from '../components/delivery/DeliveryTab';
import RequestsTab  from '../components/delivery/RequestsTab';
import ScheduleTab  from '../components/delivery/ScheduleTab';
import './Delivery.css';

export default function Delivery() {
  const [activeTab,   setActiveTab]   = useState('delivery');
  const [deliveries,  setDeliveries]  = useState(INITIAL_DELIVERIES);
  const [requests,    setRequests]    = useState(INITIAL_REQUESTS);

  // Update delivery status
  const updateDeliveryStatus = (id, status) =>
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));

  // Approve selected items in a request
  const approveRequest = (reqId, checkedMap) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const updatedItems = r.items.map((it, i) => ({
        ...it,
        approved: it.approved || !!checkedMap[i],
      }));
      const allApproved  = updatedItems.every(it => it.approved);
      const someApproved = updatedItems.some(it => it.approved);
      const newStatus = allApproved ? 'Approved' : someApproved ? 'Partial' : 'Pending';
      return { ...r, items: updatedItems, status: newStatus };
    }));
  };

  // Create delivery from Schedule tab
  const scheduleDelivery = (delivery) => {
    const id = nextDeliveryId();
    setDeliveries(prev => [{ ...delivery, id }, ...prev]);
    setActiveTab('delivery');
  };

  const pendingCount = requests.filter(r => r.status !== 'Approved').length;

  return (
    <div className="delivery-page">
      {/* ── Sub-tab bar ── */}
      <div className="del-tabs">
        <button
          className={`del-tab-btn ${activeTab === 'delivery' ? 'del-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          <HiOutlineTruck className="del-tab-icon" />
          Delivery
          <span className="del-tab-badge">{deliveries.length}</span>
        </button>
        <button
          className={`del-tab-btn ${activeTab === 'requests' ? 'del-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <HiOutlineClipboardList className="del-tab-icon" />
          Requests
          {pendingCount > 0 && (
            <span className="del-tab-badge del-tab-badge--alert">{pendingCount}</span>
          )}
        </button>
        <button
          className={`del-tab-btn ${activeTab === 'schedule' ? 'del-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <HiOutlineCalendar className="del-tab-icon" />
          Schedule
        </button>
      </div>

      {/* ── Tab content ── */}
      <div className="del-content">
        {activeTab === 'delivery' && (
          <DeliveryTab
            deliveries={deliveries}
            onUpdateStatus={updateDeliveryStatus}
          />
        )}
        {activeTab === 'requests' && (
          <RequestsTab
            requests={requests}
            onApprove={approveRequest}
          />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab onSchedule={scheduleDelivery} />
        )}
      </div>
    </div>
  );
}
