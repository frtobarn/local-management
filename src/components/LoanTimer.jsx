//Componente de Cronómetro
import { useState, useEffect } from 'react';

const LoanTimer = ({ loan }) => {
  const [timeLeft, setTimeLeft] = useState(loan.duration - (Date.now() - loan.startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(loan.duration - (Date.now() - loan.startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [loan]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Marcar préstamo como devuelto
    }
  }, [timeLeft]);

  return <span>{timeLeft > 0 ? `${Math.floor(timeLeft / 1000)}s` : 'Tiempo agotado'}</span>;
};

export default LoanTimer;
