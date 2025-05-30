import { useState, useEffect } from "react";
import { getUsers, getItems, addLoan, getLoans } from "../services/loanService";
import { useData } from "../context/DataContext";
import { useLoans } from "../context/LoanContext";

const LoanForm = () => {
  const { users, items, updateUsers, updateItems } = useData();
  const { setLoans } = useLoans();
  const [userId, setUserId] = useState("");
  const [itemId, setItemId] = useState("");
  const [duration, setDuration] = useState(1); // Default 1 hour
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const fetchedUsers = await getUsers();
      const fetchedItems = await getItems();
      updateUsers(fetchedUsers);
      updateItems(fetchedItems);
    } catch (error) {
      setError("Error al cargar los datos. Por favor, recarga la página.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.dni.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUsersList(true);
    } else {
      setFilteredUsers([]);
      setShowUsersList(false);
    }
  }, [searchTerm, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo
    
    try {
      if (!userId || !itemId) {
        throw new Error("Por favor selecciona un usuario y un elemento");
      }

      // Convert hours to milliseconds
      const durationInMs = duration * 60 * 60 * 1000;
      await addLoan(userId, itemId, durationInMs);
      
      // Fetch and update the loans list
      const updatedLoans = await getLoans();
      setLoans(updatedLoans);
      
      // Reset form
      setUserId("");
      setItemId("");
      setDuration(1);
      setSearchTerm("");
      setShowUsersList(false);
    } catch (error) {
      console.error("Error al crear el préstamo:", error);
      setError(error.message || "Hubo un problema al crear el préstamo. Intenta nuevamente.");
    }
  };

  const handleUserSelect = (user) => {
    setUserId(user.id);
    setSearchTerm(user.name);
    setShowUsersList(false);
  };

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="autocomplete-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuario por nombre o documento"
          required
        />
        {showUsersList && filteredUsers.length > 0 && (
          <ul className="autocomplete-list">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user)}
              >
                {user.name} - {user.dni}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        required
      >
        <option value="">Seleccionar Elemento</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        min="1"
        placeholder="Duración (horas)"
        required
      />
      <button type="submit">Registrar Préstamo</button>
    </form>
  );
};

export default LoanForm;
