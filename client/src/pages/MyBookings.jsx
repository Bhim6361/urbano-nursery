import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Scissors, CheckCircle, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this gardening appointment?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'Cancelled' });
      if (res.data.success) {
        showToast('Gardening appointment cancelled', 'info');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        targetType: 'Service',
        targetId: selectedBooking.service?._id,
        rating,
        title: `Service by ${selectedBooking.gardener?.name || 'Gardener'}`,
        comment,
      });

      if (res.data.success) {
        showToast('Thank you for rating your gardener!', 'success');
        setReviewModalOpen(false);
        setComment('');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
            My Gardening Appointments
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track scheduled lawn care, tree pruning, repotting sessions, and plant doctor visits.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading your appointments...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Calendar size={34} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No gardening appointments scheduled</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
              Book an expert horticulturist to groom your lawn, prune overgrown shrubs, or revive struggling plants.
            </p>
            <Link to="/services" className="btn btn-primary">
              <span>Explore Gardening Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>
                        {booking.service?.name || 'Gardening Service'}
                      </h3>
                      <span className={`status-pill status-${booking.status.toLowerCase().replace(' ', '')}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Category: {booking.service?.category} &bull; Payment: {booking.paymentMethod} ({booking.paymentStatus})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      ₹{booking.price}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Assigned to: {booking.gardener?.name}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{ padding: '1.25rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={18} color="var(--primary-700)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</div>
                      <strong>{new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <Clock size={18} color="var(--primary-700)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Slot</div>
                      <strong>{booking.timeSlot}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={18} color="var(--primary-700)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</div>
                      <span>{booking.serviceAddress?.addressLine}, {booking.serviceAddress?.city}</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div style={{ backgroundColor: 'var(--bg-cream)', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <strong>Special Instructions:</strong> {booking.notes}
                  </div>
                )}

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link to="/my-complaints" className="btn btn-outline btn-sm">
                    Report Issue
                  </Link>

                  {booking.status === 'Completed' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setReviewModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span>Rate Service</span>
                    </button>
                  )}

                  {['Pending', 'Confirmed'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Rate ${selectedBooking?.service?.name}`}
        >
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label className="form-label">Service Rating</label>
              <RatingStars
                rating={rating}
                size={24}
                interactive={true}
                onRatingChange={(val) => setRating(val)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Feedback for Gardener</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="How punctual and skilled was the gardener? Did they cleanup afterwards?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default MyBookings;
