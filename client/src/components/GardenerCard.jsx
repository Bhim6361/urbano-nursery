import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Calendar, CheckCircle } from 'lucide-react';
import RatingStars from './RatingStars';

const GardenerCard = ({ gardener }) => {
  if (!gardener) return null;

  const profile = gardener.gardenerProfile || {};

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <img
          src={gardener.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
          alt={gardener.name}
          style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-200)' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>{gardener.name}</h3>
            <CheckCircle size={16} color="#16a34a" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
            <Award size={14} color="var(--primary-600)" />
            <span>{profile.experienceYears || 3}+ Years Experience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
            <RatingStars rating={profile.rating || 4.9} size={14} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>{profile.rating || 4.9}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({profile.reviewCount || 10})</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
        {profile.bio || 'Dedicated horticultural expert specializing in lawn maintenance, pruning, and organic disease recovery.'}
      </p>

      {profile.specialties && profile.specialties.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.5rem' }}>
          {profile.specialties.map((spec, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-800)',
                border: '1px solid var(--primary-200)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>₹{profile.hourlyRate || 400}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / hour</span>
        </div>

        <Link to={`/book-service?gardenerId=${gardener._id}`} className="btn btn-primary btn-sm">
          <Calendar size={15} />
          <span>Book Gardener</span>
        </Link>
      </div>
    </div>
  );
};

export default GardenerCard;
