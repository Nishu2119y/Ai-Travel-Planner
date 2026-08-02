const WMO_WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌧️❄️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️❄️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌧️❄️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️❄️' },
  71: { description: 'Slight snow fall', icon: '❄️' },
  73: { description: 'Moderate snow fall', icon: '❄️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
};

const DEMO_WEATHER = {
  temperature: 24,
  windspeed: 12,
  weathercode: 1,
  description: 'Mainly clear',
  icon: '🌤️'
};

/**
 * Fetches the current weather for a specific latitude and longitude.
 */
export const getWeather = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API fetch failed');

    const data = await response.json();
    const current = data.current_weather;
    const weatherInfo = WMO_WEATHER_CODES[current.weathercode] || { description: 'Unknown', icon: '🌈' };

    return {
      temperature: current.temperature,
      windspeed: current.windspeed,
      weathercode: current.weathercode,
      description: weatherInfo.description,
      icon: weatherInfo.icon
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

/**
 * Resolves a destination string to coordinates via Geocoding, then fetches weather.
 */
export const getWeatherForDestination = async (destinationStr) => {
  if (!destinationStr) return null;

  // Simple caching
  const cacheKey = destinationStr;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      // Cache for 1 hour approx based on timestamp
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.data;
      }
    } catch(e) {}
  }

  try {
    // 1. Geocode the destination (clean the string to just the city name to improve match rate)
    const cleanDestination = destinationStr.split(',')[0].trim();
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanDestination)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error('Geocoding API failed');
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
       console.warn(`No coordinates found for destination: ${destinationStr}`);
       return null;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Fetch the weather
    const weatherPayload = await getWeather(latitude, longitude);

    // 3. Save to Cache
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: weatherPayload
    }));

    return weatherPayload;
  } catch (error) {
    console.error("Error in auto-weather resolution:", error);
    return null;
  }
};
