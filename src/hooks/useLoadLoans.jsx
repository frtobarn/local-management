// File: src/hooks/useLoadLoans.jsx
import { useEffect } from 'react';
import { useLoans } from '../context/LoanContext';
import { getLoans } from '../services/loanService';

const useLoadLoans = () => {
  const { setLoans } = useLoans();

  useEffect(() => {
    const loadLoans = async () => {
      const loans = await getLoans();
      setLoans(loans);
    };

    loadLoans();
  }, [setLoans]);
};

export default useLoadLoans;
