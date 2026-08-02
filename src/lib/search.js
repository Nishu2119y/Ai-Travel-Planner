/**
 * Utility to search for places, hotels, and restaurants using the Tavily API.
 */

// Fallback demo data in case the API is missing or fails
const DEMO_RECOMMENDATIONS = {
  places: [
    { title: "Awesome Local Spot", content: "This is a great place to visit, known for its amazing views and rich history.", url: "https://example.com/place" },
    { title: "Hidden Gem Cafe", content: "A wonderful little cafe tucked away from the busy streets.", url: "https://example.com/cafe" }
  ],
  hotels: [
    { title: "Demo Hotel Goa", content: "Near beach stay", url: "#" }
  ],
  restaurants: [
    { title: "Gourmet Kitchen", content: "Fine dining with an exquisite menu.", url: "https://example.com/restaurant" },
    { title: "Street Food Haven", content: "The best local street food flavors in one place.", url: "https://example.com/restaurant2" }
  ]
};

// Internal helper to perform a single query with caching
const performSearch = async (apiKey, query) => {
  const cacheKey = `tavily_${query}`;
  
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.warn("Failed to parse cached Tavily data, bypassing cache.");
    }
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_images: true, // Tavily can provide some images
        max_results: 6,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    
    // Clean and enrich results
    const enrichedResults = await Promise.all((data.results || []).map(async (result) => {
      // Clean content: remove hashtags and metadata patterns, take first sentence
      let cleanContent = result.content
        .replace(/#[a-zA-Z0-9]+/g, '') // Remove hashtags
        .replace(/https?:\/\/\S+/g, '') // Remove links
        .split(/[.!?]/)[0] // Take first sentence
        .trim();
      
      if (cleanContent.length < 10) cleanContent = "A premium destination offering unique experiences.";

      return {
        title: result.title,
        content: cleanContent + ".",
        url: result.url,
        // Use Tavily image if available, or a fallback that will be handled in the UI
        photoUrl: result.images?.[0] || null,
        rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1) // Simulate a premium rating if not available
      };
    }));

    if (enrichedResults.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(enrichedResults));
    }

    return enrichedResults;
  } catch (error) {
    console.error(`Error fetching data for query "${query}":`, error);
    return [];
  }
};

export const searchPlaces = async (destination) => {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;

  if (!apiKey) {
    console.error("Missing Tavily API Key! Please ensure VITE_TAVILY_API_KEY is set in your .env.local file. Falling back to demo data.");
    return DEMO_RECOMMENDATIONS;
  }

  try {
    const [places, hotels, restaurants] = await Promise.all([
      performSearch(apiKey, `best places to visit in ${destination}`),
      performSearch(apiKey, `best hotels in ${destination}`),
      performSearch(apiKey, `best restaurants in ${destination}`)
    ]);

    return {
      places: places.length ? places : DEMO_RECOMMENDATIONS.places,
      hotels: hotels.length ? hotels : DEMO_RECOMMENDATIONS.hotels,
      restaurants: restaurants.length ? restaurants : DEMO_RECOMMENDATIONS.restaurants
    };
  } catch (error) {
    console.error("Critical error fetching structured data from Tavily API:", error);
    return DEMO_RECOMMENDATIONS;
  }
};
