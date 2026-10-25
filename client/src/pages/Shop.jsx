import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state synced with query params
  const [querySearch, setQuerySearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [indoorOutdoor, setIndoorOutdoor] = useState(searchParams.get('indoorOutdoor') || 'all');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters or searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (querySearch) params.set('q', querySearch);
        if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
        if (indoorOutdoor && indoorOutdoor !== 'all') params.set('indoorOutdoor', indoorOutdoor);
        if (difficulty && difficulty !== 'all') params.set('difficulty', difficulty);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (inStockOnly) params.set('inStock', 'true');
        if (sortOption) params.set('sort', sortOption);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalProducts(res.data.total);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [querySearch, selectedCategory, indoorOutdoor, difficulty, maxPrice, inStockOnly, sortOption]);

  const handleResetFilters = () => {
    setQuerySearch('');
    setSelectedCategory('all');
    setIndoorOutdoor('all');
    setDifficulty('all');
    setMaxPrice('');
    setInStockOnly(false);
    setSortOption('newest');
    setSearchParams({});
  };

  return (
    <div className="shop-page-wrapper">
      <div className="container">
        {/* Top Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
            Garden Marketplace
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Browse healthy indoor and outdoor plants, heirloom seeds, handcrafted planters, and organic gardening essentials.
          </p>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Filter size={18} color="var(--primary-700)" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="filter-group">
              <label className="filter-title">Search Products</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Snake, Monstera..."
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: '2rem' }}
                />
                {querySearch && (
                  <button
                    onClick={() => setQuerySearch('')}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <div className="filter-title">Categories</div>
              <ul className="filter-list">
                <li className="filter-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', width: '100%' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                    />
                    <span>All Categories</span>
                  </label>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id} className="filter-item">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', width: '100%' }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement / Indoor Outdoor */}
            <div className="filter-group">
              <div className="filter-title">Sunlight & Space</div>
              <ul className="filter-list">
                <li className="filter-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="indoorOutdoor"
                      checked={indoorOutdoor === 'all'}
                      onChange={() => setIndoorOutdoor('all')}
                    />
                    <span>All Environments</span>
                  </label>
                </li>
                <li className="filter-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="indoorOutdoor"
                      checked={indoorOutdoor === 'indoor'}
                      onChange={() => setIndoorOutdoor('indoor')}
                    />
                    <span>Indoor Friendly</span>
                  </label>
                </li>
                <li className="filter-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="indoorOutdoor"
                      checked={indoorOutdoor === 'outdoor'}
                      onChange={() => setIndoorOutdoor('outdoor')}
                    />
                    <span>Outdoor & Full Sun</span>
                  </label>
                </li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <div className="filter-title">Max Price (₹)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-control"
                  min="0"
                />
                {maxPrice && (
                  <button
                    onClick={() => setMaxPrice('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="filter-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main>
            {/* Topbar: count and sort */}
            <div className="shop-topbar">
              <div className="shop-results-count">
                Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Sort By:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="shop-sort-select"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                Filtering botanical varieties...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Search size={28} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No plants found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                  We couldn't find any products matching your current filters. Try searching for another name or reset filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
