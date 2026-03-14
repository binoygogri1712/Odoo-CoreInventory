// ─── Re-export shared catalogue ──────────────────────────────────────────────
export { PRODUCTS, UNITS } from './procurementData';

// ─── Warehouses ───────────────────────────────────────────────────────────────
export const INITIAL_WAREHOUSES = [
  { id: 'WH01', name: 'Main Warehouse', location: 'Mumbai',  capacity: 10000 },
  { id: 'WH02', name: 'Store Room 1',   location: 'Pune',    capacity: 5000  },
  { id: 'WH03', name: 'Store Room 2',   location: 'Nashik',  capacity: 5000  },
  { id: 'WH04', name: 'Site Storage A', location: 'Surat',   capacity: 3000  },
];

// ─── ID generators ────────────────────────────────────────────────────────────
let _trfIdx = 3;
export function nextTransferId() {
  _trfIdx++;
  return `WH/TRF/${String(_trfIdx).padStart(4, '0')}`;
}

let _whIdx = 4;
export function nextWarehouseId() {
  _whIdx++;
  return `WH${String(_whIdx).padStart(2, '0')}`;
}

// ─── Helper: SKU from product name ────────────────────────────────────────────
import { PRODUCTS } from './procurementData';
export function skuForProduct(productName) {
  const idx = PRODUCTS.findIndex(p => p.name === productName);
  return idx >= 0 ? `SKU-${String(idx + 1).padStart(3, '0')}` : 'SKU-???';
}

// ─── Seed Transfers ───────────────────────────────────────────────────────────
export const INITIAL_TRANSFERS = [
  {
    id: 'WH/TRF/0001',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Store Room 1',
    requestDate: '2026-03-05',
    scheduleDate: '2026-03-07',
    status: 'Done',
    responsible: 'Inventory Mgr',
    note: 'Monthly stock replenishment',
    items: [
      { product: 'Steel Bars', sku: 'SKU-001', qty: 10, unit: 'tons' },
      { product: 'TMT Rods',   sku: 'SKU-005', qty: 200, unit: 'kg' },
    ],
  },
  {
    id: 'WH/TRF/0002',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Store Room 2',
    requestDate: '2026-03-09',
    scheduleDate: '2026-03-11',
    status: 'In Transit',
    responsible: 'Inventory Mgr',
    note: '',
    items: [
      { product: 'Cement (OPC 53)', sku: 'SKU-003', qty: 50,  unit: 'bags' },
      { product: 'River Sand',      sku: 'SKU-002', qty: 100, unit: 'bags' },
    ],
  },
  {
    id: 'WH/TRF/0003',
    fromWarehouse: 'Store Room 1',
    toWarehouse: 'Site Storage A',
    requestDate: '2026-03-12',
    scheduleDate: '2026-03-14',
    status: 'Ready',
    responsible: 'Inventory Mgr',
    note: 'Urgent — site needs materials',
    items: [
      { product: 'PVC Pipes', sku: 'SKU-008', qty: 15, unit: 'pcs' },
    ],
  },
];
