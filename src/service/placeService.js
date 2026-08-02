import { GetPlaceDetails } from "./GlobalApi";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

/**
 * Fetches place details from Google Places API v1.
 * @param {string} placeName - The name of the place.
 * @returns {Promise<Object|null>} Metadata including photo URL, rating, and opening hours.
 */
export const getPlaceMetadata = async (placeName) => {
  if (!GOOGLE_API_KEY) {
    console.error("Google Place API key is missing.");
    return null;
  }

  try {
    const data = { textQuery: placeName };
    const response = await GetPlaceDetails(data);
    const place = response.data.places?.[0];

    if (!place) return null;

    let photoUrl = null;
    if (place.photos && place.photos.length > 0) {
      // Construct photo URL from resource name
      // Example name: places/PLACE_ID/photos/PHOTO_ID
      const photoName = place.photos[0].name;
      photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_API_KEY}&maxHeightPx=800`;
    }

    return {
      id: place.id,
      displayName: place.displayName?.text,
      photoUrl: photoUrl,
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      openingHours: place.regularOpeningHours?.weekdayDescriptions,
      isOpenNow: place.regularOpeningHours?.openNow,
      location: place.location
    };
  } catch (error) {
    console.error("Error fetching place metadata:", error);
    return null;
  }
};
