import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}! 🌿`, 'success');
        // Route according to role if coming from root
        if (redirectPath === '/') {
          if (res.user.role === 'admin') navigate('/admin');
          else if (res.user.role === 'nursery') navigate('/vendor/nursery');
          else if (res.user.role === 'gardener') navigate('/vendor/gardener');
          else navigate('/shop');
        } else {
          navigate(redirectPath);
        }
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    showToast(`Filled credentials for ${demoEmail}`, 'info');
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 500 }}>
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
            <h1 style={{ fontSize: '1.9rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
              Welcome to Urbano
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Sign in to manage plant orders, garden bookings, and nursery listings.
            </p>
          </div>

          {/* Quick Demo Logins Banner */}
          <div style={{
            backgroundColor: 'var(--bg-cream)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-800)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={14} />
              <span>1-Click Test Demo Accounts</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@urbanonursery.com', 'Admin@12345')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('greenhaven@urbanonursery.com', 'Nursery@12345')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                🏪 Nursery Vendor
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('ramesh.gardener@urbanonursery.com', 'Gardener@12345')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                🌿 Gardener
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('ananya.customer@urbanonursery.com', 'Customer@12345')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                🪴 Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
