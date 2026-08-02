import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(83.5); // Fallback rate
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        
        if (data && data.rates && data.rates.INR) {
          setExchangeRate(data.rates.INR);
        }
      } catch (error) {
        console.error('Error fetching currency rates, falling back to default:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const formatPrice = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null) return '';
    
    // Clean string if it already contains $ or ₹
    let numStr = String(usdAmount).replace(/[^0-9.]/g, '');
    let numericAmount = parseFloat(numStr);
    
    if (isNaN(numericAmount)) return String(usdAmount);

    if (currency === 'INR') {
      const converted = numericAmount * exchangeRate;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(converted);
    }
    
    // Fallback USD formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, formatPrice, loading, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};
