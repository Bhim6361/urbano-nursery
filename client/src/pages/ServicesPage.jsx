import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, Filter, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === 'all' ? '/services' : `/services?category=${selectedCategory}`;
        const res = await api.get(url);
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Error fetching services', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  const categories = [
    'all',
    'Lawn Maintenance',
    'Pruning & Trimming',
    'Soil & Repotting',
    'Plant Doctor & Pest',
    'Landscaping & Makeover',
  ];

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 3rem' }}>
          <span className="section-tag">Professional Horticultural Care</span>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--primary-900)', marginBottom: '0.8rem' }}>
            Gardening & Plant Care Services
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Schedule expert lawn grooming, hedge pruning, pest eradication, and urban balcony makeovers by certified plant doctors.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading professional gardening services...
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Service Guarantee Banner */}
        <div style={{
          marginTop: '5rem',
          backgroundColor: 'var(--primary-900)',
          color: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.6rem' }}>
              Our 100% Satisfaction Promise
            </h3>
            <p style={{ color: 'var(--primary-200)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Every session is handled by background-verified gardeners equipped with sanitized tools and organic, pet-safe treatments.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#52b788" />
              <span>Sanitized professional bypass shears & equipment</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#52b788" />
              <span>100% chemical-free organic pest sprays & fertilizers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#52b788" />
              <span>Free 30-day post-service care schedule included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
