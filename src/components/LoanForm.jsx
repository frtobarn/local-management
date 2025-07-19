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
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      border: '1px solid #f0f0f0'
    }}>
      {error && <div style={{
        background: '#fee',
        color: '#c33',
        padding: '0.8rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid #fcc'
      }}>{error}</div>}
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuario por nombre o documento"
          required
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />
        {showUsersList && filteredUsers.length > 0 && (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0.5rem 0',
            border: '1px solid #ddd',
            borderRadius: '6px',
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user)}
                style={{
                  padding: '0.8rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {user.name} - {user.dni}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        >
          <option value="">Seleccionar Elemento</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
          placeholder="Duración (horas)"
          required
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          marginTop: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}
      >
        📝 Registrar Préstamo
      </button>
    </form>
  );
};

export default LoanForm;
