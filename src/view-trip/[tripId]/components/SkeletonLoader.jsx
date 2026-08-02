import React from 'react';

const SkeletonLoader = () => (
  <div style={{ paddingTop: '16px' }}>
    {/* Hero image skeleton */}
    <div className="skeleton" style={{ height: '380px', width: '100%', borderRadius: '16px', marginBottom: '28px' }} />

    {/* Tags row skeleton */}
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      {[80, 100, 120].map(w => (
        <div key={w} className="skeleton" style={{ height: '36px', width: `${w}px`, borderRadius: '100px' }} />
      ))}
    </div>

    {/* Weather skeleton */}
    <div className="skeleton" style={{ height: '60px', borderRadius: '12px', marginBottom: '20px' }} />

    {/* Hotels section */}
    <div style={{ marginBottom: '48px' }}>
      <div className="skeleton" style={{ height: '36px', width: '260px', borderRadius: '8px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <div className="skeleton" style={{ height: '170px', borderRadius: '12px 12px 0 0' }} />
            <div className="skeleton" style={{ height: '90px', borderRadius: '0 0 12px 12px', marginTop: '2px' }} />
          </div>
        ))}
      </div>
    </div>

    {/* Itinerary section */}
    <div>
      <div className="skeleton" style={{ height: '36px', width: '220px', borderRadius: '8px', marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[1, 2].map(i => (
          <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
