import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
      });

      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile and address updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
            My Account & Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal contact details, saved default delivery addresses, and account security.
          </p>
        </div>

        <div className="cart-items-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundColor: 'var(--primary-800)', color: '#fff', fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>{user?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <Mail size={15} />
                <span>{user?.email}</span>
                <span className={`dropdown-user-role role-${user?.role}`} style={{ marginLeft: '0.5rem' }}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              Personal Details
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: '2rem 0 1.25rem' }}>
              Default Delivery Address
            </h3>

            <div className="form-group">
              <label className="form-label">Street / House / Apartment</label>
              <input
                type="text"
                name="street"
                className="form-control"
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g. 45 Green Park, 5th Cross"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: 300 }}>
              <label className="form-label">Postal PIN Code</label>
              <input
                type="text"
                name="postalCode"
                className="form-control"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
              disabled={saving}
            >
              <CheckCircle size={18} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
