import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, updateUser } from '../services/loanService';
import Modal from './Modal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser) => {
    try {
      // Actualizar en la base de datos
      await updateUser(updatedUser.id, {
        name: updatedUser.name,
        dni: updatedUser.dni,
        age: updatedUser.age,
        genre: updatedUser.genre,
        status: updatedUser.status
      });
      
      // Actualizar el estado local
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setIsEditModalOpen(false);
      setEditingUser(null);
      
      console.log('✅ Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.dni.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          marginBottom: '1rem', 
          padding: '0.4rem 1.2rem', 
          borderRadius: 6, 
          border: '1px solid #bbb', 
          background: '#f5f7fa', 
          cursor: 'pointer' 
        }}
      >
        ← Volver
      </button>
      
      <h2>Gestión de Usuarios</h2>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #ccc' }}
        />
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '0.4rem 1.2rem', 
            borderRadius: 6, 
            border: '1px solid #4CAF50', 
            background: '#4CAF50', 
            color: 'white',
            cursor: 'pointer'
          }}
        >
          + Agregar Usuario
        </button>
      </div>

      {filteredUsers.length > 0 && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          background: '#e8f5e8', 
          borderRadius: '4px', 
          textAlign: 'center',
          fontSize: '0.9em',
          color: '#2e7d32'
        }}>
          👥 {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f5f7fa' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>#</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Nombre</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>DNI</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Edad</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Género</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Estado</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '1rem' }}>No hay usuarios que coincidan con los filtros.</td></tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id} style={{ background: idx % 2 === 0 ? '#f9fbfd' : '#eaf0f6' }}>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{user.name}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{user.dni}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{user.age}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{user.genre}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8em',
                      background: user.status === 'active' ? '#e8f5e8' : '#ffebee',
                      color: user.status === 'active' ? '#2e7d32' : '#c62828'
                    }}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    <button 
                      onClick={() => handleEdit(user)}
                      style={{ 
                        marginRight: '0.5rem',
                        padding: '0.2rem 0.5rem', 
                        fontSize: '0.8em',
                        borderRadius: '3px',
                        border: '1px solid #2196F3',
                        background: '#2196F3',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ 
                        padding: '0.2rem 0.5rem', 
                        fontSize: '0.8em',
                        borderRadius: '3px',
                        border: '1px solid #f44336',
                        background: '#f44336',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <UserEditModal 
          user={editingUser} 
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

const UserEditModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    dni: user?.dni || '',
    age: user?.age || '',
    genre: user?.genre || '',
    status: user?.status || 'active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        dni: user.dni,
        age: user.age,
        genre: user.genre,
        status: user.status
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Editar Usuario</h3>
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
            Rango de Edad:
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsersList; 