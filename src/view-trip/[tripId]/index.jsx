import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../service/firebase';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import BudgetBreakdown from '../../components/custom/BudgetBreakdown';
import EcoFriendlySuggestions from '../../components/custom/EcoFriendlySuggestions';
import RecommendedPlaces from './components/RecommendedPlaces';
import FloatingBudgetTracker from '../../components/custom/FloatingBudgetTracker';

function ViewTrip() {
  const { tripId } = useParams();

  // Force dark background
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--dark, #0f141a)';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) GetTripData();
  }, [tripId]);

  const getDemoTrip = () => ({
    userSelection: {
      location: { label: 'Paris, France' },
      noOfDays: '5',
      budget: 'Moderate',
      travelers: '2 People',
    },
    TripData: {
      location: 'Paris, France',
      locationImageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
      bestTimeToVisit: 'April to June and September to November offer the best weather with mild temperatures and fewer crowds.',
      hotels: [
        { hotelName: 'Hotel des Grands Boulevards', hotelAddress: '17 Boulevard Poissonnière, 75002 Paris', price: '€120-180/night', hotelImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', geoCoordinates: '48.8708, 2.3439', rating: 4.3, description: 'Charming boutique hotel in the heart of Paris.' },
        { hotelName: 'Le Marais Hotel', hotelAddress: '8 Rue des Mauvais Garçons, 75004 Paris', price: '€90-140/night', hotelImageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', geoCoordinates: '48.8566, 2.3522', rating: 4.1, description: 'Historic hotel in Le Marais district.' },
      ],
      itinerary: [
        { day: '1', title: 'Iconic Paris', places: [
          { placeName: 'Eiffel Tower', placeDetails: 'Iconic iron lattice tower and symbol of Paris', placeImageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400', geoCoordinates: '48.8584, 2.2945', ticketPricing: '€29.40', timeToTravel: '2-3 hours', rating: 4.6 },
          { placeName: 'Seine River Cruise', placeDetails: 'Scenic boat tour along the Seine River', placeImageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400', geoCoordinates: '48.8566, 2.3522', ticketPricing: '€15', timeToTravel: '1 hour', rating: 4.4 },
        ]},
        { day: '2', title: 'Art & Culture', places: [
          { placeName: 'Louvre Museum', placeDetails: "World's largest art museum and historic monument", placeImageUrl: 'https://images.unsplash.com/photo-1566139992930-b159fc2c2ad6?w=400', geoCoordinates: '48.8606, 2.3376', ticketPricing: '€17', timeToTravel: '3-4 hours', rating: 4.5 },
        ]},
      ],
    },
  });

  const GetTripData = async () => {
    setLoading(true);
    if (tripId === 'demo') {
      setTimeout(() => { setTrip(getDemoTrip()); setLoading(false); }, 1000);
      return;
    }
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTrip(data);
        localStorage.setItem(`trip_${tripId}`, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(`trip_${tripId}`);
        if (stored) { setTrip(JSON.parse(stored)); }
        else { toast.error('No trip found!'); }
      }
    } catch (error) {
      console.error('Firebase error, trying localStorage:', error);
      const stored = localStorage.getItem(`trip_${tripId}`);
      if (stored) { setTrip(JSON.parse(stored)); }
      else { toast.error('Failed to fetch trip data!'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {loading && <SkeletonLoader />}

        {!loading && trip && (
          <>
            <InfoSection trip={trip} />
            <Hotels trip={trip} />
            <PlacesToVisit trip={trip} />
            <BudgetBreakdown trip={trip} />
            <EcoFriendlySuggestions tripData={trip} />
            <RecommendedPlaces trip={trip} />
            <FloatingBudgetTracker />
          </>
        )}

        {!loading && !trip && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: 'rgba(245,240,232,0.3)', marginBottom: '16px' }}>NO TRIP FOUND</div>
            <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: '15px' }}>We couldn't find this trip. It may have been deleted or the link is invalid.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTrip;
