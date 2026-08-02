import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [totalBudget, setTotalBudget] = useState(() => {
    return Number(localStorage.getItem('totalBudget')) || 0;
  });
  const [addedItems, setAddedItems] = useState(() => {
    return JSON.parse(localStorage.getItem('addedItems')) || [];
  });

  const remainingBudget = totalBudget - addedItems.reduce((sum, item) => sum + item.cost, 0);

  useEffect(() => {
    localStorage.setItem('totalBudget', totalBudget);
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('addedItems', JSON.stringify(addedItems));
  }, [addedItems]);

  const addItem = (item) => {
    setAddedItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const removeItem = (id) => {
    setAddedItems(prev => prev.filter(item => item.id !== id));
  };

  const resetBudget = (limit) => {
    setTotalBudget(limit);
    setAddedItems([]);
  };

  return (
    <BudgetContext.Provider value={{
      totalBudget,
      remainingBudget,
      addedItems,
      setTotalBudget,
      addItem,
      removeItem,
      resetBudget
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
