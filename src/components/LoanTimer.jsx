//Componente de Cronómetro
import { useState, useEffect } from "react";

const LoanTimer = ({ loan }) => {
  const [timeLeft, setTimeLeft] = useState(
    loan.duration - (Date.now() - loan.startTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(loan.duration - (Date.now() - loan.startTime));
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(interval);
  }, [loan]);

  const formatTime = (ms) => {
    if (ms <= 0) return "Tiempo agotado";

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes} minutos`;
    }

    return `${hours > 1 ? hours + " horas" : hours + " hora"}  ${
      minutes > 1 ? minutes + " minutos" : minutes + " minuto"
    } `;
  };

  return <span>{formatTime(timeLeft)}</span>;
};

export default LoanTimer;
