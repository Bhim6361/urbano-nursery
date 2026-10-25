import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

const ServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <div className="service-card">
      <img
        src={service.image || 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5e?auto=format&fit=crop&w=800&q=80'}
        alt={service.name}
        className="service-image"
      />
      <div className="service-content">
        <span className="service-category-tag">{service.category}</span>
        <h3 className="service-title">{service.name}</h3>
        <p className="service-desc">{service.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <Clock size={15} color="var(--primary-600)" />
          <span>Approx. {service.durationMinutes} mins service session</span>
        </div>

        {service.features && service.features.length > 0 && (
          <ul className="service-features">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        )}

        <div className="service-footer">
          <div className="service-price">
            ₹{service.basePrice}
            <span> / visit</span>
          </div>

          <Link to={`/book-service?serviceId=${service._id}`} className="btn btn-primary btn-sm">
            <span>Book Now</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
