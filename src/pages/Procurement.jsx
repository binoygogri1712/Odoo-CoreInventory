import { useState } from 'react';
import { INITIAL_ORDERS, INITIAL_RECEIPTS, INITIAL_VENDORS } from '../data/procurementData';
import OrdersTab   from '../components/procurement/OrdersTab';
import ReceiptsTab from '../components/procurement/ReceiptsTab';
import './Procurement.css';

export default function Procurement() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders,    setOrders]    = useState(INITIAL_ORDERS);
  const [receipts,  setReceipts]  = useState(INITIAL_RECEIPTS);
  const [vendors,   setVendors]   = useState(INITIAL_VENDORS);

  const addOrder         = (o)           => setOrders(prev => [o, ...prev]);
  const addReceipt       = (r)           => setReceipts(prev => [r, ...prev]);
  const addVendor        = (v)           => setVendors(prev => [...prev, v]);
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div className="procurement-page">
      {/* ── Internal sub-tab bar ── */}
      <div className="proc-tabs">
        <button
          className={`proc-tab ${activeTab === 'orders' ? 'proc-tab--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
          <span className="proc-tab-badge">{orders.length}</span>
        </button>
        <button
          className={`proc-tab ${activeTab === 'receipts' ? 'proc-tab--active' : ''}`}
          onClick={() => setActiveTab('receipts')}
        >
          Receipts
          <span className="proc-tab-badge">{receipts.length}</span>
        </button>
      </div>

      {/* ── Tab content ── */}
      <div className="proc-content">
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            vendors={vendors}
            onAddOrder={addOrder}
            onAddReceipt={addReceipt}
            onAddVendor={addVendor}
            onUpdateStatus={updateOrderStatus}
          />
        )}
        {activeTab === 'receipts' && (
          <ReceiptsTab
            receipts={receipts}
            onAddReceipt={addReceipt}
            onAddOrder={addOrder}
          />
        )}
      </div>
    </div>
  );
}
