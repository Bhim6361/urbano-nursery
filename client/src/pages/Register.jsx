import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Store, Scissors, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Nursery specific
  const [nurseryName, setNurseryName] = useState('');
  const [nurseryCity, setNurseryCity] = useState('Bengaluru');

  // Gardener specific
  const [gardenerBio, setGardenerBio] = useState('');
  const [gardenerExp, setGardenerExp] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(400);

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill all required registration fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
      };

      if (role === 'nursery') {
        payload.nurseryProfile = {
          nurseryName: nurseryName || `${name}'s Botanical Nursery`,
          city: nurseryCity,
          description: 'Specializing in acclimatized potted greenery and organic garden supplies.',
        };
      }

      if (role === 'gardener') {
        payload.gardenerProfile = {
          bio: gardenerBio || 'Dedicated horticulturalist with hands-on expertise in lawn maintenance and plant recovery.',
          experienceYears: Number(gardenerExp),
          hourlyRate: Number(hourlyRate),
        };
      }

      const res = await register(payload);
      if (res.success) {
        showToast(res.message || 'Account created successfully!', 'success');
        if (role === 'nursery') navigate('/vendor/nursery');
        else if (role === 'gardener') navigate('/vendor/gardener');
        else navigate('/shop');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 48, height: 48 }}>
              <Sprout size={28} />
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
              Create Urbano Account
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Join India's botanical community as a buyer, nursery partner, or gardener.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selector Pills */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">I want to register as a: *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'customer' ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                    backgroundColor: role === 'customer' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <UserCheck size={20} color={role === 'customer' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: role === 'customer' ? 'var(--primary-900)' : 'var(--text-secondary)' }}>
                    Customer
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('nursery')}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'nursery' ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                    backgroundColor: role === 'nursery' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Store size={20} color={role === 'nursery' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: role === 'nursery' ? 'var(--primary-900)' : 'var(--text-secondary)' }}>
                    Nursery Vendor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('gardener')}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'gardener' ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                    backgroundColor: role === 'gardener' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Scissors size={20} color={role === 'gardener' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: role === 'gardener' ? 'var(--primary-900)' : 'var(--text-secondary)' }}>
                    Gardener
                  </span>
                </button>
              </div>

              {role !== 'customer' && (
                <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#b45309', backgroundColor: '#fef3c7', padding: '0.5rem 0.75rem', borderRadius: 6 }}>
                  ℹ New {role} accounts require administrator review and approval before product or booking features go live.
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Nursery Profile Fields */}
            {role === 'nursery' && (
              <div style={{ backgroundColor: 'var(--bg-cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', color: 'var(--primary-900)' }}>
                  Nursery Business Info
                </h4>
                <div className="form-group">
                  <label className="form-label">Nursery / Botanical Brand Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Green Haven Botanicals"
                    value={nurseryName}
                    onChange={(e) => setNurseryName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City / Region *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nurseryCity}
                    onChange={(e) => setNurseryCity(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Gardener Profile Fields */}
            {role === 'gardener' && (
              <div style={{ backgroundColor: 'var(--bg-cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', color: 'var(--primary-900)' }}>
                  Gardener Experience & Bio
                </h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="form-control"
                      value={gardenerExp}
                      onChange={(e) => setGardenerExp(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hourly Service Rate (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      min="100"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Bio</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe your horticultural background, turf maintenance, or plant care skills..."
                    value={gardenerBio}
                    onChange={(e) => setGardenerBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
