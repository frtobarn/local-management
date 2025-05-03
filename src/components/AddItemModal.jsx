import { useState } from 'react';
import { addItem } from '../services/loanService';

const AddItemModal = ({ onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(name);
    setName('');
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del elemento"
          required
        />
        <button type="submit">Agregar Elemento</button>
        <button type="button" onClick={onClose}>Cerrar</button>
      </form>
    </div>
  );
};

export default AddItemModal;
