// ─── Products catalogue ─────────────────────────────────────────────────────
export const PRODUCTS = [
  { name: 'Steel Bars',        defaultUnit: 'tons',   basePrice: 900  },
  { name: 'River Sand',        defaultUnit: 'bags',   basePrice: 40   },
  { name: 'Cement (OPC 53)',   defaultUnit: 'bags',   basePrice: 75   },
  { name: 'Bricks (Red Clay)', defaultUnit: 'pcs',    basePrice: 8    },
  { name: 'TMT Rods',          defaultUnit: 'kg',     basePrice: 65   },
  { name: 'Coarse Aggregate',  defaultUnit: 'tons',   basePrice: 1200 },
  { name: 'Plywood Sheets',    defaultUnit: 'sheets', basePrice: 850  },
  { name: 'PVC Pipes',         defaultUnit: 'pcs',    basePrice: 320  },
  { name: 'Electrical Wire',   defaultUnit: 'meters', basePrice: 45   },
  { name: 'Paint (Exterior)',  defaultUnit: 'liters', basePrice: 180  },
];

export const UNITS = ['tons', 'kg', 'bags', 'pcs', 'liters', 'meters', 'sheets', 'boxes', 'rolls'];

// ─── Vendors ─────────────────────────────────────────────────────────────────
export const INITIAL_VENDORS = [
  { id: 'V001', name: 'BuildMart Supplies',      location: 'Mumbai',    reliability: 4.5, priceNote: 'Standard market rates'  },
  { id: 'V002', name: 'Steel Zone India',         location: 'Pune',      reliability: 4.2, priceNote: '5% below market price'  },
  { id: 'V003', name: 'SandCraft Materials',      location: 'Nashik',    reliability: 3.8, priceNote: 'Competitive pricing'    },
  { id: 'V004', name: 'CementPro Distributors',   location: 'Surat',     reliability: 4.7, priceNote: 'Best pricing in region' },
  { id: 'V005', name: 'National Const. Supplies', location: 'Delhi',     reliability: 4.0, priceNote: 'Bulk order discounts'   },
  { id: 'V006', name: 'UrbanBuild Traders',       location: 'Bangalore', reliability: 4.3, priceNote: 'Premium quality stock'  },
];

// ─── ID generators (module-level counters) ───────────────────────────────────
let _orderIdx   = 3;
let _receiptIdx = 3;

export function nextOrderId() {
  _orderIdx++;
  return `WH/IN/${String(_orderIdx).padStart(4, '0')}`;
}
export function nextReceiptId() {
  _receiptIdx++;
  return `RCP/${String(_receiptIdx).padStart(4, '0')}`;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
export const INITIAL_ORDERS = [
  {
    id: 'WH/IN/0001', product: 'Steel Bars',     sku: '',
    quantity: 50,  unit: 'tons',  pricePerUnit: 900,  totalPrice: 45000,
    vendor: 'BuildMart Supplies',      status: 'Ordered',   date: '2026-03-05',
  },
  {
    id: 'WH/IN/0002', product: 'River Sand',      sku: '',
    quantity: 200, unit: 'bags',  pricePerUnit: 40,   totalPrice: 8000,
    vendor: 'SandCraft Materials',     status: 'In Transit', date: '2026-03-08',
  },
  {
    id: 'WH/IN/0003', product: 'Cement (OPC 53)', sku: '',
    quantity: 100, unit: 'bags',  pricePerUnit: 75,   totalPrice: 7500,
    vendor: 'CementPro Distributors',  status: 'Delivered', date: '2026-03-10',
  },
];

export const INITIAL_RECEIPTS = [
  {
    id: 'RCP/0001', orderId: 'WH/IN/0001',
    receiveFrom: 'BuildMart Supplies',   product: 'Steel Bars',
    quantity: 50,  unit: 'tons',  pricePerUnit: 900, totalPrice: 45000,
    responsible: 'Inventory Mgr', scheduleDate: '2026-03-15', status: 'Ready', date: '2026-03-05',
  },
  {
    id: 'RCP/0002', orderId: 'WH/IN/0002',
    receiveFrom: 'SandCraft Materials',  product: 'River Sand',
    quantity: 200, unit: 'bags',  pricePerUnit: 40,  totalPrice: 8000,
    responsible: 'Inventory Mgr', scheduleDate: '2026-03-18', status: 'Draft',  date: '2026-03-08',
  },
  {
    id: 'RCP/0003', orderId: 'WH/IN/0003',
    receiveFrom: 'CementPro Distributors', product: 'Cement (OPC 53)',
    quantity: 100, unit: 'bags',  pricePerUnit: 75,  totalPrice: 7500,
    responsible: 'Inventory Mgr', scheduleDate: '2026-03-17', status: 'Done',   date: '2026-03-10',
  },
];
