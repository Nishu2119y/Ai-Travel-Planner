const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Model priority chain: try each in order on failure/quota issues
const MODEL_CHAIN = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

// Retry configuration for rate-limit (429) errors
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 3000; // 3 seconds base delay
const MAX_TOTAL_TIMEOUT_MS = 60000; // 60 second absolute timeout to prevent infinite loops

/**
 * Sleep helper for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely extract and parse JSON from a model response that may contain markdown fences
 */
const parseJSON = (text, arrayMode = false) => {
  // Strip markdown code fences if present
  const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const open = arrayMode ? '[' : '{';
  const close = arrayMode ? ']' : '}';
  const start = stripped.indexOf(open);
  const end = stripped.lastIndexOf(close);
  if (start === -1 || end === -1 || end <= start) {
    console.error('parseJSON: no valid JSON found in:', stripped.slice(0, 300));
    throw new Error('No valid JSON in AI response');
  }
  return JSON.parse(stripped.substring(start, end + 1));
};

/**
 * Check if an error is a retryable quota/rate-limit error
 */
const isQuotaError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  const status = error?.status || error?.httpStatusCode;
  return (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('rate') ||
    msg.includes('resource has been exhausted') ||
    msg.includes('too many requests')
  );
};

/**
 * Call Groq chat completions API
 * @param {Array} messages - Array of {role, content} message objects
 * @param {object} options - temperature, max_tokens, response_format, etc.
 * @returns {Promise<string>} - The assistant's response text
 */
const callGroq = async (messages, options = {}) => {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY is not set in environment.');
  }
  const { temperature = 0.7, max_tokens = 4096, response_format } = options;

  for (let modelIdx = 0; modelIdx < MODEL_CHAIN.length; modelIdx++) {
    const modelName = MODEL_CHAIN[modelIdx];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const body = {
          model: modelName,
          messages,
          temperature,
          max_tokens,
        };

        // Groq supports JSON mode
        if (response_format) {
          body.response_format = response_format;
        }

        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData?.error?.message || `Groq API error: ${response.status} ${response.statusText}`
          );
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        return text;
      } catch (error) {
        const isQuota = isQuotaError(error);

        if (isQuota && attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(
            `[AI] Quota/rate-limit hit on ${modelName} (attempt ${attempt + 1}/${MAX_RETRIES}). ` +
            `Retrying in ${delay / 1000}s…`
          );
          await sleep(delay);
          continue;
        }

        if (isQuota && modelIdx < MODEL_CHAIN.length - 1) {
          console.warn(
            `[AI] All retries exhausted for ${modelName}. Falling back to ${MODEL_CHAIN[modelIdx + 1]}…`
          );
          break; // break inner retry loop → move to next model
        }

        // Non-retryable error, or last model exhausted
        throw error;
      }
    }
  }

  throw new Error(
    'All AI models are currently unavailable due to quota limits. Please wait a minute and try again.'
  );
};

/**
 * Friendly error mapper – converts raw API errors into user-facing messages
 */
const friendlyError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  if (isQuotaError(error)) {
    return new Error(
      'AI quota exceeded. The free tier has limited requests per minute. Please wait 30-60 seconds and try again.'
    );
  }
  if (msg.includes('not found') || msg.includes('404')) {
    return new Error('AI model not available. Please check configuration.');
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return new Error('Network error. Please check your internet connection.');
  }
  if (msg.includes('invalid') || msg.includes('api key') || msg.includes('authentication')) {
    return new Error('Invalid API key. Please check your Groq API key in the .env file.');
  }
  return error;
};

// ──────────────────────────────────────
//  Public exports
// ──────────────────────────────────────

export const generateStays = async (location) => {
  if (!location?.trim()) throw new Error('Location is required');

  const prompt = `You are a travel accommodation expert. For the location "${location}", suggest exactly 3 popular hostels or hotels covering budget to mid-range options.
For each include: name, price per night in INR (realistic range like "₹800–₹1,500"), rating out of 5 (one decimal), distance from city center, a 1-line description, type ("Budget" or "Luxury"), and a booking.com search URL for the hotel name.
Return ONLY a valid JSON array with no extra text:
[{"name":"","price":"","rating":"","distance":"","description":"","type":"","bookingLink":""}]`;

  console.log('[generateStays] Calling Groq for:', location);

  try {
    const text = await callGroq(
      [{ role: 'user', content: prompt }],
      { temperature: 0.4, max_tokens: 2048, response_format: { type: 'json_object' } }
    );
    console.log('[generateStays] Raw response:', text.slice(0, 200));
    const data = parseJSON(text, true);
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty stays array returned');
    return data;
  } catch (error) {
    throw friendlyError(error);
  }
};

export const generateGuide = async (placeName) => {
  if (!placeName?.trim()) throw new Error('Place name is required');

  const prompt = `You are an expert travel guide. Write a 120-150 word engaging storytelling-style travel guide for "${placeName}".
Include cultural or historical importance with a vivid, tour-guide tone.
Also include exactly 3 hidden/lesser-known facts and exactly 3 practical travel tips (local food, scams to avoid, best time, etc.).
Return ONLY a valid JSON object with no extra text:
{"story":"...","hiddenFacts":["...","...","..."],"tips":["...","...","..."]}`;

  console.log('[generateGuide] Calling Groq for:', placeName);

  try {
    const text = await callGroq(
      [{ role: 'user', content: prompt }],
      { temperature: 0.4, max_tokens: 2048, response_format: { type: 'json_object' } }
    );
    console.log('[generateGuide] Raw response:', text.slice(0, 200));
    const data = parseJSON(text, false);
    if (!data?.story || !Array.isArray(data?.hiddenFacts) || !Array.isArray(data?.tips)) {
      throw new Error('Incomplete guide structure returned');
    }
    return data;
  } catch (error) {
    throw friendlyError(error);
  }
};

// ──────────────────────────────────────
//  Chat session (for trip generation)
// ──────────────────────────────────────

// Maintain conversation history for the chat session
let _chatHistory = [
  {
    role: "user",
    content: "generate Travel Plan for Location : Las Vegas, for 3 Days for Couple with a Cheap budget Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName. Place Details, Place Image Url, Geo Coordinates, ticket Pricing,rating, Time  travel each of the location for 3 days with each day plan with best time to visit in JSON format.",
  },
  {
    role: "assistant",
    content: `Okay, here's a JSON formatted travel plan for a 3-day budget trip to Las Vegas for a couple. This plan focuses on affordable experiences while still enjoying the best of Vegas.

\`\`\`json
{
  "tripName": "Las Vegas Budget Getaway for Two",
  "duration": "3 Days",
  "budget": "Cheap",
  "travelers": "Couple",
  "hotelOptions": [
    {
      "hotelName": "Circus Circus Hotel & Casino",
      "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
      "price": "$40-$80/night",
      "hotelImageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/28/93/d3/60/exterior.jpg",
      "geoCoordinates": { "latitude": 36.1373, "longitude": -115.1665 },
      "rating": 3.7,
      "description": "An iconic Las Vegas hotel known for its family-friendly atmosphere, featuring a large indoor amusement park and affordable rooms."
    }
  ],
  "itinerary": {
    "day1": {
      "theme": "Exploring the Strip & Free Attractions",
      "bestTimeToVisit": "Morning & Evening",
      "plan": [
        {
          "placeName": "Welcome to Fabulous Las Vegas Sign",
          "placeDetails": "An iconic landmark at the south end of the Strip.",
          "placeImageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/0d/18/2a/ba/welcome-to-fabulous-las.jpg",
          "geoCoordinates": { "latitude": 36.0828, "longitude": -115.1722 },
          "ticketPricing": "Free",
          "rating": 4.6,
          "timeToTravel": "10-15 mins from most hotels on the Strip",
          "bestTimeToVisit": "Morning"
        }
      ]
    }
  }
}
\`\`\`
Enjoy your trip to Las Vegas!`,
  },
];

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_PLACE_API_KEY || 'dummy-key'; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Wrapper around Gemini chat completions, with fallback to Groq, and fallback to Demo.
 * Returns a result object shaped like { response: { text: () => string } }
 */
export const sendChatMessage = async (message) => {
  const startTime = Date.now();
  _chatHistory.push({ role: 'user', content: message });

  // STEP 1: Try Gemini
  try {
    console.log('[AI] Attempting Gemini API...');
    const result = await geminiModel.generateContent(message);
    const text = result.response.text();
    _chatHistory.push({ role: 'assistant', content: text });
    return { response: { text: () => text } };
  } catch (geminiError) {
    console.warn('[AI] Gemini failed or quota exceeded:', geminiError.message);
    
    // STEP 2: Try Groq as Backup
    console.log('[AI] Falling back to Groq API...');
    try {
      // We pass the history up to the user message
       const text = await callGroq(_chatHistory, {
          temperature: 1,
          max_tokens: 8192,
       });

       _chatHistory.push({ role: 'assistant', content: text });
       return { response: { text: () => text } };
    } catch (groqError) {
      console.warn('[AI] Groq fallback also failed:', groqError.message);
      
      // Reset history
      _chatHistory = _chatHistory.slice(0, 2);
      
      // STEP 3: Fallback throws error to Trigger Demo Mode in plan.js
      throw new Error('All AI Providers (Gemini & Groq) exhausted limits. Demo Mode Triggered.');
    }
  }
};

// Keep backward-compatible export
export const chatSession = {
  sendMessage: (msg) => sendChatMessage(msg),
};