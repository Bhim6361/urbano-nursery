import React, { useState, useEffect } from 'react';
import { Award, Users, Star, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import GardenerCard from '../components/GardenerCard';

const GardenersPage = () => {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGardeners = async () => {
      setLoading(true);
      try {
        const res = await api.get('/services/gardeners/list');
        if (res.data.success) {
          setGardeners(res.data.gardeners);
        }
      } catch (err) {
        console.error('Failed to load gardeners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGardeners();
  }, []);

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 3.5rem' }}>
          <span className="section-tag">Verified Horticultural Specialists</span>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--primary-900)', marginBottom: '0.8rem' }}>
            Meet Our Expert Gardeners
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Certified master gardeners and urban plant doctors vetted for skills, punctuality, and eco-friendly practices.
          </p>
        </div>

        {/* Gardeners Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading verified gardeners...
          </div>
        ) : gardeners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No verified gardeners currently active. Check back shortly!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {gardeners.map((gardener) => (
              <GardenerCard key={gardener._id} gardener={gardener} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenersPage;
