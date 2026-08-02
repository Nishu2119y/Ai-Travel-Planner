import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../service/firebase';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Plus, Clock, User, Plane, Globe, Heart, Star, ArrowRight } from 'lucide-react';

function MyTrips() {
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) { setUser(JSON.parse(storedUser)); }
    else { navigate('/'); return; }
  }, [navigate]);

  useEffect(() => { if (user) fetchUserTrips(); }, [user]);

  const fetchUserTrips = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
      const snap = await getDocs(q);
      const trips = [];
      snap.forEach(doc => trips.push({ id: doc.id, ...doc.data() }));
      if (trips.length > 0) {
        trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTrips(trips);
        localStorage.setItem('userTrips', JSON.stringify(trips));
      } else {
        const local = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const mine = local.filter(t => t.userEmail === user.email);
        mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTrips(mine);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const mine = local.filter(t => t.userEmail === user.email);
      mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserTrips(mine);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '120px', padding: '120px 24px 48px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ height: '48px', background: 'rgba(27,59,66,0.4)', borderRadius: '8px', width: '300px', marginBottom: '24px' }} className="skeleton" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '12px' }} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '48px' }}>
          <div className="section-label section-label-left" style={{ marginBottom: '12px' }}>Your Travel Collection</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#f5f0e8', margin: 0, lineHeight: 0.9 }}>
              MY <span style={{ color: 'var(--orange)' }}>ADVENTURES</span>
            </h1>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D8532A&color=fff&size=40`}
                  alt={user.name} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(216,83,42,0.5)', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#f5f0e8' }}>Welcome back, {user.name.split(' ')[0]}! ✈️</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', color: 'rgba(245,240,232,0.45)' }}>Ready for your next adventure?</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {userTrips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              { icon: Plane,  label: 'Total Trips',  val: userTrips.length, color: '#D8532A' },
              { icon: Calendar, label: 'Days Planned', val: userTrips.reduce((a, t) => a + (parseInt(t.userSelection?.noOfDays) || 0), 0), color: '#1B8A7C' },
              { icon: Globe,  label: 'Destinations', val: new Set(userTrips.map(t => t.userSelection?.location?.label)).size, color: '#1B3B8A' },
              { icon: Heart,  label: 'Memories',     val: '∞',              color: '#8A1B5C' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', background: `${s.color}18`, border: `1px solid ${s.color}44`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#f5f0e8', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Plan New Trip Button */}
        <div style={{ marginBottom: '32px' }}>
          <Link to="/create-trip">
            <motion.button className="btn-primary" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ fontSize: '13px', padding: '12px 28px' }}>
              <Plus size={16} /> Plan New Adventure <ArrowRight size={15} />
            </motion.button>
          </Link>
        </div>

        {/* Trips Grid */}
        {userTrips.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {userTrips.map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/view-trip/${trip.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div className="travel-card" whileHover={{ y: -6 }} style={{ background: 'var(--dark-2)' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                      <img className="travel-card-img"
                        src={trip.TripData?.locationImageUrl || trip.userSelection?.locationImageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'}
                        alt={trip.userSelection?.location?.label || 'Trip'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'; }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,20,26,0.85) 0%, transparent 60%)' }} />
                      <div className="tag tag-orange" style={{ position: 'absolute', top: '14px', right: '14px' }}>{trip.userSelection?.budget}</div>
                      <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(15,20,26,0.7)', backdropFilter: 'blur(8px)', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={11} style={{ color: '#f0a330', fill: '#f0a330' }} />
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', color: '#f5f0e8' }}>AI Planned</span>
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#f5f0e8', margin: '0 0 4px' }}>{trip.userSelection?.location?.label}</h3>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(245,240,232,0.45)', fontSize: '13px' }}>
                          <Calendar size={12} style={{ color: 'var(--orange)' }} />{trip.userSelection?.noOfDays} days
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(245,240,232,0.45)', fontSize: '13px' }}>
                          <User size={12} style={{ color: 'var(--orange)' }} />{trip.userSelection?.travelers}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(245,240,232,0.35)', fontSize: '12px' }}>
                          <Clock size={11} />
                          {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </div>
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)' }}>View Details →</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ width: '100px', height: '100px', background: 'rgba(216,83,42,0.12)', border: '2px solid rgba(216,83,42,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <Plane size={44} style={{ color: 'var(--orange)' }} />
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#f5f0e8', marginBottom: '12px' }}>YOUR JOURNEY STARTS HERE</h2>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '16px', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
              Ready to explore the world? Create your first AI-powered itinerary and discover amazing destinations.
            </p>
            <Link to="/create-trip">
              <motion.button className="btn-primary" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ fontSize: '14px', padding: '14px 36px' }}>
                <Plus size={16} /> Plan Your First Adventure <ArrowRight size={15} />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
