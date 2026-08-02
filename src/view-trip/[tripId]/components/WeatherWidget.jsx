import React, { useEffect, useState } from 'react';
import { getWeatherForDestination } from '../../../lib/weather';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Cloud } from 'lucide-react';

function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeatherForDestination(destination);
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (loading) {
    return (
      <div className="flex gap-3 mt-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 mt-6"
    >
      <div className="flex items-center gap-2 px-5 py-2.5 glass-card-light rounded-full border border-white/5">
        <Thermometer className="w-3.5 h-3.5 text-orange-500" />
        <span className="font-heading text-white text-sm tracking-wide">{weather.temperature}°C</span>
      </div>

      <div className="flex items-center gap-3 px-5 py-2.5 glass-card-light rounded-full border border-white/5" title={weather.description}>
        <span className="text-xl">{weather.icon}</span>
        <span className="font-heading text-white/70 text-xs uppercase tracking-widest">{weather.description}</span>
      </div>

      <div className="flex items-center gap-2 px-5 py-2.5 glass-card-light rounded-full border border-white/5">
        <Wind className="w-3.5 h-3.5 text-orange-500" />
        <span className="font-heading text-white/50 text-sm tracking-wide">{weather.windspeed} <span className="text-[10px] opacity-40">KM/H</span></span>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;

