import React, { useState, useEffect } from 'react';
import { Store, Plus, Package, DollarSign, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const NurseryDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    botanicalName: '',
    description: '',
    price: 399,
    originalPrice: 499,
    stock: 15,
    category: '',
    indoorOutdoor: 'indoor',
    difficulty: 'Beginner Friendly',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    careLight: 'Bright indirect sunlight',
    careWater: 'Water when top 1-2 inches of soil feel dry',
    careSoil: 'Well-draining potting soil with perlite',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, catRes] = await Promise.all([
        api.get('/products/vendor/my-products'),
        api.get('/orders/vendor/incoming'),
        api.get('/categories'),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (ordRes.data.success) setOrders(ordRes.data.orders);
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0 && !productForm.category) {
          setProductForm((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load nursery dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check if nursery is still pending approval
  if (user?.role === 'nursery' && user?.vendorStatus === 'pending') {
    return (
      <div className="container" style={{ padding: '6rem 0', maxWidth: 650, textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Clock size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-900)', marginBottom: '0.6rem' }}>
            Nursery Account Pending Approval
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Thank you for registering <strong>{user?.nurseryProfile?.nurseryName || user?.name}</strong>! To ensure botanical authenticity and plant quality, an administrator reviews every nursery partner before listings go live.
          </p>
          <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: 8, fontSize: '0.88rem', color: 'var(--primary-900)' }}>
            🌱 Tip: If you are testing the platform, log in as Administrator (<code>admin@urbanonursery.com</code>) to approve this vendor registration in the Admin Dashboard!
          </div>
        </div>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      botanicalName: '',
      description: '',
      price: 399,
      originalPrice: 499,
      stock: 15,
      category: categories[0]?._id || '',
      indoorOutdoor: 'indoor',
      difficulty: 'Beginner Friendly',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      careLight: 'Bright indirect sunlight',
      careWater: 'Water when top 1-2 inches of soil feel dry',
      careSoil: 'Well-draining potting soil with perlite',
    });
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      botanicalName: prod.botanicalName || '',
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      category: prod.category?._id || prod.category,
      indoorOutdoor: prod.indoorOutdoor || 'indoor',
      difficulty: prod.difficulty || 'Beginner Friendly',
      imageUrl: prod.images?.[0] || '',
      careLight: prod.careGuide?.light || '',
      careWater: prod.careGuide?.water || '',
      careSoil: prod.careGuide?.soil || '',
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this botanical listing?')) return;
    try {
      const res = await api.delete(`/products/${prodId}`);
      if (res.data.success) {
        showToast('Product listing removed', 'info');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        botanicalName: productForm.botanicalName,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        category: productForm.category,
        indoorOutdoor: productForm.indoorOutdoor,
        difficulty: productForm.difficulty,
        images: [productForm.imageUrl],
        careGuide: {
          light: productForm.careLight,
          water: productForm.careWater,
          soil: productForm.careSoil,
        },
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        showToast('Listing updated successfully!', 'success');
      } else {
        await api.post('/products', payload);
        showToast('New plant listing added to catalog!', 'success');
      }

      setProductModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  // Metrics calculations
  const totalSalesRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="dropdown-user-role role-nursery">Approved Nursery</span>
              <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>● Active Vendor</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)' }}>
              {user?.nurseryProfile?.nurseryName || 'Nursery Vendor Dashboard'}
            </h1>
          </div>

          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Plant Listing</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)' }}>
              <Store size={26} />
            </div>
            <div>
              <div className="stat-val">{products.length}</div>
              <div className="stat-label">Active Listings</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
              <Package size={26} />
            </div>
            <div>
              <div className="stat-val">{orders.length}</div>
              <div className="stat-label">Incoming Orders</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <DollarSign size={26} />
            </div>
            <div>
              <div className="stat-val">₹{totalSalesRevenue}</div>
              <div className="stat-label">Fulfilled Sales</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div className="stat-val">{totalUnitsInStock}</div>
              <div className="stat-label">Units in Greenhouse</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            My Plant Inventory ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Incoming Customer Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Environment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No plant listings yet. Click "Add New Plant Listing" to list your first botanical!
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{prod.name}</div>
                            {prod.botanicalName && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                {prod.botanicalName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{prod.category?.name || 'General'}</td>
                      <td>
                        <strong style={{ color: 'var(--primary-900)' }}>₹{prod.price}</strong>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: prod.stock > 5 ? '#16a34a' : prod.stock > 0 ? '#d97706' : '#dc2626'
                        }}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td>
                        <span className="badge-tag badge-indoor">{prod.indoorOutdoor}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.6rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.3rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Orders Table */}
        {activeTab === 'orders' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Fulfillment Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No customer orders containing your products yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <strong>#{ord.orderNumber}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </td>
                      <td>
                        <div>{ord.customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.customer?.phone}</div>
                      </td>
                      <td>
                        {ord.items.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.85rem' }}>
                            {item.quantity}&times; {item.name}
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>₹{ord.totalAmount}</strong>
                      </td>
                      <td>
                        <span className={`status-pill status-${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 140 }}
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        <Modal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          title={editingProduct ? 'Edit Plant Listing' : 'Add New Plant to Marketplace'}
          maxWidth={650}
        >
          <form onSubmit={handleSaveProduct}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Plant / Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Fiddle Leaf Fig"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Botanical / Latin Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ficus lyrata"
                  value={productForm.botanicalName}
                  onChange={(e) => setProductForm({ ...productForm, botanicalName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sunlight Environment</label>
                <select
                  className="form-control"
                  value={productForm.indoorOutdoor}
                  onChange={(e) => setProductForm({ ...productForm, indoorOutdoor: e.target.value })}
                >
                  <option value="indoor">Indoor Friendly</option>
                  <option value="outdoor">Outdoor / Full Sun</option>
                  <option value="both">Both Indoor & Balcony</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price / MRP (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Stock *</label>
                <input
                  type="number"
                  className="form-control"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Botanical Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={productForm.imageUrl}
                onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Description *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe leaf structure, air-filtering benefits, and packaging..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              ></textarea>
            </div>

            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', margin: '1.25rem 0 0.75rem' }}>
              Care Instructions
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Light Requirements</label>
                <input
                  type="text"
                  className="form-control"
                  value={productForm.careLight}
                  onChange={(e) => setProductForm({ ...productForm, careLight: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Watering Schedule</label>
                <input
                  type="text"
                  className="form-control"
                  value={productForm.careWater}
                  onChange={(e) => setProductForm({ ...productForm, careWater: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setProductModalOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={savingProduct}>
                {savingProduct ? 'Saving Listing...' : editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default NurseryDashboard;
