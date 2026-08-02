export const SelectTravelersList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'A sole traveler exploring the world',
      icon: '🙋',
      people: '1 Person',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two travelers in tandem',
      icon: '👩‍❤‍👨',
      people: '2 People',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun-loving adventurers',
      icon: '🧑‍🧑‍🧒‍🧒',
      people: '3 to 5 People',
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A bunch of thrill-seekers',
      icon: '🥂',
      people: '5 to 10 People',
    },
  ];
  
  export const SelectBudegetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay conscious of costs',
      icon: '🪙',
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep costs on the average side',
      icon: '🤑',
    },
    {
      id: 3,
      title: 'Luxurious',
      desc: 'Indulge in luxury and comfort',
      icon: '💸',
    },
  ];

  export const AI_PROMPT = `
    You are a master travel planner. Your task is to generate a detailed, highly immersive travel itinerary for {location}.
    The trip is for {totalDays} days, for {travelers}, with a {budget} budget.

    **CRITICAL REQUIREMENTS**:
    1. For EVERY SINGLE DAY, you MUST provide exactly 4 to 6 unique and high-quality places to visit or activities.
    2. For each place, provide a 'cleanSummary' which is a single, evocative sentence describing the vibe (e.g. "A serene sunset spot overlooking the azure Aegean Sea").
    3. Your entire response MUST be a single, valid JSON object. No pre-text or post-text.
    4. Ensure all URLs and data are relevant to {location}.

    The JSON object must follow this structure:

    {
      "locationImageUrl": "(string)",
      "bestTimeToVisit": "(string)",
      "estimatedCost": {
        "flights": (number),
        "accommodation": (number),
        "food": (number),
        "activities": (number),
        "total": (number)
      },
      "ecoScore": (number),
      "hotelOptions": [
        {
          "hotelName": "(string)",
          "hotelAddress": "(string)",
          "price": "(string)",
          "hotelImageUrl": "(string)",
          "rating": (number)
        }
      ],
      "itinerary": [
        {
          "day": (number),
          "title": "(string)",
          "places": [
            {
              "placeName": "(string)",
              "placeDetails": "(string)",
              "cleanSummary": "(string)",
              "placeImageUrl": "(string)",
              "ticketPricing": "(string)",
              "rating": (number),
              "openingHours": "(string)",
              "timeToTravel": "(string)",
              "geoCoordinates": "(string) latitude, longitude"
            }
          ]
        }
      ]
    }
    Every single piece of information, including hotel names, addresses, place names, and all image URLs, must be for {location}. Do not use placeholder data.`;