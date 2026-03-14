import { useState, useMemo } from 'react';
import { HiOutlineSearch, HiPlus, HiOutlineEye, HiX, HiChevronDown } from 'react-icons/hi';
import { INITIAL_PROJECTS, nextProjectId } from '../data/projectsData';
import './Projects.css';

// ─── Status badge + inline dropdown (mirrors DeliveryTab) ─────────────────────

const SITE_STATUSES = ['On-going', 'Completed'];

function StatusBadge({ status }) {
  const cls = {
    'On-going': 'status-transit',
    'Completed': 'status-ready',
  }[status] || 'status-draft';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function StatusSelect({ siteId, currentStatus, openId, setOpenId, onUpdate }) {
  const isOpen = openId === siteId;
  return (
    <div className="proj-status-wrap">
      <button
        className="proj-status-trigger"
        onClick={e => { e.stopPropagation(); setOpenId(isOpen ? null : siteId); }}
      >
        <StatusBadge status={currentStatus} />
        <HiChevronDown className={`proj-status-caret ${isOpen ? 'proj-status-caret--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="proj-status-menu">
          {SITE_STATUSES.map(s => (
            <button
              key={s}
              className={`proj-status-option ${s === currentStatus ? 'proj-status-option--active' : ''}`}
              onClick={e => { e.stopPropagation(); onUpdate(siteId, s); setOpenId(null); }}
            >
              <StatusBadge status={s} />
              {s === currentStatus && <span className="proj-status-tick">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Add Site form Modal ───────────────────────────────────────────────────────
function AddSiteModal({ onClose, onSave }) {
    const [id] = useState(() => nextProjectId());
    const [form, setForm] = useState({ name: '', location: '', status: 'On-going' });
    const isSavable = form.name.trim() !== '' && form.location.trim() !== '';

    const handleSave = () => {
        if (!isSavable) return;
        onSave({
            id,
            name: form.name.trim(),
            location: form.location.trim(),
            status: form.status,
            lastDeliveryDate: '',
            lastDeliveredProducts: '',
            totalLifetimeDeliveries: {},
            deliveriesDetail: []
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="project-doc project-doc--form" onClick={e => e.stopPropagation()}>
                <div className="pdoc-header">
                    <div className="pdoc-header-left">
                        <h2 className="pdoc-title">Add New Site</h2>
                    </div>
                    <div className="pdoc-header-right">
                        <button className="btn btn-outline btn-sm" onClick={onClose}>
                            <HiX /> Cancel
                        </button>
                    </div>
                </div>
                <div className="pdoc-body">
                    <div className="pdoc-ref">{id}</div>
                    <div className="pdoc-fields" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="pdoc-field">
                            <label>Site Name *</label>
                            <input type="text" className="pdoc-input" placeholder="Enter site name"
                                value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus />
                        </div>
                        <div className="pdoc-field">
                            <label>Site Location *</label>
                            <input type="text" className="pdoc-input" placeholder="Enter complete location address"
                                value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                        </div>
                        <div className="pdoc-field">
                            <label>Initial Status</label>
                            <select className="pdoc-select" value={form.status}
                                onChange={e => setForm({...form, status: e.target.value})}>
                                <option value="On-going">On-going</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="pdoc-footer">
                    <button className="btn btn-outline" onClick={onClose}>Discard</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={!isSavable}>Add Site</button>
                </div>
            </div>
        </div>
    );
}

// ─── Project View Details Modal ───────────────────────────────────────────────
function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-doc" onClick={e => e.stopPropagation()}>
        <div className="pdoc-header">
          <div className="pdoc-header-left">
            <h2 className="pdoc-title">Project Details</h2>
          </div>
          <div className="pdoc-header-right">
            <button className="btn btn-outline btn-sm" onClick={onClose}><HiX /> Close</button>
          </div>
        </div>
        <div className="pdoc-body">
            <div className="pdoc-ref">{project.id} — {project.name}</div>
            <div className="pdoc-fields">
                <div className="pdoc-field">
                    <label>Location</label>
                    <div className="pdoc-field-val">{project.location}</div>
                </div>
                <div className="pdoc-field">
                    <label>Status</label>
                    <div className="pdoc-field-val">
                        <StatusBadge status={project.status} />
                    </div>
                </div>
            </div>

            {/* Lifetime Deliveries */}
            <div className="pdoc-items-section">
                <div className="pdoc-section-hd">Total Deliveries (Lifetime)</div>
                {Object.keys(project.totalLifetimeDeliveries).length === 0 ? (
                    <div className="empty-row" style={{padding: '1.5rem'}}>No lifetime items recorded yet.</div>
                ) : (
                    <div className="totals-grid">
                        {Object.entries(project.totalLifetimeDeliveries).map(([item, qty]) => (
                            <div key={item} className="total-item">
                                <span className="total-item-label">{item}</span>
                                <span className="total-item-val">{qty.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delivery History */}
            <div className="pdoc-items-section">
                <div className="pdoc-section-hd">Delivery History</div>
                {project.deliveriesDetail.length === 0 ? (
                    <div className="empty-row" style={{padding: '1.5rem'}}>No deliveries recorded yet.</div>
                ) : (
                    <table className="pdoc-table">
                        <thead><tr><th>Delivery Ref</th><th>Date</th><th>Items Delivered</th></tr></thead>
                        <tbody>
                            {project.deliveriesDetail.map(delivery => (
                                <tr key={delivery.id}>
                                    <td className="ref-cell">{delivery.id}</td>
                                    <td className="date-cell">{delivery.date}</td>
                                    <td>{delivery.items.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        <div className="pdoc-footer">
          <button className="btn btn-primary" onClick={onClose}>Close view</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Projects Page ───────────────────────────────────────────────────────
export default function Projects() {
  const [projectsData, setProjectsData] = useState(INITIAL_PROJECTS);
  const [activeTab, setActiveTab] = useState('On-going Sites');
  const [search, setSearch] = useState('');
  const [viewProject, setViewProject] = useState(null);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [openStatusId, setOpenStatusId] = useState(null);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(p => {
      const matchesTab = activeTab === 'On-going Sites' ? p.status === 'On-going' : p.status === 'Completed';
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [projectsData, activeTab, search]);

  const handleSaveNewSite = siteObj => {
    setProjectsData(prev => [siteObj, ...prev]);
    setActiveTab(siteObj.status === 'Completed' ? 'Completed Sites' : 'On-going Sites');
    setIsAddingSite(false);
  };

  const handleStatusUpdate = (siteId, newStatus) => {
    setProjectsData(prev =>
      prev.map(p => p.id === siteId ? { ...p, status: newStatus } : p)
    );
  };

  return (
    <div className="projects-page" onClick={() => setOpenStatusId(null)}>
      {/* Backdrop for status dropdown */}
      {openStatusId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpenStatusId(null)} />
      )}

      <div className="page-header">
        <h1>Projects / Sites</h1>
      </div>

      <div className="page-content">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 'On-going Sites' ? 'active' : ''}`} onClick={() => setActiveTab('On-going Sites')}>
            On-going Sites
          </button>
          <button className={`tab-btn ${activeTab === 'Completed Sites' ? 'active' : ''}`} onClick={() => setActiveTab('Completed Sites')}>
            Completed Sites
          </button>
        </div>

        <div className="tab-toolbar">
          <div className="search-box">
            <HiOutlineSearch />
            <input type="text" placeholder="Search by Site ID or Name..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={() => setIsAddingSite(true)}>
              <HiPlus /> Add Site
            </button>
          </div>
        </div>

        <div className="table-card">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Site ID</th>
                <th>Site Name</th>
                <th>Site Location</th>
                <th>Delivery (Date)</th>
                <th>Last Delivered Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr><td colSpan="7" className="empty-row">No {activeTab.toLowerCase()} found.</td></tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id} className="projects-row--click" onClick={() => setViewProject(project)}>
                    <td className="ref-cell">{project.id}</td>
                    <td className="name-cell">{project.name}</td>
                    <td>{project.location}</td>
                    <td className="date-cell">{project.lastDeliveryDate || '—'}</td>
                    <td>{project.lastDeliveredProducts || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <StatusSelect
                        siteId={project.id}
                        currentStatus={project.status}
                        openId={openStatusId}
                        setOpenId={setOpenStatusId}
                        onUpdate={handleStatusUpdate}
                      />
                    </td>
                    <td className="actions-cell" onClick={e => e.stopPropagation()}>
                      <button className="btn btn-outline btn-sm" title="View Details"
                        onClick={() => setViewProject(project)}>
                        <HiOutlineEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewProject && <ProjectDetailsModal project={viewProject} onClose={() => setViewProject(null)} />}
      {isAddingSite && <AddSiteModal onClose={() => setIsAddingSite(false)} onSave={handleSaveNewSite} />}
    </div>
  );
}
