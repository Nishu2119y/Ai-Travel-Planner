import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const BudgetBreakdown = ({ trip }) => {
  const estimatedCost = trip?.TripData?.estimatedCost;
  const userBudget = trip?.userSelection?.budget;

  if (!estimatedCost) return null;

  const parseBudget = (budget) => {
    if (typeof budget === 'number') return budget;
    if (typeof budget !== 'string') return 0;
    const parts = budget.split('-').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return (parts[0] + parts[1]) / 2;
    if (!isNaN(parts[0])) return parts[0];
    return 0;
  };

  const data = [
    { name: 'Transport', value: parseBudget(estimatedCost.flights) },
    { name: 'Stay', value: parseBudget(estimatedCost.accommodation) },
    { name: 'Food', value: parseBudget(estimatedCost.food) },
    { name: 'Activities', value: parseBudget(estimatedCost.activities) },
  ].filter(d => d.value > 0);

  const COLORS = ['#ff4d00', '#ff9a6c', '#1a1a2e', '#4dbb8a']; 

  const totalEstimatedCost = data.reduce((sum, item) => sum + item.value, 0);
  
  // Estimate user budget number based on category if it's a string like "Moderate"
  const getBudgetLimit = (category) => {
    if (typeof category === 'number') return category;
    const cat = category?.toLowerCase();
    if (cat === 'cheap') return 30000;
    if (cat === 'moderate') return 80000;
    if (cat === 'luxurious') return 200000;
    return null;
  };

  const budgetLimit = getBudgetLimit(userBudget);
  const isOverBudget = budgetLimit && totalEstimatedCost > budgetLimit;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card mt-12 p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
          <Wallet size={20} />
        </div>
        <div>
          <div className="section-label section-label-left mb-1">Financial Overview</div>
          <h2 className="font-heading text-3xl text-white leading-none">BUDGET BREAKDOWN</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#121212', border: '1px solid rgba(255,77,0,0.2)', borderRadius: '8px', fontFamily: "'Oswald', sans-serif" }}
                itemStyle={{ color: '#f5f0e8' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="glass-card-light p-6">
             <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Total Estimated Cost</div>
             <div className="font-heading text-4xl text-white">₹{totalEstimatedCost.toLocaleString()}</div>
          </div>

          <div className={`p-6 rounded-xl border flex items-center gap-4 ${isOverBudget ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
            {isOverBudget ? (
              <>
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <div className="text-red-500 font-heading text-lg">Over Recommended Limit</div>
                  <p className="text-white/40 text-xs font-body">Your estimated costs exceed the typical {userBudget} budget.</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-[#4dbb8a]" size={24} />
                <div>
                  <div className="text-[#4dbb8a] font-heading text-lg">Within Budget Parameters</div>
                  <p className="text-white/40 text-xs font-body">Everything looks good! This plan aligns with your {userBudget} preferences.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetBreakdown;

