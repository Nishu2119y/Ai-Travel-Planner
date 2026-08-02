import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlaceCardItem from './PlaceCardItem';
import StayRecommendations from './StayRecommendations';
import { getWeatherForDestination } from '../../../lib/weather';
import { getRoute } from '../../../lib/maps';
import { MapPin, Wind, Thermometer, Route } from 'lucide-react';

function PlacesToVisit({ trip }) {
  const location = trip?.userSelection?.location?.label || trip?.TripData?.location || 'this location';

  if (!trip?.TripData?.itinerary || !Array.isArray(trip.TripData.itinerary)) {
    return (
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#f5f0e8', marginBottom: '12px' }}>PLACES TO VISIT</h2>
        <p style={{ color: 'rgba(245,240,232,0.45)' }}>No itinerary data available.</p>
      </div>
    );
  }

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!location || location === 'this location') return;
    setWeatherLoading(true);
    getWeatherForDestination(location)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }, [location]);

  useEffect(() => {
    const itinerary = trip?.TripData?.itinerary;
    if (!itinerary?.length) return;
    const firstHotel = trip?.TripData?.hotels?.[0] || trip?.TripData?.hotelOptions?.[0];
    let startName = firstHotel?.hotelName;
    let startCoords = firstHotel?.geoCoordinates;
    if (!startName && itinerary[0]?.places?.length > 0) {
      startName = itinerary[0].places[0].placeName;
      startCoords = itinerary[0].places[0].geoCoordinates;
    }
    const lastDay = itinerary[itinerary.length - 1];
    const lastPlace = lastDay?.places?.[lastDay.places.length - 1];
    const endName = lastPlace?.placeName || trip?.TripData?.location;
    const endCoords = lastPlace?.geoCoordinates;
    if (!startName || !endName) return;
    setRouteLoading(true);
    getRoute({ name: startName, coords: startCoords }, { name: endName, coords: endCoords })
      .then(setRoute)
      .catch(() => {
        if (trip?.routes) setRoute({ distance: trip.routes.distance, duration: trip.routes.travelTime });
        else setRoute(null);
      })
      .finally(() => setRouteLoading(false));
  }, [trip]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ marginBottom: '48px' }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div className="section-label section-label-left" style={{ marginBottom: '4px' }}>Day by Day</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#f5f0e8', margin: 0, lineHeight: 1 }}>
            PLACES TO VISIT
          </h2>
        </div>

        {/* Live weather chip */}
        <div className="glass-card-dark" style={{ padding: '10px 18px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {weatherLoading ? (
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', color: 'rgba(245,240,232,0.4)' }}>Fetching weather…</span>
          ) : weather ? (
            <>
              <span style={{ fontSize: '16px' }}>{weather.icon}</span>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', color: '#f5f0e8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={12} style={{ color: 'var(--orange)' }} />{weather.temperature}°C
              </span>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wind size={12} style={{ color: 'var(--orange)' }} />{weather.windspeed} km/h
              </span>
            </>
          ) : (
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', color: 'rgba(245,240,232,0.35)' }}>Weather unavailable</span>
          )}
        </div>
      </div>

      {/* Itinerary days */}
      <div className="space-y-16">
        {trip.TripData.itinerary.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.8 }}
            className="relative"
          >
            {/* Cinematic Day Header */}
            <div className="flex items-center gap-6 mb-12">
               <div className="relative">
                  <div className="w-16 h-16 bg-surface border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                     <span className="font-heading text-4xl text-orange-500 relative z-10">{index + 1}</span>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500/20 blur-xl rounded-full" />
               </div>
               <div>
                  <div className="text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-1">
                    Timeline Phase {index + 1}
                  </div>
                  <h3 className="font-heading text-3xl text-white uppercase tracking-wider">
                    {day.title || `Day ${day.day || index + 1}`}
                  </h3>
               </div>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative pl-10 sm:pl-20">
               {/* The Vertical Line */}
               <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-orange-500 via-orange-500/20 to-transparent" />

               {day.places && day.places.length > 0 ? (
                 <div className="space-y-20">
                   {day.places.map((place, idx) => (
                     <motion.div 
                       key={idx} 
                       className="relative"
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.1 }}
                     >
                       {/* Timeline Node (Glow Dot) */}
                       <div className="absolute -left-[35px] sm:-left-[51px] top-8 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_15px_var(--orange)] z-10" />
                       
                       {/* Time Indicator */}
                       <div className="absolute -left-[100px] sm:-left-[160px] top-7 text-[9px] font-black text-white/10 uppercase tracking-[0.3em] w-20 sm:w-32 text-right">
                         {idx === 0 ? '09:00 AM' : idx === 1 ? '11:30 AM' : idx === 2 ? '02:00 PM' : idx === 3 ? '04:30 PM' : idx === 4 ? '07:00 PM' : '09:30 PM'}
                       </div>

                       <div className="glass-card-premium p-1 overflow-hidden">
                          <PlaceCardItem place={place} />
                       </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <p className="text-white/20 text-sm italic py-8">Rest and recharge for the next chapter.</p>
               )}
            </div>

            {/* Stay Section */}
            <div className="mt-20 ml-6 sm:ml-10 pl-4 sm:pl-10 border-l border-white/5">
              <StayRecommendations location={location} dayLabel={`Day ${day.day || index + 1}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Route Summary */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Route size={18} style={{ color: 'var(--orange)' }} />
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', color: '#f5f0e8', margin: 0 }}>Trip Route Summary</h3>
        </div>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.4)', marginBottom: '16px' }}>Estimated ground travel between your first and last stops.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(216,83,42,0.1)', border: '1px solid rgba(216,83,42,0.25)', borderRadius: '100px', padding: '10px 20px' }}>
          {routeLoading ? (
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.4)' }}>Calculating route…</span>
          ) : route ? (
            <>
              <MapPin size={14} style={{ color: 'var(--orange)' }} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', color: '#f5f0e8' }}>
                {route.distance} km · {route.duration} mins
              </span>
            </>
          ) : (
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.35)' }}>Route data unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PlacesToVisit;
