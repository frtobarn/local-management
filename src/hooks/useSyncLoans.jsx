// File: src/hooks/useSyncLoans.jsx
import { useEffect } from 'react';
import { addLoan } from '../services/loanService';
import { useLoans } from '../context/LoanContext';

const useSyncLoans = () => {
  const { loans } = useLoans();

  useEffect(() => {
    const syncLoans = async () => {
      for (const loan of loans) {
        if (!loan.id) {
          await addLoan(loan);
        }
      }
    };

    syncLoans();
  }, [loans]);
};

export default useSyncLoans;
