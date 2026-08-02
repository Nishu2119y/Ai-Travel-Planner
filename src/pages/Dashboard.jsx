import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../service/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Plus, Clock, User, Plane, Globe, 
  Heart, Star, ArrowRight, Search, Bookmark, History 
} from 'lucide-react';
import RecentSearches from '../components/custom/RecentSearches';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [trips, setTrips] = useState({
    upcoming: [],
    saved: [],
    recent: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null); // Allow anonymous access to see local history
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const anonIds = JSON.parse(localStorage.getItem('anonymousTrips') || '[]');
      let allTrips = [];

      if (user) {
        // 1. Fetch User Trips
        const q = query(
          collection(db, 'AITrips'), 
          where('userEmail', '==', user.email)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => allTrips.push({ id: doc.id, ...doc.data() }));
      } else if (anonIds.length > 0) {
        // 1. Fetch Anonymous Trips from localStorage IDs
        for (const id of anonIds) {
          const docSnap = await getDocs(query(collection(db, 'AITrips'), where('id', '==', id)));
          if (!docSnap.empty) {
             allTrips.push({ id: docSnap.docs[0].id, ...docSnap.docs[0].data() });
          }
        }
      }

      // Client-side sort
      allTrips.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      // 2. Categorize
      const upcoming = allTrips.slice(0, 10);
      const saved = allTrips.filter(t => t.isSaved === true);
      
      // 3. Recent Searches (from localStorage)
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

      setTrips({
        upcoming: upcoming,
        saved: saved,
        recent: recentSearches
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: Plane },
    { id: 'saved', label: 'Saved (Wishlist)', icon: Bookmark }
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#050505] pt-32 px-6">
       <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-20 w-1/3 skeleton rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
               <div className="w-1 h-8 bg-orange-500 rounded-full" />
               <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Personal Control Center</span>
            </div>
            <h1 className="font-heading text-7xl md:text-9xl text-white leading-[0.8] mb-4">
              COMMAND <span className="text-orange-500">HUB</span>
            </h1>
            <p className="text-white/40 text-lg max-w-md font-body">Manage your upcoming odysseys and explore your travel history.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 p-6 bg-surface border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <img 
              src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}`} 
              className="w-16 h-16 rounded-2xl border-2 border-orange-500/20 group-hover:border-orange-500/50 transition-all z-10" 
              alt="Profile"
            />
            <div className="z-10">
              <div className="text-white font-heading text-2xl leading-none mb-1">Agent {user?.name.split(' ')[0].toUpperCase()}</div>
              <div className="text-orange-500/60 text-[10px] font-bold tracking-[0.2em] uppercase">{user?.email}</div>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Recent Searches */}
        <RecentSearches user={user} onRefresh={fetchDashboardData} />

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-16 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl transition-all relative ${
                activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/30 hover:text-white/50'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-orange-500 rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon size={18} className="relative z-10" />
              <span className="font-heading text-lg tracking-wider uppercase relative z-10">{tab.label}</span>
              <span className={`relative z-10 ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${activeTab === tab.id ? 'bg-black/20 text-white' : 'bg-white/5 text-white/40'}`}>
                {tab.id === 'recent' ? trips.recent.length : trips[tab.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[400px]"
          >
            {activeTab === 'recent' ? (
              <div className="space-y-4">
                {trips.recent.length > 0 ? trips.recent.map((search, i) => (
                  <div key={i} className="glass-card-light p-6 flex items-center justify-between group hover:border-orange-500/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Search size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-heading">{search.location}</h3>
                        <p className="text-sm text-white/30 font-body">{search.date}</p>
                      </div>
                    </div>
                    <Link to={search.tripId ? `/view-trip/${search.tripId}` : "/create-trip"} className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="btn-primary text-[10px] py-2 px-4">
                         {search.tripId ? "Revisit Odyssey" : "Research"} <ArrowRight size={12} />
                       </button>
                    </Link>
                  </div>
                )) : (
                  <EmptyState icon={Search} title="No recent searches" />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trips[activeTab].length > 0 ? trips[activeTab].map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} />
                )) : (
                  <div className="col-span-full">
                    <EmptyState 
                      icon={activeTab === 'saved' ? Heart : Plane} 
                      title={activeTab === 'saved' ? "Your wishlist is empty" : "No upcoming adventures"} 
                      action={true}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TripCard({ trip }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/view-trip/${trip.id}`} className="group block h-full">
        <div className="bg-surface/40 border border-white/5 rounded-[2.5rem] overflow-hidden group-hover:border-orange-500/30 transition-all h-full flex flex-col shadow-2xl">
          <div className="h-64 relative overflow-hidden">
            <img 
              src={trip.TripData?.locationImageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
              alt={trip.userSelection?.location?.label}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            <div className="absolute top-6 left-6">
               <div className="px-4 py-1.5 bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                 {trip.userSelection?.budget}
               </div>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
               <MapPin size={12} className="text-orange-500" />
               <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Destination</span>
            </div>
            <h3 className="font-heading text-3xl text-white mb-6 leading-[0.9] tracking-tight">
              {trip.userSelection?.location?.label?.split(',')[0] || 'Unknown Odyssey'}
            </h3>
            
            <div className="flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-orange-500/50" /> {trip.userSelection?.noOfDays} Days</span>
              <span className="flex items-center gap-2"><User size={14} className="text-orange-500/50" /> {trip.userSelection?.travelers}</span>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/20">Planned {new Date(trip.createdAt).toLocaleDateString()}</span>
              <div className="text-orange-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest">Open</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
       <div className="w-24 h-24 rounded-full bg-orange-500/5 flex items-center justify-center text-orange-500/20 mb-8 border border-orange-500/10">
         <Icon size={40} />
       </div>
       <h3 className="text-4xl text-white font-heading mb-6 tracking-wide uppercase">{title}</h3>
       {action && (
         <Link to="/create-trip">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] py-4 px-10 rounded-full transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3">
              Commence New Search <Plus size={16} />
            </button>
         </Link>
       )}
    </div>
  );
}

export default Dashboard;
