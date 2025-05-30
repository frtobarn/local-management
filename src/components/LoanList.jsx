//Este componente muestra la lista de préstamos activos.
import { useEffect, useState } from "react";
import { getLoans, deleteLoan, updateLoan } from "../services/loanService";
import { useLoans } from "../context/LoanContext";
import LoanTimer from "./LoanTimer";

const LoanList = () => {
  const { loans, setLoans } = useLoans();
  const [filter, setFilter] = useState("all"); // "all", "active", "unreturned"

  useEffect(() => {
    const fetchLoans = async () => {
      const loans = await getLoans();
      setLoans(loans);
    };
    fetchLoans();
  }, [setLoans]);

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

  const confirmDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      handleDelete(id);
    }
  };

  const filteredLoans = loans.filter((loan) => {
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
        {filteredLoans.map((loan) => (
          <li key={loan.id} className={`loan-item ${loan.returned ? 'returned' : ''}`}>
            <div>
              <p>Usuario: {loan.userName}</p>
              <p>Elemento: {loan.itemName}</p>
              <p>Inicio: {new Date(loan.startTime).toLocaleString()}</p>
              <p>
                Duración: {Math.round(loan.duration / (1000 * 60 * 60))} horas
              </p>
              {!loan.returned && (
                <p>
                  Tiempo restante: <LoanTimer loan={loan} />
                </p>
              )}
              {loan.returned && <p>Estado: Devuelto</p>}
            </div>
            <div>
              {!loan.returned && (
                <button onClick={() => handleReturn(loan.id)}>
                  Registrar Devolución
                </button>
              )}
              <button onClick={() => confirmDelete(loan.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanList;
