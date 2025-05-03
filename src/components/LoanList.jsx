//Este componente muestra la lista de préstamos activos.
import { useEffect } from "react";
import { getLoans, deleteLoan } from "../services/loanService";
import { useLoans } from "../context/LoanContext";
import LoanTimer from "./LoanTimer";

const LoanList = () => {
  const { loans, setLoans } = useLoans();

  useEffect(() => {
    const fetchLoans = async () => {
      const loans = await getLoans();
      setLoans(loans);
    };
    fetchLoans();
  }, [setLoans]);

  const handleDelete = async (id) => {
    try {
      console.log("deleting loan with id " + id + " ...");
      await deleteLoan(id);
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id)); // Actualiza el estado local
    } catch (error) {
      console.error("Error al eliminar el préstamo:", error);
      alert("Hubo un problema al eliminar el préstamo. Intenta nuevamente.");
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      handleDelete(id);
    }
  };

  return (
    <div>
      <h2>Préstamos activos</h2>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            <p>Usuario: {loan.user}</p>
            <p>Inicio: {new Date(loan.startTime).toLocaleString()} </p>
            <p>
              Fin: {new Date(loan.startTime + loan.duration).toLocaleString()}{" "}
            </p>
            <p>Elemento: {loan.item}</p>
            <p>
              Tiempo restante: <LoanTimer loan={loan} />
            </p>
            <button onClick={() => confirmDelete(loan.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanList;
