import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import SearchBar from '../components/custom/SearchBar';
import DestinationGrid from '../components/custom/DestinationGrid';
import { useCurrency } from '../context/CurrencyContext';

const DESTINATIONS = [
  { id: 1, name: 'Santorini',    country: 'Greece',    rating: 4.9, price: 1800, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tags: ['Romantic','Beach'], climate: 'Mediterranean' },
  { id: 2, name: 'Bali',         country: 'Indonesia', rating: 4.8, price: 900,  img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tags: ['Cultural','Beach'], climate: 'Tropical' },
  { id: 3, name: 'Patagonia',    country: 'Argentina', rating: 4.9, price: 2200, img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', tags: ['Adventure'], climate: 'Subpolar' },
  { id: 4, name: 'Kyoto',        country: 'Japan',     rating: 4.8, price: 1400, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', tags: ['Cultural'], climate: 'Temperate' },
  { id: 5, name: 'Amalfi Coast', country: 'Italy',     rating: 4.7, price: 2100, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80', tags: ['Scenic','Romantic'], climate: 'Mediterranean' },
  { id: 6, name: 'Machu Picchu', country: 'Peru',      rating: 5.0, price: 1600, img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80', tags: ['Adventure','Cultural'], climate: 'Highland' },
  { id: 7, name: 'Iceland',      country: 'Iceland',   rating: 4.9, price: 2500, img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', tags: ['Adventure'], climate: 'Subarctic' },
  { id: 8, name: 'Maldives',     country: 'Maldives',  rating: 4.9, price: 3200, img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80', tags: ['Beach','Romantic'], climate: 'Tropical' },
  { id: 9, name: 'Morocco',      country: 'Morocco',   rating: 4.6, price: 1100, img: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80', tags: ['Cultural','Adventure'], climate: 'Arid' },
  // Expanded Mock Data for Lazy Loading Test
  { id: 10, name: 'Swiss Alps',  country: 'Switzerland', rating: 4.9, price: 2800, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80', tags: ['Adventure','Scenic'], climate: 'Alpine' },
  { id: 11, name: 'Dubai',       country: 'UAE',       rating: 4.7, price: 1900, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tags: ['Cultural'], climate: 'Desert' },
  { id: 12, name: 'Phuket',      country: 'Thailand',  rating: 4.5, price: 850,  img: 'https://images.unsplash.com/photo-1589394815804-964ce0ff96f8?w=600&q=80', tags: ['Beach'], climate: 'Tropical' },
  { id: 13, name: 'Paris',       country: 'France',    rating: 4.8, price: 1750, img: 'https://images.unsplash.com/photo-1502602881462-8c9735231713?w=600&q=80', tags: ['Romantic','Cultural'], climate: 'Temperate' },
  { id: 14, name: 'Bora Bora',   country: 'Fr. Polynesia', rating: 5.0, price: 4200, img: 'https://images.unsplash.com/photo-1589552636294-817eb4be6bf7?w=600&q=80', tags: ['Beach','Romantic'], climate: 'Tropical' },
  { id: 15, name: 'Cape Town',   country: 'South Africa', rating: 4.7, price: 1300, img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', tags: ['Adventure','Scenic'], climate: 'Mediterranean' },
  { id: 16, name: 'Banff',       country: 'Canada',    rating: 4.9, price: 1500, img: 'https://images.unsplash.com/photo-1524312686733-4f9011707253?w=600&q=80', tags: ['Adventure','Scenic'], climate: 'Alpine' },
  { id: 17, name: 'New York',    country: 'USA',       rating: 4.6, price: 2100, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tags: ['Cultural'], climate: 'Temperate' },
  { id: 18, name: 'Rio de Janeiro',country: 'Brazil',  rating: 4.5, price: 1150, img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80', tags: ['Beach','Cultural'], climate: 'Tropical' },
  { id: 19, name: 'Venice',      country: 'Italy',     rating: 4.7, price: 1850, img: 'https://images.unsplash.com/photo-1516483638261-f40af5ff5f22?w=600&q=80', tags: ['Romantic','Cultural'], climate: 'Mediterranean' },
  { id: 20, name: 'Queenstown',  country: 'New Zealand', rating: 4.9, price: 2300, img: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80', tags: ['Adventure','Scenic'], climate: 'Temperate' },
  { id: 21, name: 'Jaipur',      country: 'India',     rating: 4.6, price: 700,  img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', tags: ['Cultural'], climate: 'Semi-arid' },
  { id: 22, name: 'Prague',      country: 'Czechia',   rating: 4.7, price: 1050, img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&q=80', tags: ['Cultural','Romantic'], climate: 'Temperate' },
];

const SORT_OPTIONS = ['Most Popular', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('Most Popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(5000);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const { formatPrice } = useCurrency();

  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const sorted = [...DESTINATIONS]
    .filter(d => d.price <= priceMax)
    .filter(d => selectedTags.length === 0 || d.tags.some(t => selectedTags.includes(t)))
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Highest Rated') return b.rating - a.rating;
      return 0;
    });

  const allTags = ['Beach', 'Adventure', 'Cultural', 'Romantic', 'Scenic'];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Search Strip */}
      <div style={{ background: 'var(--teal-dark)', borderBottom: '1px solid rgba(216,83,42,0.15)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SearchBar compact initialValues={{ destination: searchParams.get('destination') || '' }} />
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* Sidebar Filters */}
        <aside style={{ width: '260px', flexShrink: 0, position: 'sticky', top: '90px' }} className="hidden lg:block">
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--orange)' }} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5f0e8' }}>Filters</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: '12px' }}>Max Price</div>
              <input type="range" min="500" max="5000" step="100" value={priceMax} onChange={e => setPriceMax(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--orange)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.6)' }}>
                <span>{formatPrice(500)}</span><span style={{ color: 'var(--orange)', fontWeight: 600 }}>{formatPrice(priceMax)}</span>
              </div>
            </div>

            {/* Activities */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: '12px' }}>Activity Type</div>
              {allTags.map(tag => (
                <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                  <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} style={{ accentColor: 'var(--orange)', width: '16px', height: '16px' }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: 'rgba(245,240,232,0.75)' }}>{tag}</span>
                </label>
              ))}
            </div>

            <button className="btn-outline" onClick={() => { setPriceMax(5000); setSelectedTags([]); }} style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '8px' }}>
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Main Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(245,240,232,0.55)', fontSize: '14px' }}>
              <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '18px' }}>{sorted.length}</span> destinations found
            </div>
            <div style={{ position: 'relative' }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background: 'rgba(15,20,26,0.8)', border: '1px solid rgba(216,83,42,0.3)', borderRadius: '8px', color: '#f5f0e8', fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.08em', padding: '8px 36px 8px 14px', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
                {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--orange)', pointerEvents: 'none' }} />
            </div>
          </div>

          <DestinationGrid destinations={sorted} />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
