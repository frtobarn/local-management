import { useState, useEffect } from 'react';
import { getUsers, getItems, addLoan } from '../services/loanService';

const LoanForm = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [itemId, setItemId] = useState('');
  const [duration, setDuration] = useState(60000);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers();
      const items = await getItems();
      setUsers(users);
      setItems(items);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLoan(userId, itemId, duration);
    setUserId('');
    setItemId('');
    setDuration(60000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
        <option value="">Seleccionar Usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <select value={itemId} onChange={(e) => setItemId(e.target.value)} required>
        <option value="">Seleccionar Elemento</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duración (ms)"
        required
      />
      <button type="submit">Registrar Préstamo</button>
    </form>
  );
};

export default LoanForm;
