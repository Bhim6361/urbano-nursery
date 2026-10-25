import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sun,
  Droplet,
  Thermometer,
  Wind,
  Layers,
  ShoppingBag,
  Store,
  CheckCircle,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews?targetType=Product&targetId=${id}`),
        ]);

        if (prodRes.data.success) {
          setProduct(prodRes.data.product);
          setRelatedProducts(prodRes.data.relatedProducts || []);
          if (prodRes.data.product.images && prodRes.data.product.images.length > 0) {
            setSelectedImage(prodRes.data.product.images[0]);
          }
        }

        if (revRes.data.success) {
          setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to write a review', 'warning');
      return;
    }

    if (!reviewComment.trim()) {
      showToast('Please share a few words about your experience', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        targetType: 'Product',
        targetId: id,
        rating: userRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.data.success) {
        showToast(res.data.message || 'Review submitted successfully!', 'success');
        setReviews([res.data.review, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        setUserRating(5);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading plant details & care matrix...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The botanical product you are looking for does not exist or has been retired.</p>
        <Link to="/shop" className="btn btn-primary">Return to Marketplace</Link>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="product-detail-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--primary-700)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--primary-700)' }}>Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} style={{ color: 'var(--primary-700)' }}>
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="detail-gallery">
            <img
              src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="main-detail-img"
            />
            {product.images && product.images.length > 1 && (
              <div className="detail-thumbnails">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    className={`detail-thumb ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details & Info */}
          <div className="detail-info">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span className="badge-tag badge-indoor">{product.indoorOutdoor} Friendly</span>
              <span className="badge-tag" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)' }}>
                {product.difficulty || 'Beginner Friendly'}
              </span>
            </div>

            {product.botanicalName && (
              <div className="detail-botanical">{product.botanicalName}</div>
            )}

            <h1 className="detail-title">{product.name}</h1>

            {/* Ratings & Reviews Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <RatingStars rating={product.ratingsAverage || 5} size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#b45309' }}>
                {product.ratingsAverage || 5}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({product.ratingsQuantity || reviews.length} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="detail-price-box">
              <span className="detail-current-price">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="detail-original-price">₹{product.originalPrice}</span>
              )}
              {discountPercent && (
                <span className="detail-discount-pill">Save {discountPercent}%</span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* In-stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={18} color="#16a34a" />
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>
                    In Stock ({product.stock} available ready to ship)
                  </span>
                </>
              ) : (
                <span style={{ color: '#dc2626', fontWeight: 600 }}>
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="detail-actions-group">
              <div className="qty-counter">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="qty-val">{quantity}</div>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                style={{ flex: 1 }}
              >
                <ShoppingBag size={20} />
                <span>Add {quantity} to Garden Cart</span>
              </button>
            </div>

            {/* Botanical Care Matrix */}
            {product.careGuide && (
              <div>
                <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--primary-800)', marginTop: '1.5rem' }}>
                  Botanical Care Matrix
                </h4>
                <div className="care-matrix">
                  <div className="care-card">
                    <Sun size={20} className="care-card-icon" />
                    <div className="care-card-title">Light</div>
                    <div className="care-card-val">{product.careGuide.light}</div>
                  </div>
                  <div className="care-card">
                    <Droplet size={20} className="care-card-icon" />
                    <div className="care-card-title">Water</div>
                    <div className="care-card-val">{product.careGuide.water}</div>
                  </div>
                  <div className="care-card">
                    <Layers size={20} className="care-card-icon" />
                    <div className="care-card-title">Soil</div>
                    <div className="care-card-val">{product.careGuide.soil}</div>
                  </div>
                  <div className="care-card">
                    <Thermometer size={20} className="care-card-icon" />
                    <div className="care-card-title">Temperature</div>
                    <div className="care-card-val">{product.careGuide.temperature}</div>
                  </div>
                  <div className="care-card">
                    <Wind size={20} className="care-card-icon" />
                    <div className="care-card-title">Humidity</div>
                    <div className="care-card-val">{product.careGuide.humidity}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Nursery Vendor Info */}
            {product.nursery && (
              <div style={{
                backgroundColor: 'var(--bg-cream)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--primary-200)', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Grown & Shipped By
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--primary-900)' }}>
                    {product.nursery.nurseryProfile?.nurseryName || product.nursery.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Certified botanical grower &bull; {product.nursery.nurseryProfile?.city || 'Bengaluru, India'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews & Submit Section */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3.5rem' }}>
            {/* Reviews List */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-900)', marginBottom: '1.5rem' }}>
                Customer Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No reviews yet for this plant. Be the first plant parent to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {rev.user?.name ? rev.user.name[0] : 'U'}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.user?.name || 'Verified Plant Lover'}</span>
                            <span style={{ fontSize: '0.75rem', color: '#16a34a', marginLeft: '0.5rem', fontWeight: 600 }}>✓ Verified Purchase</span>
                          </div>
                        </div>
                        <RatingStars rating={rev.rating} size={14} />
                      </div>

                      {rev.title && (
                        <h4 style={{ fontSize: '1.05rem', margin: '0.4rem 0 0.3rem', color: 'var(--primary-900)' }}>
                          {rev.title}
                        </h4>
                      )}

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Box */}
            <div>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Review This Botanical</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  How healthy was the plant? How easy was the care?
                </p>

                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <RatingStars
                      rating={userRating}
                      size={24}
                      interactive={true}
                      onRatingChange={(newVal) => setUserRating(newVal)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Gorgeous foliage, thriving on my desk!"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Comments</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe the packaging, leaf health, and root condition..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Botanical Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-900)', marginBottom: '1.75rem' }}>
              You May Also Love
            </h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
