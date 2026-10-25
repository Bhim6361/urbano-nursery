import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Checkout = () => {
  const { cartItems, cartSubtotal, shippingFee, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const discountApplied = location.state?.discountApplied || 0;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountApplied);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.address?.street || '',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '560034',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to place your botanical order', 'warning');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your garden cart is empty', 'error');
      navigate('/shop');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        deliveryNotes: formData.deliveryNotes,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        clearCart();
        showToast('🎉 Plant order placed successfully! Greenery is on the way.', 'success');
        navigate('/my-orders');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            <span>Return to Garden Cart</span>
          </Link>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)' }}>
            Delivery & Payment
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="checkout-grid">
          {/* Left: Shipping Address & Payment Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Delivery Address Card */}
            <div className="cart-items-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--primary-700)" />
                <span>Shipping Address</span>
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Recipient Full Name *</label>
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
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">House / Flat No., Apartment / Street *</label>
                <input
                  type="text"
                  name="addressLine"
                  className="form-control"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="e.g. Flat 302, Green Orchid Apartments, 4th Cross"
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
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Postal PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    className="form-control"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    placeholder="e.g. Ring the bell, leave at security"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="cart-items-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--primary-700)" />
                <span>Payment Method</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.paymentMethod === 'Cash on Delivery' ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                  backgroundColor: formData.paymentMethod === 'Cash on Delivery' ? 'var(--primary-50)' : '#fff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                  />
                  <Banknote size={24} color="var(--primary-700)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pay with cash or UPI scan when your plants arrive at your doorstep</div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.paymentMethod === 'Demo Online Payment (Card / UPI)' ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                  backgroundColor: formData.paymentMethod === 'Demo Online Payment (Card / UPI)' ? 'var(--primary-50)' : '#fff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Demo Online Payment (Card / UPI)"
                    checked={formData.paymentMethod === 'Demo Online Payment (Card / UPI)'}
                    onChange={handleChange}
                  />
                  <CreditCard size={24} color="var(--primary-700)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      Demo Online Payment (Card / UPI) <span style={{ fontSize: '0.72rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 700 }}>INSTANT SIMULATION</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Simulates instant debit/credit card or UPI confirmation without real money</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="summary-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--primary-900)' }}>
              Order Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', maxHeight: 220, overflowY: 'auto' }}>
              {cartItems.map(({ product, quantity }) => (
                <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {quantity}</div>
                    </div>
                  </div>
                  <strong style={{ color: 'var(--text-primary)' }}>₹{product.price * quantity}</strong>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <strong>₹{cartSubtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>

            {discountApplied > 0 && (
              <div className="summary-row" style={{ color: '#16a34a' }}>
                <span>Discount Applied</span>
                <strong>-₹{discountApplied}</strong>
              </div>
            )}

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.75rem' }}
              disabled={loading}
            >
              <CheckCircle size={18} />
              <span>{loading ? 'Confirming Order...' : `Place Order (₹${grandTotal})`}</span>
            </button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              By placing your order, you agree to Urbano Nursery's plant transit care terms.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
