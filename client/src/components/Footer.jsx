import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to Urbano Green Journal! 🌿', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top Feature Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          marginBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(82, 183, 136, 0.2)', color: '#74c69d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Safe Doorstep Delivery</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Eco-friendly secure plant packaging</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(82, 183, 136, 0.2)', color: '#74c69d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Healthy Plant Guarantee</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>100% replacement if damaged in transit</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(82, 183, 136, 0.2)', color: '#74c69d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Verified Gardeners</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Certified horticultural specialists</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ color: '#ffffff' }}>
              <div className="brand-icon">
                <Sprout size={22} />
              </div>
              <span>Urbano Nursery</span>
            </Link>
            <p className="footer-desc">
              India's premium marketplace for healthy indoor and outdoor plants, artisan pots, organic gardening tools, and verified professional gardeners.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#52b788" />
                <span>45 Lalbagh Botanical Road, Bengaluru 560004</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#52b788" />
                <span>+91 98765 43210 (Mon-Sat, 9AM-7PM)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#52b788" />
                <span>care@urbanonursery.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Shop Botanicals</h4>
            <ul className="footer-links">
              <li><Link to="/shop?category=indoor-plants">Indoor Purifying Plants</Link></li>
              <li><Link to="/shop?category=flowering-plants">Flowering Ornamentals</Link></li>
              <li><Link to="/shop?category=seeds-bulbs">Organic Vegetable Seeds</Link></li>
              <li><Link to="/shop?category=pots-planters">Artisan Ceramic Planters</Link></li>
              <li><Link to="/shop?category=tools-plant-care">Gardening Tools & Shears</Link></li>
              <li><Link to="/shop?category=soils-fertilizers">Organic Vermicompost</Link></li>
            </ul>
          </div>

          {/* Services & Community */}
          <div>
            <h4 className="footer-heading">Services & Info</h4>
            <ul className="footer-links">
              <li><Link to="/services">Book Lawn Care</Link></li>
              <li><Link to="/services">Plant Doctor Consultation</Link></li>
              <li><Link to="/gardeners">Hire an Expert Gardener</Link></li>
              <li><Link to="/register">Become a Nursery Vendor</Link></li>
              <li><Link to="/register">Join as a Gardener</Link></li>
              <li><Link to="/my-complaints">Support & Help Desk</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-heading">The Green Journal</h4>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Subscribe for weekly balcony gardening hacks, seasonal pruning calendars, and exclusive plant collector drops.
            </p>
            <form onSubmit={handleNewsletter} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Urbano Nursery Pvt Ltd. Crafted with <Heart size={13} color="#ef4444" style={{ display: 'inline' }} /> for greener homes.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Plant Transit Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
