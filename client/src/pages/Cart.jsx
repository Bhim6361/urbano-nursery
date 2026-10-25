import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    shippingFee,
    cartTotal,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'URBANO10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountApplied(discount);
      showToast('Promo code URBANO10 applied: 10% savings!', 'success');
    } else {
      showToast('Invalid promo code. Use URBANO10 for 10% demo discount!', 'warning');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-800)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <ShoppingBag size={38} />
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-900)', marginBottom: '0.6rem' }}>
          Your Garden Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 2rem' }}>
          Looks like you haven't added any fresh plants, heirloom seeds, or artisan planters yet.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg">
          <span>Explore Plants & Planters</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const amountForFreeShipping = Math.max(0, 999 - cartSubtotal);
  const finalTotal = Math.max(0, cartTotal - discountApplied);

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '1.5rem' }}>
          Your Garden Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
        </h1>

        {/* Free Shipping Progress Alert */}
        {amountForFreeShipping > 0 ? (
          <div style={{
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--primary-900)',
            fontSize: '0.92rem'
          }}>
            <Truck size={20} color="var(--primary-700)" />
            <span>
              Add <strong>₹{amountForFreeShipping}</strong> more to your cart to qualify for <strong>FREE Doorstep Delivery</strong>!
            </span>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#15803d',
            fontSize: '0.92rem',
            fontWeight: 600
          }}>
            <Truck size={20} />
            <span>🎉 Congratulations! Your order qualifies for FREE Doorstep Delivery!</span>
          </div>
        )}

        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Item
              </span>
              <button
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            </div>

            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="cart-table-item">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  className="cart-item-img"
                />

                <div>
                  <Link to={`/products/${product._id}`} className="cart-item-name">
                    {product.name}
                  </Link>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Unit Price: ₹{product.price}
                  </div>
                </div>

                <div className="qty-counter">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                  >
                    -
                  </button>
                  <div className="qty-val">{quantity}</div>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="cart-item-price">₹{product.price * quantity}</div>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    title="Remove item"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="summary-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>
              Order Summary
            </h3>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <strong style={{ color: 'var(--text-primary)' }}>₹{cartSubtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Standard Delivery</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>

            {discountApplied > 0 && (
              <div className="summary-row" style={{ color: '#16a34a' }}>
                <span>Promo Discount (URBANO10)</span>
                <strong>-₹{discountApplied}</strong>
              </div>
            )}

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0' }}>
              <input
                type="text"
                placeholder="Promo Code (URBANO10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="form-control"
                style={{ textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Apply
              </button>
            </form>

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{finalTotal}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { discountApplied } })}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.75rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              <ShieldCheck size={16} color="var(--primary-600)" />
              <span>Safe & Secure Checkout &bull; 100% Transit Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
