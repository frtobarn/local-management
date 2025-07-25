//Este componente muestra la lista de préstamos activos.
import { useEffect, useState } from "react";
import { getLoans, deleteLoan, updateLoan } from "../services/loanService";
import { useLoans } from "../context/LoanContext";
import LoanTimer from "./LoanTimer";

const LoanList = () => {
  const { loans, setLoans } = useLoans();
  const [filter, setFilter] = useState("all"); // "all", "active", "unreturned"
  const [tick, setTick] = useState(0); // Para forzar render

  // Forzar render cada 30 segundos para actualizar vencidos
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLoans = async () => {
      const loans = await getLoans();
      setLoans(loans);
    };
    fetchLoans();
  }, [setLoans]);

  // Filtrar préstamos del día actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const loansToday = loans.filter(loan => loan.startTime >= today.getTime() && loan.startTime < tomorrow.getTime());

  const handleDelete = async (id) => {
    try {
      await deleteLoan(id);
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
    } catch (error) {
      console.error("Error al eliminar el préstamo:", error);
      alert("Hubo un problema al eliminar el préstamo. Intenta nuevamente.");
    }
  };

  const handleReturn = async (id) => {
    try {
      await updateLoan(id, true);
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === id ? { ...loan, returned: true } : loan
        )
      );
    } catch (error) {
      console.error("Error al devolver el préstamo:", error);
      alert("Hubo un problema al registrar la devolución. Intenta nuevamente.");
    }
  };

  const handleRenew = async (loan) => {
    const extra = window.prompt('¿Cuántas horas deseas agregar al préstamo?', '1');
    const extraHours = parseFloat(extra);
    if (isNaN(extraHours) || extraHours <= 0) {
      alert('Por favor ingresa un número válido de horas.');
      return;
    }
    const extraMs = extraHours * 60 * 60 * 1000;
    try {
      await updateLoan(loan.id, false, loan.duration + extraMs);
      setLoans((prevLoans) =>
        prevLoans.map((l) =>
          l.id === loan.id ? { ...l, duration: l.duration + extraMs } : l
        )
      );
    } catch (error) {
      console.error('Error al renovar el préstamo:', error);
      alert('Hubo un problema al renovar el préstamo. Intenta nuevamente.');
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      handleDelete(id);
    }
  };

  const filteredLoans = loansToday.filter((loan) => {
    switch (filter) {
      case "active":
        return !loan.returned && Date.now() < loan.startTime + loan.duration;
      case "unreturned":
        return !loan.returned;
      default:
        return true;
    }
  });

  return (
    <div>
      <h2>Préstamos</h2>
      <div className="loan-filters">
        <label>
          <input
            type="radio"
            name="filter"
            value="all"
            checked={filter === "all"}
            onChange={(e) => setFilter(e.target.value)}
          />
          Todos los préstamos
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="active"
            checked={filter === "active"}
            onChange={(e) => setFilter(e.target.value)}
          />
          Préstamos activos
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="unreturned"
            checked={filter === "unreturned"}
            onChange={(e) => setFilter(e.target.value)}
          />
          No devueltos
        </label>
      </div>
      <ul>
        {filteredLoans.map((loan, idx) => {
          const isOverdue = !loan.returned && Date.now() >= loan.startTime + loan.duration;
          return (
            <li
              key={loan.id}
              className={`loan-item-row ${loan.returned ? 'returned' : ''} ${isOverdue ? 'overdue' : ''} ${idx % 2 === 0 ? 'even' : 'odd'}`}
            >
              <span className="loan-col user">{loan.userName}</span>
              <span className="loan-col item">{loan.itemName}</span>
              <span className="loan-col date">{new Date(loan.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="loan-col duration">{Math.round(loan.duration / (1000 * 60 * 60))}h</span>
              <span className="loan-col status">
                {!loan.returned ? (
                  <>
                    <span>Restante: <LoanTimer key={loan.id + '-' + loan.duration + '-' + loan.startTime} loan={loan} /></span>
                  </>
                ) : (
                  <span>Devuelto</span>
                )}
              </span>
              <span className="loan-col actions">
                {!loan.returned && (
                  <>
                    <button onClick={() => handleReturn(loan.id)}>
                      Registrar Devolución
                    </button>
                    <button onClick={() => handleRenew(loan)}>
                      Renovar
                    </button>
                  </>
                )}
                <button onClick={() => confirmDelete(loan.id)}>Eliminar</button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LoanList;
