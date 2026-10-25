import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Store,
  Scissors,
  Package,
  Calendar,
  AlertCircle,
  DollarSign,
  Check,
  X,
  Trash2,
  CheckCircle,
  Eye,
  Edit,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('approvals');
  const [loading, setLoading] = useState(true);

  // Data lists
  const [pendingVendors, setPendingVendors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);

  // Resolve complaint modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('Resolved');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/pending-vendors'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingVendors(pendingRes.data.vendors);

      // Fetch tab-specific data on demand or eagerly
      const [usersRes, prodsRes, ordsRes, bksRes, cmpsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/products?limit=100'),
        api.get('/admin/orders'),
        api.get('/admin/bookings'),
        api.get('/complaints/admin/all'),
      ]);

      if (usersRes.data.success) setAllUsers(usersRes.data.users);
      if (prodsRes.data.success) setAllProducts(prodsRes.data.products);
      if (ordsRes.data.success) setAllOrders(ordsRes.data.orders);
      if (bksRes.data.success) setAllBookings(bksRes.data.bookings);
      if (cmpsRes.data.success) setAllComplaints(cmpsRes.data.complaints);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
      showToast('Error loading administrative data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Vendor Approval / Rejection
  const handleVendorStatusUpdate = async (vendorId, status) => {
    try {
      const res = await api.put(`/admin/vendors/${vendorId}/status`, { status });
      if (res.data.success) {
        showToast(`Vendor registration ${status}!`, 'success');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update vendor status', 'error');
    }
  };

  // Toggle User Active Status
  const handleToggleUserActive = async (targetUser) => {
    try {
      const res = await api.put(`/admin/users/${targetUser._id}`, {
        isActive: !targetUser.isActive,
      });
      if (res.data.success) {
        showToast(
          `User account ${targetUser.isActive ? 'deactivated' : 'activated'}`,
          'info'
        );
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  // Delete product listing
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product listing from marketplace?')) return;
    try {
      const res = await api.delete(`/products/${productId}`);
      if (res.data.success) {
        showToast('Product listing removed by admin', 'info');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  // Resolve Complaint
  const handleResolveComplaint = async (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    try {
      const res = await api.put(`/complaints/${activeComplaint._id}/resolve`, {
        status: complaintStatus,
        resolution: resolutionText,
      });
      if (res.data.success) {
        showToast('Complaint ticket updated successfully', 'success');
        setResolveModalOpen(false);
        setActiveComplaint(null);
        setResolutionText('');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resolve ticket', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>You must be authenticated as an Administrator to view this console.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="dropdown-user-role role-admin">System Administrator</span>
              <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>● Full Privilege Console</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)' }}>
              Urbano Marketplace Control Center
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                <Users size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                <Store size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalProducts}</div>
                <div className="stat-label">Listed Botanicals</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                <Package size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalOrders}</div>
                <div className="stat-label">Customer Orders</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
                <Calendar size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalBookings}</div>
                <div className="stat-label">Service Bookings</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)' }}>
                <DollarSign size={26} />
              </div>
              <div>
                <div className="stat-val">₹{stats.totalRevenue}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <div className="stat-card" style={{ borderColor: stats.pendingApprovalsCount > 0 ? '#f59e0b' : 'var(--border-subtle)' }}>
              <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.pendingApprovalsCount}</div>
                <div className="stat-label">Pending Approvals</div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            Vendor Approvals ({pendingVendors.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Accounts ({allUsers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products ({allProducts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({allOrders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({allBookings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            Disputes & Complaints ({allComplaints.length})
          </button>
        </div>

        {/* 1. Vendor Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor / Gardener</th>
                  <th>Role</th>
                  <th>Profile Details</th>
                  <th>Registration Date</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No pending vendor or gardener registrations. All accounts are up-to-date!
                    </td>
                  </tr>
                ) : (
                  pendingVendors.map((v) => (
                    <tr key={v._id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{v.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                      </td>
                      <td>
                        <span className={`dropdown-user-role role-${v.role}`}>
                          {v.role}
                        </span>
                      </td>
                      <td>
                        {v.role === 'nursery' ? (
                          <div>
                            <strong>{v.nurseryProfile?.nurseryName}</strong>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              City: {v.nurseryProfile?.city || 'Bengaluru'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>{v.gardenerProfile?.experienceYears || 3} Yrs Experience</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              Fee: ₹{v.gardenerProfile?.hourlyRate || 400}/hr
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`status-pill status-${v.vendorStatus}`}>
                          {v.vendorStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            onClick={() => handleVendorStatusUpdate(v._id, 'approved')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', backgroundColor: '#16a34a' }}
                            title="Approve registration"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleVendorStatusUpdate(v._id, 'rejected')}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.3rem 0.65rem' }}
                            title="Reject registration"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Users Management Tab */}
        {activeTab === 'users' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Account Status</th>
                  <th>Toggle Status</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`dropdown-user-role role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.address?.city || '—'}</td>
                    <td>
                      <span className={`status-pill ${u.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleToggleUserActive(u)}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Products Management Tab */}
        {activeTab === 'products' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.botanicalName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || 'Category'}</td>
                    <td><strong>₹{p.price}</strong></td>
                    <td>{p.stock} units</td>
                    <td>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.55rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Orders Monitoring Tab */}
        {activeTab === 'orders' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td>
                      <strong>#{ord.orderNumber}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td>
                      <div>{ord.customer?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.customer?.email}</div>
                    </td>
                    <td><strong style={{ color: 'var(--primary-900)' }}>₹{ord.totalAmount}</strong></td>
                    <td>{ord.paymentMethod} ({ord.paymentStatus})</td>
                    <td>
                      <span className={`status-pill status-${ord.orderStatus.toLowerCase()}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Service Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Gardener</th>
                  <th>Date & Time Slot</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((bk) => (
                  <tr key={bk._id}>
                    <td><strong>{bk.service?.name}</strong></td>
                    <td>{bk.customer?.name}</td>
                    <td>{bk.gardener?.name}</td>
                    <td>
                      <div>{new Date(bk.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{bk.timeSlot}</div>
                    </td>
                    <td><strong>₹{bk.price}</strong></td>
                    <td>
                      <span className={`status-pill status-${bk.status.toLowerCase().replace(' ', '')}`}>
                        {bk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Disputes & Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>User</th>
                  <th>Subject & Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No filed complaints or disputes across platform.
                    </td>
                  </tr>
                ) : (
                  allComplaints.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <strong>{c.type}</strong>
                        {c.referenceId && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ref: #{c.referenceId}</div>}
                      </td>
                      <td>
                        <div>{c.user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.user?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.subject}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 300 }}>
                          {c.description}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill status-${c.status.toLowerCase().replace('-', '')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setActiveComplaint(c);
                            setResolutionText(c.resolution || '');
                            setComplaintStatus(c.status);
                            setResolveModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Resolve Ticket Modal */}
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title={`Resolve Dispute Ticket: ${activeComplaint?.subject}`}
        >
          <form onSubmit={handleResolveComplaint}>
            <div className="form-group">
              <label className="form-label">Ticket Status</label>
              <select
                className="form-control"
                value={complaintStatus}
                onChange={(e) => setComplaintStatus(e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In-Review">In-Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution / Customer Reply</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="State replacement details, order refund notes, or steps taken..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setResolveModalOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Resolution
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
