import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Search,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  Scissors,
  CheckCircle,
  ArrowRight,
  Sun,
  Star,
  Users,
  Award,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, servRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
          api.get('/services'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.products);
        if (servRes.data.success) setFeaturedServices(servRes.data.services.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">
                <Sprout size={16} />
                <span>Nursery &bull; Planters &bull; Expert Gardeners</span>
              </div>

              <h1 className="hero-title">
                Breathe Fresh Air. <br />
                Bring <span>Nature Home.</span>
              </h1>

              <p className="hero-subtitle">
                Explore over 200+ healthy indoor plants, handcrafted planters, organic nutrition, and book certified expert gardeners for your home garden.
              </p>

              {/* Hero Search */}
              <form onSubmit={handleHeroSearch} style={{ maxWidth: 480, display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
                <input
                  type="text"
                  placeholder="Search 'Snake Plant', 'Tomato Seeds', 'Pots'..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.85rem 1.25rem', backgroundColor: '#fff' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                  <Search size={18} />
                  <span>Find</span>
                </button>
              </form>

              <div className="hero-actions">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <span>Shop Plants</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg">
                  <Scissors size={18} color="var(--primary-700)" />
                  <span>Book a Gardener</span>
                </Link>
              </div>

              {/* Hero Trust Stats */}
              <div className="hero-stats">
                <div className="hero-stat-item">
                  <strong>15,000+</strong>
                  <span>Happy Plant Parents</span>
                </div>
                <div className="hero-stat-item">
                  <strong>100%</strong>
                  <span>Transit Damage Guarantee</span>
                </div>
                <div className="hero-stat-item">
                  <strong>4.9 ★</strong>
                  <span>Horticulture Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Imagery with Glass Badges */}
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1000&q=80"
                alt="Lush green Monstera and indoor plants at Urbano Nursery"
                className="hero-image-card"
              />

              {/* Floating Top Left Badge */}
              <div className="hero-floating-badge badge-top-left">
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-900)' }}>100% Guaranteed</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Healthy roots upon delivery</div>
                </div>
              </div>

              {/* Floating Bottom Right Badge */}
              <div className="hero-floating-badge badge-bottom-right">
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={22} fill="#b45309" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-900)' }}>Master Gardeners</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Doorstep lawn & pest care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Botanical Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Collections</span>
            <h2 className="section-title">Shop by Botanical Category</h2>
            <p className="section-description">
              Handpicked varieties nurtured by certified local nurseries for balconies, living rooms, and sunny gardens.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link to={`/shop?category=${cat.slug}`} key={cat._id} className="category-card">
                <div className="category-card-icon">
                  <Leaf size={28} />
                </div>
                <h3 className="category-card-title">{cat.name}</h3>
                <span className="category-card-count">
                  {cat.productCount || 0} {cat.productCount === 1 ? 'Variety' : 'Varieties'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Plants Showcase */}
      <section className="products-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Nursery Favorites</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Trending Plants & Planters</h2>
            </div>
            <Link to="/shop" className="btn btn-secondary">
              <span>View All 200+ Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading curated plant varieties...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Professional Gardening Services */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Horticultural Services</span>
            <h2 className="section-title">Expert Care For Your Green Sanctuary</h2>
            <p className="section-description">
              From precision lawn mowing and pest treatment to complete balcony makeovers, our verified gardeners bring tools and expertise to your doorstep.
            </p>
          </div>

          <div className="services-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn btn-primary btn-lg">
              <span>Browse All Services & Book Slots</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Benefits / Why Choose Urbano Nursery */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Urbano Difference</span>
            <h2 className="section-title">Why Plant Parents Love Urbano</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="benefit-title">Transit Safe Guarantee</h3>
              <p className="benefit-desc">
                Specially designed breathable corrugated boxes keep root balls intact and moist during shipment. Free replacement if stressed.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Sparkles size={26} />
              </div>
              <h3 className="benefit-title">Detailed Care Matrix</h3>
              <p className="benefit-desc">
                Every plant includes beginner-friendly light, water, soil, and humidity guidelines so your greenery flourishes forever.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={26} />
              </div>
              <h3 className="benefit-title">Verified Gardeners</h3>
              <p className="benefit-desc">
                Background-checked, certified gardeners with 5+ years experience ready to assist with repotting, pruning, and soil revival.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Truck size={26} />
              </div>
              <h3 className="benefit-title">Fast Doorstep Delivery</h3>
              <p className="benefit-desc">
                Directly harvested from local nursery greenhouses and delivered fresh to your door in protected conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: 'var(--primary-300)' }}>Customer Stories</span>
            <h2 className="section-title">Over 15,000 Homes Made Greener</h2>
            <p className="section-description">Read real feedback from urban balcony gardeners and plant lovers across India.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                {'★★★★★'}
              </div>
              <p className="testimonial-text">
                "Ordered the Monstera Deliciosa and Peace Lily. Both arrived packed with coconut husk wrapping and damp soil. The glossy foliage was flawless without a single yellow leaf!"
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Sneha M."
                  className="author-avatar"
                />
                <div>
                  <div className="author-name">Sneha Mukherjee</div>
                  <div className="author-location">Bengaluru &bull; Verified Buyer</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                {'★★★★★'}
              </div>
              <p className="testimonial-text">
                "Booked the Plant Doctor service when my balcony palms were getting infested with whiteflies. Ramesh came equipped with organic neem sprays and revived them completely."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Karan S."
                  className="author-avatar"
                />
                <div>
                  <div className="author-name">Karan Sharma</div>
                  <div className="author-location">Sarjapur &bull; Service Booking</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                {'★★★★★'}
              </div>
              <p className="testimonial-text">
                "The handcrafted green glazed ceramic pots are heavy and look like luxury home decor items. Comes with matching saucers so my wooden tables stay dry!"
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                  alt="Priya D."
                  className="author-avatar"
                />
                <div>
                  <div className="author-name">Priya Deshmukh</div>
                  <div className="author-location">Indiranagar &bull; Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
