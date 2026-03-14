export const INITIAL_PROJECTS = [
  {
    id: 'PRJ-2026-001',
    name: 'Downtown Commercial Complex',
    location: '124 Main St, City Center',
    status: 'On-going',
    lastDeliveryDate: '2026-03-12',
    lastDeliveredProducts: 'Cement (200 bags), Steel (5 tons)',
    totalLifetimeDeliveries: {
      'Cement (bags)': 1500,
      'Steel (tons)': 45,
      'Concrete (m3)': 300,
    },
    deliveriesDetail: [
      { id: 'DEL-001', date: '2026-03-12', items: [{ name: 'Cement', qty: 200, unit: 'bags' }, { name: 'Steel', qty: 5, unit: 'tons' }] },
      { id: 'DEL-002', date: '2026-03-01', items: [{ name: 'Concrete', qty: 50, unit: 'm3' }] },
      { id: 'DEL-003', date: '2026-02-15', items: [{ name: 'Cement', qty: 1300, unit: 'bags' }, { name: 'Steel', qty: 40, unit: 'tons' }, { name: 'Concrete', qty: 250, unit: 'm3' }] },
    ]
  },
  {
    id: 'PRJ-2026-002',
    name: 'Riverside Residential Phase I',
    location: '45 River Road, North District',
    status: 'On-going',
    lastDeliveryDate: '2026-03-14',
    lastDeliveredProducts: 'Bricks (5000 units), Sand (10 tons)',
    totalLifetimeDeliveries: {
      'Bricks': 25000,
      'Sand (tons)': 50,
      'Cement (bags)': 800,
      'Concrete (m3)': 120,
    },
    deliveriesDetail: [
      { id: 'DEL-004', date: '2026-03-14', items: [{ name: 'Bricks', qty: 5000, unit: 'units' }, { name: 'Sand', qty: 10, unit: 'tons' }] },
      { id: 'DEL-005', date: '2026-03-05', items: [{ name: 'Cement', qty: 300, unit: 'bags' }, { name: 'Concrete', qty: 60, unit: 'm3' }] },
      { id: 'DEL-006', date: '2026-02-28', items: [{ name: 'Bricks', qty: 20000, unit: 'units' }, { name: 'Sand', qty: 40, unit: 'tons' }] },
      { id: 'DEL-007', date: '2026-02-10', items: [{ name: 'Cement', qty: 500, unit: 'bags' }, { name: 'Concrete', qty: 60, unit: 'm3' }] },
    ]
  },
  {
    id: 'PRJ-2025-089',
    name: 'Tech Park Plaza',
    location: '900 Innovation Way, South District',
    status: 'Completed',
    lastDeliveryDate: '2025-11-20',
    lastDeliveredProducts: 'Glass Panels (100 sqm)',
    totalLifetimeDeliveries: {
      'Cement (bags)': 5000,
      'Steel (tons)': 120,
      'Concrete (m3)': 800,
      'Glass Panels (sqm)': 500,
    },
    deliveriesDetail: [
      { id: 'DEL-008', date: '2025-11-20', items: [{ name: 'Glass Panels', qty: 100, unit: 'sqm' }] },
      { id: 'DEL-011', date: '2025-05-10', items: [{ name: 'Cement', qty: 5000, unit: 'bags' }, { name: 'Steel', qty: 120, unit: 'tons' }, { name: 'Concrete', qty: 800, unit: 'm3' }] },
    ]
  }
];

let projectCounter = 3;
export const nextProjectId = () => {
  projectCounter++;
  return `PRJ-2026-${String(projectCounter).padStart(3, '0')}`;
};
