import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebase';
import { sendChatMessage } from '../service/AIModal';
import { searchPlaces } from '../lib/search';
import { getWeatherForDestination } from '../lib/weather';
import demoTrips from '../data/demoTrips.json';
import { AI_PROMPT } from '../constants/options';

// Placeholder for OpenRouteService
const getRoutes = async (destination) => {
  // In a real app with VITE_OPENROUTE_API_KEY, you'd hit the API here.
  // For now, return a safe simulated route structure.
  return {
    status: 'Demo Route',
    travelTime: '30 mins approx',
    distance: '15 km'
  };
};

export const generatePlan = async (formData) => {
  const destinationLabel = formData?.location?.label || 'Unknown';
  
  // Robust Cache Check: key binds to destination, days, and budget
  const cacheKey = `trip_plan_${destinationLabel.toLowerCase()}_${formData.noOfDays}_${formData.budget}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      // Validate cache expiration (24 hours = 86400000ms)
      if (Date.now() - parsed.cachedAt < 86400000) {
        console.log('Returning fresh valid cached plan without burning APIs');
        return parsed.data;
      } else {
        console.log('Cache expired, purging old data...');
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
       console.warn('Cache parse failed for trip plan, re-running logic.');
    }
  }

  // Rate Limiting Check (occurs AFTER cache check so cached hits are free)
  const rateLimitKey = 'user_api_usage';
  let usage = { count: 0, resetAt: Date.now() + 86400000 };
  
  try {
    const rawUsage = localStorage.getItem(rateLimitKey);
    if (rawUsage) {
       const parsedUsage = JSON.parse(rawUsage);
       if (Date.now() > parsedUsage.resetAt) {
          // Reset after 24 hrs
          usage = { count: 0, resetAt: Date.now() + 86400000 };
       } else {
          usage = parsedUsage;
       }
    }
  } catch (e) {}

  if (usage.count >= 3) {
    console.warn("User exceeded maximum 3 API calls! Switching automatically to Demo Mode.");
    // Throw an error that bypasses the tries below and lands directly in the fallback handler
    throw new Error("Local Rate Limit Reached");
  }

  try {
    // Increment specific API counter since we are proceeding with a network call
    usage.count += 1;
    localStorage.setItem(rateLimitKey, JSON.stringify(usage));

    // 1. Check Global Firestore Cache (Backend Caching)
    const q = query(
      collection(db, "AITrips"),
      where("userSelection.location.label", "==", destinationLabel),
      where("userSelection.noOfDays", "==", formData.noOfDays),
      where("userSelection.budget", "==", formData.budget)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log('Found existing itinerary in Firestore! Serving cached version...');
      const cachedTrip = querySnapshot.docs[0].data();
      return { ...cachedTrip, id: querySnapshot.docs[0].id, isCached: true };
    }

    // AI Generation
    const FINAL_PROMPT = AI_PROMPT
      .replace(/{location}/g, destinationLabel)
      .replace(/{totalDays}/g, formData.noOfDays)
      .replace(/{travelers}/g, formData.travelers)
      .replace(/{budget}/g, formData.budget);

    const aiResult = await sendChatMessage(FINAL_PROMPT);
    const aiText = aiResult.response.text();
    
    const startIndex = aiText.indexOf('{');
    const endIndex = aiText.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid JSON format from AI');
    }
    
    const jsonString = aiText.substring(startIndex, endIndex + 1);
    const tripItineraryData = JSON.parse(jsonString);

    // Parallel API Fetching for External Contexts
    const [tavilyData, weatherData, routeData] = await Promise.allSettled([
      searchPlaces(destinationLabel),
      getWeatherForDestination(destinationLabel),
      getRoutes(destinationLabel)
    ]);

    // Construct the Master Object
    const combinedData = {
      isDemo: false,
      userSelection: formData,
      TripData: tripItineraryData,
      tavilyData: tavilyData.status === 'fulfilled' ? tavilyData.value : null,
      weather: weatherData.status === 'fulfilled' ? weatherData.value : null,
      routes: routeData.status === 'fulfilled' ? routeData.value : null,
      userEmail: formData.userEmail || 'anonymous',
      createdAt: new Date().toISOString()
    };

    // Save to Firestore for future caching
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), combinedData);
    
    return { ...combinedData, id: docId };

  } catch (error) {
    console.error("Critical failure during plan generation, rate limit or API error detected:", error);
    
    // Fallback to Demo Mode lookup
    let baseLocation = destinationLabel.split(',')[0].trim().toLowerCase();
    
    let fallbackTrip = demoTrips[baseLocation];
    // If we don't have a specific demo match, just serve a safe generic one (e.g. Paris)
    if (!fallbackTrip) {
      fallbackTrip = demoTrips['paris'];
    }

    const demoCombinedData = {
      ...fallbackTrip,
      userSelection: formData,
      createdAt: new Date().toISOString()
    };

    return demoCombinedData;
  }
};
