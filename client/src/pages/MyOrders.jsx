import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, AlertTriangle, ArrowRight, Eye, XCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${orderToCancel._id}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully', 'info');
        setCancelModalOpen(false);
        setOrderToCancel(null);
        fetchOrders();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
            My Botanical Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track your healthy plant shipments, view invoices, and manage order deliveries.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Package size={34} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No orders placed yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
              Explore our fresh collection of purifying indoor greenery and artisan planters.
            </p>
            <Link to="/shop" className="btn btn-primary">
              <span>Start Shopping Plants</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Header */}
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
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-900)' }}>
                        #{order.orderNumber}
                      </span>
                      <span className={`status-pill status-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; Payment: {order.paymentMethod} ({order.paymentStatus})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      ₹{order.totalAmount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} Items
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=200&q=80'}
                          alt={item.name}
                          style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} &times; ₹{item.price}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Deliver to: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city}, {order.shippingAddress?.postalCode})
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                      to="/my-complaints"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.82rem' }}
                    >
                      Report Issue / Dispute
                    </Link>

                    {order.orderStatus === 'Pending' && (
                      <button
                        onClick={() => {
                          setOrderToCancel(order);
                          setCancelModalOpen(true);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancel Botanical Order"
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Are you sure you want to cancel order <strong>#{orderToCancel?.orderNumber}</strong>? Reserved plant stock will be released back into our greenhouse inventory.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setCancelModalOpen(false)} className="btn btn-secondary btn-sm">
              Keep Order
            </button>
            <button onClick={handleCancelOrder} className="btn btn-danger btn-sm" disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyOrders;
