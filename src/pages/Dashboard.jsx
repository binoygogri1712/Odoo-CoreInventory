import {
  HiOutlineCube,
  HiOutlineExclamation,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineSwitchHorizontal,
} from 'react-icons/hi';
import KPICard from '../components/KPICard';
import OperationCard from '../components/OperationCard';
import ActivityTable from '../components/ActivityTable';
import './Dashboard.css';

/* ===== MOCK DATA ===== */
const kpiData = [
  {
    icon: HiOutlineCube,
    title: 'Total Products',
    value: 1247,
    trend: 12,
    trendLabel: 'vs last month',
    gradient: 'var(--gradient-purple)',
  },
  {
    icon: HiOutlineExclamation,
    title: 'Low Stock Items',
    value: 23,
    trend: -8,
    trendLabel: '3 out of stock',
    gradient: 'var(--gradient-orange)',
  },
  {
    icon: HiOutlineClipboardList,
    title: 'Pending Receipts',
    value: 18,
    trend: 5,
    trendLabel: '2 arriving today',
    gradient: 'var(--gradient-blue)',
  },
  {
    icon: HiOutlineTruck,
    title: 'Pending Deliveries',
    value: 34,
    trend: -3,
    trendLabel: '5 shipping today',
    gradient: 'var(--gradient-pink)',
  },
  {
    icon: HiOutlineSwitchHorizontal,
    title: 'Internal Transfers',
    value: 7,
    trend: 0,
    trendLabel: '2 scheduled',
    gradient: 'var(--gradient-green)',
  },
];

const receiptStats = [
  { label: 'Late', value: 1, color: 'var(--status-late)' },
  { label: 'Waiting', value: 2, color: 'var(--status-waiting)' },
  { label: 'Ready', value: 3, color: 'var(--status-ready)' },
  { label: 'Draft', value: 2, color: 'var(--status-draft)' },
];

const deliveryStats = [
  { label: 'Late', value: 1, color: 'var(--status-late)' },
  { label: 'Waiting', value: 2, color: 'var(--status-waiting)' },
  { label: 'To Deliver', value: 4, color: 'var(--status-done)' },
  { label: 'Draft', value: 1, color: 'var(--status-draft)' },
];

const activityData = [
  {
    reference: 'WH/IN/00042',
    date: '14 Mar 2026',
    product: 'Steel Rods (10mm)',
    from: 'Vendor: ArcelorMittal',
    to: 'Main Warehouse',
    qty: 100,
    qtyType: 'in',
    status: 'Done',
  },
  {
    reference: 'WH/OUT/00118',
    date: '14 Mar 2026',
    product: 'Office Chairs',
    from: 'Main Warehouse',
    to: 'Customer: TechCorp',
    qty: 10,
    qtyType: 'out',
    status: 'Ready',
  },
  {
    reference: 'WH/INT/00015',
    date: '13 Mar 2026',
    product: 'Steel Rods (10mm)',
    from: 'Main Store',
    to: 'Production Rack',
    qty: 50,
    qtyType: '',
    status: 'Done',
  },
  {
    reference: 'WH/IN/00041',
    date: '13 Mar 2026',
    product: 'LED Monitors 27"',
    from: 'Vendor: Samsung',
    to: 'Electronics Bay',
    qty: 25,
    qtyType: 'in',
    status: 'Waiting',
  },
  {
    reference: 'WH/OUT/00117',
    date: '12 Mar 2026',
    product: 'Standing Desks',
    from: 'Warehouse 2',
    to: 'Customer: Azure Int.',
    qty: 5,
    qtyType: 'out',
    status: 'Late',
  },
  {
    reference: 'WH/ADJ/00009',
    date: '12 Mar 2026',
    product: 'Steel Rods (10mm)',
    from: 'Production Rack',
    to: '— (Damaged)',
    qty: 3,
    qtyType: 'out',
    status: 'Done',
  },
];

/* ===== DASHBOARD COMPONENT ===== */
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('traceflow_user') || sessionStorage.getItem('traceflow_user') || '{}');
  const userName = user?.login_id || 'Inventory Manager';
  const userRole = user?.role || 'staff';

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dashboard__welcome animate-slide-in">
        <div className="dashboard__welcome-content">
          <h2 className="dashboard__welcome-title">
            Good {getGreeting()}, <span>{userName}</span> 👋
          </h2>
          <p className="dashboard__welcome-text">
            Here's your inventory snapshot for today. You have <strong>3 pending receipts</strong> and <strong>5 deliveries</strong> to process.
          </p>
        </div>
        <div className="dashboard__welcome-graphic">
          <div className="dashboard__welcome-circle"></div>
          <div className="dashboard__welcome-circle dashboard__welcome-circle--2"></div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard__kpi-grid">
        {kpiData.map((kpi, i) => (
          <KPICard key={i} {...kpi} delay={i * 80} />
        ))}
      </div>

      {/* Admin-only: Operation Summary Cards */}
      {userRole === 'admin' && (
        <>
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Operations Overview</h2>
            <div className="dashboard__filters">
              <button className="dashboard__filter-btn dashboard__filter-btn--active">All</button>
              <button className="dashboard__filter-btn">Today</button>
              <button className="dashboard__filter-btn">This Week</button>
            </div>
          </div>

          <div className="dashboard__ops-grid">
            <OperationCard
              title="Procurement"
              icon={HiOutlineClipboardList}
              stats={receiptStats}
              total={8}
              path="/procurement"
              gradient="var(--gradient-blue)"
              delay={100}
            />
            <OperationCard
              title="Delivery"
              icon={HiOutlineTruck}
              stats={deliveryStats}
              total={8}
              path="/delivery"
              gradient="var(--gradient-pink)"
              delay={180}
            />
          </div>
        </>
      )}

      {/* Staff-only: Info banner */}
      {userRole === 'staff' && (
        <div className="dashboard__staff-notice" style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '14px',
          padding: '20px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
        }}>
          <HiOutlineClipboardList style={{ fontSize: '1.6rem', color: 'var(--primary)', flexShrink: 0 }} />
          <span>You are logged in as <strong>Staff</strong>. You can view products, deliveries, and projects. Request approval features are managed by admins.</span>
        </div>
      )}

      {/* Recent Activity */}
      <ActivityTable data={activityData} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
