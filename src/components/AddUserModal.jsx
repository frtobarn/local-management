import { useState } from "react";
import { addUser, getUsers } from "../services/loanService";
import { useData } from "../context/DataContext";

const AddUserModal = ({ onClose }) => {
  const { updateUsers } = useData();
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    age: "",
    genre: "",
    status: "active"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(formData.name, formData.dni, formData.age, formData.genre);
    const updatedUsers = await getUsers();
    updateUsers(updatedUsers);
    setFormData({
      name: "",
      dni: "",
      age: "",
      genre: "",
      status: "active"
    });
    onClose();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Agregar Usuario</h3>
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
            DNI:
            <input
              type="text"
              value={formData.dni}
              onChange={(e) => setFormData({...formData, dni: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Edad:
            <select
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">Seleccionar franja de edad</option>
              <option value="13-17">13 a 17</option>
              <option value="18-25">18 a 25</option>
              <option value="26-35">26 a 35</option>
              <option value="36-45">36 a 45</option>
              <option value="46-55">46 a 55</option>
              <option value="56-65">56 a 65</option>
              <option value="66-75">66 a 75</option>
              <option value="76-85">76 a 85</option>
              <option value="86-95">86 a 95</option>
              <option value="96-105">96 a 105</option>
            </select>
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Género:
            <select
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">Seleccionar género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
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
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
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
            Agregar Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserModal;
