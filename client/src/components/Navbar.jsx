import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sprout,
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Package,
  Calendar,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Store,
  Scissors,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        🌱 Free doorstep delivery on plant orders above ₹999 &bull; 100% Healthy Plant Transit Guarantee!
      </div>

      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-icon">
              <Sprout size={22} />
            </div>
            <span>Urbano Nursery</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Shop Plants
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Gardening Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/gardeners" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Expert Gardeners
              </NavLink>
            </li>
          </ul>

          {/* Right Action Items */}
          <div className="nav-actions">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="search-bar-header">
              <button type="submit" className="search-icon-btn" aria-label="Search">
                <Search size={16} />
              </button>
              <input
                type="text"
                placeholder="Search plants, seeds, pots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Cart Icon */}
            <Link to="/cart" className="cart-icon-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Auth / User dropdown */}
            {isAuthenticated ? (
              <div className="user-menu-wrapper" ref={dropdownRef}>
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="user-avatar-small">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <span className={`dropdown-user-role role-${user?.role}`}>
                        {user?.role}
                      </span>
                    </div>

                    {/* Customer Links */}
                    <Link
                      to="/my-orders"
                      className="dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Calendar size={16} />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/my-complaints"
                      className="dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <AlertCircle size={16} />
                      <span>Support & Disputes</span>
                    </Link>

                    {/* Role Specific Dashboards */}
                    {user?.role === 'nursery' && (
                      <Link
                        to="/vendor/nursery"
                        className="dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Store size={16} />
                        <span>Nursery Dashboard</span>
                      </Link>
                    )}

                    {user?.role === 'gardener' && (
                      <Link
                        to="/vendor/gardener"
                        className="dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Scissors size={16} />
                        <span>Gardener Dashboard</span>
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon size={16} />
                      <span>My Profile</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-logout-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#fff',
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search plants, seeds, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>
            Shop Plants & Supplies
          </Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>
            Gardening Services
          </Link>
          <Link to="/gardeners" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>
            Expert Gardeners
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
              {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>}
              {user?.role === 'nursery' && <Link to="/vendor/nursery" onClick={() => setMobileMenuOpen(false)}>Nursery Dashboard</Link>}
              {user?.role === 'gardener' && <Link to="/vendor/gardener" onClick={() => setMobileMenuOpen(false)}>Gardener Dashboard</Link>}
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
