import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 16, interactive = false, onRatingChange = null }) => {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: interactive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              color="#f59e0b"
              fill={isFilled ? '#f59e0b' : 'transparent'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
