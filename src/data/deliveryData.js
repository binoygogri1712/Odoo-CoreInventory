// ─── Re-export shared catalogue ──────────────────────────────────────────────
export { PRODUCTS, UNITS } from './procurementData';

// ─── Sites ────────────────────────────────────────────────────────────────────
export const SITES = ['Site A', 'Site B', 'Site C', 'Site D', 'Site E'];
export const FROM_LOCATIONS = ['Main Warehouse', 'Store Room 1', 'Store Room 2'];

// ─── ID generator ─────────────────────────────────────────────────────────────
let _delivIdx = 3;
export function nextDeliveryId() {
  _delivIdx++;
  return `WH/DEL/${String(_delivIdx).padStart(4, '0')}`;
}

let _reqIdx = 3;
export function nextRequestId() {
  _reqIdx++;
  return `REQ/${String(_reqIdx).padStart(4, '0')}`;
}

// ─── Helper: SKU from product name ────────────────────────────────────────────
import { PRODUCTS } from './procurementData';

export function skuForProduct(productName) {
  const idx = PRODUCTS.findIndex(p => p.name === productName);
  return idx >= 0 ? `SKU-${String(idx + 1).padStart(3, '0')}` : 'SKU-???';
}

// ─── Seed Deliveries ──────────────────────────────────────────────────────────
export const INITIAL_DELIVERIES = [
  {
    id: 'WH/DEL/0001',
    orderDate: '2026-03-05',
    scheduledDate: '2026-03-12',
    from: 'Main Warehouse',
    to: 'Site A',
    status: 'Delivered',
    duration: 7,
    items: [
      { product: 'Steel Bars',   sku: 'SKU-001', qty: 20,  unit: 'tons' },
      { product: 'TMT Rods',     sku: 'SKU-005', qty: 500, unit: 'kg'   },
    ],
  },
  {
    id: 'WH/DEL/0002',
    orderDate: '2026-03-08',
    scheduledDate: '2026-03-16',
    from: 'Main Warehouse',
    to: 'Site B',
    status: 'In Transit',
    duration: 8,
    items: [
      { product: 'Cement (OPC 53)', sku: 'SKU-003', qty: 50,  unit: 'bags' },
      { product: 'River Sand',      sku: 'SKU-002', qty: 100, unit: 'bags' },
    ],
  },
  {
    id: 'WH/DEL/0003',
    orderDate: '2026-03-10',
    scheduledDate: '2026-03-18',
    from: 'Store Room 1',
    to: 'Site C',
    status: 'In Transit',
    duration: 8,
    items: [
      { product: 'PVC Pipes', sku: 'SKU-008', qty: 30, unit: 'pcs' },
    ],
  },
];

// ─── Seed Requests ────────────────────────────────────────────────────────────
export const INITIAL_REQUESTS = [
  {
    id: 'REQ/0001',
    site: 'Site A',
    requestDate: '2026-03-09',
    status: 'Pending',
    items: [
      { product: 'Bricks (Red Clay)', sku: 'SKU-004', qty: 2000, unit: 'pcs',    approved: false },
      { product: 'Coarse Aggregate',  sku: 'SKU-006', qty: 10,   unit: 'tons',   approved: false },
      { product: 'River Sand',        sku: 'SKU-002', qty: 50,   unit: 'bags',   approved: false },
    ],
  },
  {
    id: 'REQ/0002',
    site: 'Site B',
    requestDate: '2026-03-11',
    status: 'Pending',
    items: [
      { product: 'Electrical Wire', sku: 'SKU-009', qty: 200, unit: 'meters', approved: false },
      { product: 'PVC Pipes',       sku: 'SKU-008', qty: 15,  unit: 'pcs',   approved: false },
    ],
  },
  {
    id: 'REQ/0003',
    site: 'Site C',
    requestDate: '2026-03-12',
    status: 'Approved',
    items: [
      { product: 'Plywood Sheets',   sku: 'SKU-007', qty: 40, unit: 'sheets', approved: true },
      { product: 'Paint (Exterior)', sku: 'SKU-010', qty: 20, unit: 'liters', approved: true },
    ],
  },
];
