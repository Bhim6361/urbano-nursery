import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Scissors, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BookService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const preselectedServiceId = searchParams.get('serviceId') || '';
  const preselectedGardenerId = searchParams.get('gardenerId') || '';

  const [services, setServices] = useState([]);
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tomorrow's date formatted as YYYY-MM-DD for date min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    serviceId: preselectedServiceId,
    gardenerId: preselectedGardenerId,
    bookingDate: minDateStr,
    timeSlot: '09:00 AM - 12:00 PM',
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.address?.street || '',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '560034',
    notes: '',
    paymentMethod: 'Cash after Service',
  });

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const [servRes, gardRes] = await Promise.all([
          api.get('/services'),
          api.get('/services/gardeners/list'),
        ]);

        if (servRes.data.success) {
          setServices(servRes.data.services);
          if (!preselectedServiceId && servRes.data.services.length > 0) {
            setFormData((prev) => ({ ...prev, serviceId: servRes.data.services[0]._id }));
          }
        }

        if (gardRes.data.success) {
          setGardeners(gardRes.data.gardeners);
          if (!preselectedGardenerId && gardRes.data.gardeners.length > 0) {
            setFormData((prev) => ({ ...prev, gardenerId: gardRes.data.gardeners[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching booking data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [preselectedServiceId, preselectedGardenerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedServiceObj = services.find((s) => s._id === formData.serviceId);
  const selectedGardenerObj = gardeners.find((g) => g._id === formData.gardenerId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to schedule your gardening service', 'warning');
      navigate('/login', { state: { from: `/book-service?${searchParams.toString()}` } });
      return;
    }

    if (!formData.serviceId || !formData.gardenerId || !formData.bookingDate || !formData.timeSlot) {
      showToast('Please complete all service appointment details', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceId: formData.serviceId,
        gardenerId: formData.gardenerId,
        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
        serviceAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        showToast('🌿 Gardening appointment requested successfully!', 'success');
        navigate('/my-bookings');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book service appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading service availability & gardener calendars...
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            <span>Back to All Gardening Services</span>
          </Link>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)' }}>
            Schedule a Gardening Specialist
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="checkout-grid">
          {/* Left: Booking Details Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step 1: Service & Gardener */}
            <div className="cart-items-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scissors size={20} color="var(--primary-700)" />
                <span>1. Service & Horticultural Specialist</span>
              </h3>

              <div className="form-group">
                <label className="form-label">Select Gardening Service *</label>
                <select
                  name="serviceId"
                  className="form-control"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} — ₹{s.basePrice} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Preferred Gardener *</label>
                <select
                  name="gardenerId"
                  className="form-control"
                  value={formData.gardenerId}
                  onChange={handleChange}
                  required
                >
                  {gardeners.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name} &bull; {g.gardenerProfile?.experienceYears || 3} Yrs Exp &bull; ★ {g.gardenerProfile?.rating || 4.9}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Date & Time Slot */}
            <div className="cart-items-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--primary-700)" />
                <span>2. Appointment Date & Slot</span>
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Service Date *</label>
                  <input
                    type="date"
                    name="bookingDate"
                    className="form-control"
                    min={minDateStr}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Time Slot *</label>
                  <select
                    name="timeSlot"
                    className="form-control"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    required
                  >
                    <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                    <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Location Details */}
            <div className="cart-items-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--primary-700)" />
                <span>3. Service Location & Notes</span>
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Garden / House Address *</label>
                <input
                  type="text"
                  name="addressLine"
                  className="form-control"
                  placeholder="e.g. Villa 14, Palm Grove, Sarjapur Road"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Garden Notes or Special Concerns (Optional)</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Balcony palms have mealybugs; need soil repotting for 4 terracotta pots."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right: Summary Card */}
          <div className="summary-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--primary-900)' }}>
              Booking Summary
            </h3>

            {selectedServiceObj && (
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>
                  {selectedServiceObj.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  {selectedServiceObj.category}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Session duration: {selectedServiceObj.durationMinutes} minutes
                </div>
              </div>
            )}

            {selectedGardenerObj && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <img
                  src={selectedGardenerObj.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80'}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedGardenerObj.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Master Specialist &bull; ★ {selectedGardenerObj.gardenerProfile?.rating || 4.9}
                  </div>
                </div>
              </div>
            )}

            <div className="summary-row">
              <span>Appointment Date</span>
              <strong>{formData.bookingDate}</strong>
            </div>

            <div className="summary-row">
              <span>Time Slot</span>
              <strong style={{ fontSize: '0.85rem' }}>{formData.timeSlot}</strong>
            </div>

            <div className="summary-row">
              <span>Payment Mode</span>
              <span>{formData.paymentMethod}</span>
            </div>

            <div className="summary-total">
              <span>Total Service Fee</span>
              <span>₹{selectedServiceObj?.basePrice || 599}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.75rem' }}
              disabled={submitting}
            >
              <CheckCircle size={18} />
              <span>{submitting ? 'Confirming Slot...' : 'Confirm Appointment'}</span>
            </button>

            <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Free cancellation up to 4 hours before your scheduled appointment time.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookService;
