import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="product-card">
      <div className="product-image-container">
        {/* Badges */}
        <div className="product-badges">
          {product.indoorOutdoor && product.indoorOutdoor !== 'both' && (
            <span className={`badge-tag badge-${product.indoorOutdoor}`}>
              {product.indoorOutdoor}
            </span>
          )}
          {discountPercent && (
            <span className="badge-tag badge-discount">
              {discountPercent}% OFF
            </span>
          )}
          {product.stock <= 0 && (
            <span className="badge-tag" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
              Out of Stock
            </span>
          )}
        </div>

        <Link to={`/products/${product._id}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-card-body">
        {product.botanicalName && (
          <div className="product-botanical">{product.botanicalName}</div>
        )}

        <Link to={`/products/${product._id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="product-rating">
          <RatingStars rating={product.ratingsAverage || 5} size={14} />
          <span className="product-rating-count">
            ({product.ratingsQuantity || 0})
          </span>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginBottom: '0.5rem' }}>
            Only {product.stock} left in stock!
          </div>
        )}

        <div className="product-card-footer">
          <div className="price-wrapper">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>

          <button
            type="button"
            className="btn-add-cart"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
