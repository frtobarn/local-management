// scrc/context/LoanContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);

  return (
    <LoanContext.Provider value={{ loans, setLoans }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
};