import { useState } from "react";
import { addItem, getItems } from "../services/loanService";
import { useData } from "../context/DataContext";

const AddItemModal = ({ onClose }) => {
  const { updateItems } = useData();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    status: "available"
  });

  const clasificaciones = [
    "Juegos de azar y apuestas literarias",
    "Juegos de cartas y de mesa clásicos",
    "Juegos de cultura general",
    "Juegos inclusivos",
    "Juegos de estrategia y construcción",
    "Juegos de habilidad y destreza física",
    "Juegos de lógica y habilidad mental",
    "Juegos de misterio e investigación",
    "Juegos narrativos y de rol",
    "Mesa de Billar Poll",
    "Mesa de Hockey de aire",
    "Zona Gamer",
    "Zona Audiovisuales",
  ];

  const statusOptions = [
    "available",
    "borrowed",
    "maintenance"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(formData.name, formData.code, formData.status, formData.type);
    const updatedItems = await getItems();
    updateItems(updatedItems);
    setFormData({
      name: "",
      code: "",
      type: "",
      status: "available"
    });
    onClose();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Agregar Item</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Nombre:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Código:
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Tipo:
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">Seleccionar grupo</option>
              {clasificaciones.map((clasificacion) => (
                <option key={clasificacion} value={clasificacion}>
                  {clasificacion}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Estado:
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="available">Disponible</option>
              <option value="borrowed">Prestado</option>
              <option value="maintenance">En Mantenimiento</option>
            </select>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            type="button"
            onClick={onClose}
            style={{ 
              padding: '0.4rem 1rem', 
              borderRadius: 4, 
              border: '1px solid #ccc', 
              background: '#f5f5f5',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            style={{ 
              padding: '0.4rem 1rem', 
              borderRadius: 4, 
              border: '1px solid #4CAF50', 
              background: '#4CAF50', 
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Agregar Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemModal;
