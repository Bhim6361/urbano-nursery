import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, MapPin, User } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const GardenerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    completedCount: 0,
    activeCount: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchGardenerBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/gardener/incoming');
      if (res.data.success) {
        setBookings(res.data.bookings);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching gardener bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardenerBookings();
  }, []);

  // Check if gardener is still pending approval
  if (user?.role === 'gardener' && user?.vendorStatus === 'pending') {
    return (
      <div className="container" style={{ padding: '6rem 0', maxWidth: 650, textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Clock size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-900)', marginBottom: '0.6rem' }}>
            Gardener Profile Pending Approval
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Welcome, <strong>{user?.name}</strong>! Your specialist profile has been submitted and is currently undergoing verification by our administration team.
          </p>
          <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: 8, fontSize: '0.88rem', color: 'var(--primary-900)' }}>
            🌱 Tip: If you are testing the platform, log in as Administrator (<code>admin@urbanonursery.com</code>) to approve your gardener registration in the Admin Dashboard!
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Appointment status updated to ${newStatus}`, 'success');
        fetchGardenerBookings();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update booking status', 'error');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="dropdown-user-role role-gardener">Verified Gardener</span>
              <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>● Available for Bookings</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)' }}>
              Gardener Specialist Dashboard
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
              <Calendar size={26} />
            </div>
            <div>
              <div className="stat-val">{summary.totalBookings}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Clock size={26} />
            </div>
            <div>
              <div className="stat-val">{summary.activeCount}</div>
              <div className="stat-label">Active / Upcoming</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div className="stat-val">{summary.completedCount}</div>
              <div className="stat-label">Completed Jobs</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
              <DollarSign size={26} />
            </div>
            <div>
              <div className="stat-val">₹{summary.totalEarnings}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
            Client Appointments & Service Requests
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review booking dates, confirm client requests, and update completion status.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading incoming requests...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>No client appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date & Slot</th>
                  <th>Location</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.customer?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customer?.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.service?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {b.service?.durationMinutes} mins
                      </div>
                    </td>
                    <td>
                      <div><strong>{new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.timeSlot}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: 200, fontSize: '0.85rem' }}>
                        {b.serviceAddress?.addressLine}, {b.serviceAddress?.city}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-900)' }}>₹{b.price}</strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${b.status.toLowerCase().replace(' ', '')}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'Rejected')}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'In Progress')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                          >
                            Start Job
                          </button>
                        )}
                        {b.status === 'In Progress' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Completed')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', backgroundColor: '#16a34a' }}
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status === 'Completed' && (
                          <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                            ✓ Fulfilled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenerDashboard;
