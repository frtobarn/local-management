// scrc/context/LoanContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { deleteLoan as deleteLoanService } from '../services/loanService';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);

  const deleteLoan = async (id) => {
    await deleteLoanService(id);
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== id));
  };

  return (
    <LoanContext.Provider value={{ loans, setLoans, deleteLoan }}>
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