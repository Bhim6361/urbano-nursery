import React, { useState, useEffect } from 'react';
import { AlertCircle, PlusCircle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    type: 'Order',
    referenceId: '',
    subject: '',
    description: '',
    priority: 'Medium',
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/my-complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      showToast('Please provide subject and description', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/complaints', formData);
      if (res.data.success) {
        showToast('Complaint ticket filed successfully. Our team will review it.', 'success');
        setModalOpen(false);
        setFormData({
          type: 'Order',
          referenceId: '',
          subject: '',
          description: '',
          priority: 'Medium',
        });
        fetchComplaints();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to file complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
              Customer Support & Dispute Desk
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Report transit damages, booking cancellations, or unresolved nursery issues directly to our admin team.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>File New Dispute Ticket</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading tickets...
          </div>
        ) : complaints.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle size={34} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No active disputes or complaints</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
              All your botanical orders and appointments are running smoothly. If you ever experience issues, raise a ticket here!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {complaints.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: 4, backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)' }}>
                        {item.type} {item.referenceId ? `#${item.referenceId}` : ''}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>{item.subject}</h3>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Submitted on {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; Priority: {item.priority}
                    </div>
                  </div>

                  <span className={`status-pill status-${item.status.toLowerCase().replace('-', '')}`}>
                    {item.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {item.description}
                </p>

                {item.resolution && (
                  <div style={{
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      Admin Team Resolution:
                    </div>
                    <div style={{ color: '#14532d', fontSize: '0.88rem' }}>
                      {item.resolution}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* File Complaint Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="File a Dispute or Complaint Ticket"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                  <option value="Order">Order Issue (Plant condition / Delay)</option>
                  <option value="Booking">Gardening Appointment Dispute</option>
                  <option value="Product">Product Quality Concern</option>
                  <option value="Vendor">Vendor Dispute</option>
                  <option value="Other">General Platform Inconvenience</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Order or Booking ID (Optional)</label>
                <input
                  type="text"
                  name="referenceId"
                  className="form-control"
                  placeholder="e.g. URB-9821-4401"
                  value={formData.referenceId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject Headline *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="e.g. Broken planter saucer upon delivery"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                placeholder="Please describe what occurred and how our customer care team can resolve it..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-control" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low - General query</option>
                <option value="Medium">Medium - Standard assistance required</option>
                <option value="High">High - Damaged living plant or urgent conflict</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Support Ticket'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default MyComplaints;
