import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const LOCAL_STORAGE_KEY = 'recentSearches';

/**
 * Saves a search entry to localStorage and syncs with Firestore if user is logged in.
 * Implements deduplication by moving existing entries to the top.
 */
export const saveSearch = async (searchData, user) => {
  const newSearch = {
    location: searchData.location,
    noOfDays: searchData.noOfDays,
    budget: searchData.budget,
    travelers: searchData.travelers,
    tripId: searchData.tripId || null,
    timestamp: Date.now(),
  };

  // 1. Local Storage Logic
  let localHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  
  // Deduplication: Remove if exists (compare location label, days, and budget)
  localHistory = localHistory.filter(s => 
    s.location?.label !== newSearch.location?.label || 
    s.noOfDays !== newSearch.noOfDays || 
    s.budget !== newSearch.budget
  );

  // Add to top and limit to 10
  localHistory = [newSearch, ...localHistory].slice(0, 10);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localHistory));

  // 2. Cloud Sync Logic (Optional/Pro)
  if (user?.email) {
    try {
      const userRef = doc(db, 'SearchHistory', user.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const cloudHistory = userDoc.data().history || [];
        const filteredCloud = cloudHistory.filter(s => 
            s.location?.label !== newSearch.location?.label || 
            s.noOfDays !== newSearch.noOfDays || 
            s.budget !== newSearch.budget
        );
        
        await updateDoc(userRef, {
          history: [newSearch, ...filteredCloud].slice(0, 10)
        });
      } else {
        await setDoc(userRef, {
          history: [newSearch]
        });
      }
    } catch (error) {
      console.error("Error syncing search history to cloud:", error);
    }
  }
};

/**
 * Retrieves recent searches, merging local and cloud history if available.
 */
export const getRecentSearches = async (user) => {
    let localHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    if (user?.email) {
        try {
            const userRef = doc(db, 'SearchHistory', user.email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const cloudHistory = userDoc.data().history || [];
                // Merge and deduplicate
                const combined = [...localHistory, ...cloudHistory].sort((a, b) => b.timestamp - a.timestamp);
                const unique = [];
                const seenKeys = new Set();
                
                for (const item of combined) {
                    const key = `${item.location?.label}_${item.noOfDays}_${item.budget}`;
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key);
                        unique.push(item);
                    }
                }
                const result = unique.slice(0, 10);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
                return result;
            }
        } catch (error) {
            console.error("Error fetching cloud history:", error);
        }
    }
    return localHistory;
};

/**
 * Deletes a specific search entry by its index.
 */
export const deleteSearch = async (index, user) => {
    let history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    history.splice(index, 1);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));

    if (user?.email) {
        try {
            const userRef = doc(db, 'SearchHistory', user.email);
            await updateDoc(userRef, { history });
        } catch (error) {
            console.error("Error deleting cloud history entry:", error);
        }
    }
    return history;
};

/**
 * Clears all search history.
 */
export const clearAllSearches = async (user) => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (user?.email) {
        try {
            const userRef = doc(db, 'SearchHistory', user.email);
            await updateDoc(userRef, { history: [] });
        } catch (error) {
            console.error("Error clearing cloud history:", error);
        }
    }
    return [];
};
