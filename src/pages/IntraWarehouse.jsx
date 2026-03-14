import { useState } from 'react';
import { INITIAL_TRANSFERS, INITIAL_WAREHOUSES } from '../data/intraWarehouseData';
import TransfersTab from '../components/intra/TransfersTab';
import './IntraWarehouse.css';

export default function IntraWarehouse() {
  const [transfers,  setTransfers]  = useState(INITIAL_TRANSFERS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);

  const addTransfer          = (t)           => setTransfers(prev => [t, ...prev]);
  const updateTransferStatus = (id, status)  =>
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  return (
    <div className="intra-page">
      <TransfersTab
        transfers={transfers}
        warehouses={warehouses}
        onAddTransfer={addTransfer}
        onUpdateStatus={updateTransferStatus}
      />
    </div>
  );
}
