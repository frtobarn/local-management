import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, deleteItem, updateItem } from '../services/loanService';
import Modal from './Modal';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const itemsData = await getItems();
      setItems(itemsData);
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error al eliminar item:', error);
        alert('Error al eliminar el item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedItem) => {
    try {
      // Actualizar en la base de datos
      await updateItem(updatedItem.id, {
        name: updatedItem.name,
        code: updatedItem.code,
        type: updatedItem.type,
        status: updatedItem.status
      });
      
      // Actualizar el estado local
      setItems(items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      setIsEditModalOpen(false);
      setEditingItem(null);
      
      console.log('✅ Item actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar item:', error);
      alert('Error al actualizar el item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.includes(searchTerm);
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
      
      <h2>Gestión de Items</h2>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
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
          <option value="available">Disponibles</option>
          <option value="borrowed">Prestados</option>
          <option value="maintenance">En Mantenimiento</option>
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
          + Agregar Item
        </button>
      </div>

      {filteredItems.length > 0 && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          background: '#e8f5e8', 
          borderRadius: '4px', 
          textAlign: 'center',
          fontSize: '0.9em',
          color: '#2e7d32'
        }}>
          📦 {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f5f7fa' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>#</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Nombre</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Código</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Tipo</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Estado</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>No hay items que coincidan con los filtros.</td></tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr key={item.id} style={{ background: idx % 2 === 0 ? '#f9fbfd' : '#eaf0f6' }}>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{item.name}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{item.code}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{item.type}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8em',
                      background: item.status === 'available' ? '#e8f5e8' : 
                                 item.status === 'borrowed' ? '#fff3e0' : 
                                 item.status === 'maintenance' ? '#ffebee' : '#f5f5f5',
                      color: item.status === 'available' ? '#2e7d32' : 
                             item.status === 'borrowed' ? '#f57c00' : 
                             item.status === 'maintenance' ? '#c62828' : '#666'
                    }}>
                      {item.status === 'available' ? 'Disponible' : 
                       item.status === 'borrowed' ? 'Prestado' : 
                       item.status === 'maintenance' ? 'En Mantenimiento' : 
                       item.status || 'Sin Estado'}
                    </span>
                  </td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    <button 
                      onClick={() => handleEdit(item)}
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
                      onClick={() => handleDelete(item.id)}
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
        <ItemEditModal 
          item={editingItem} 
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

const ItemEditModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    code: item?.code || '',
    type: item?.type || '',
    status: item?.status || 'available'
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

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        code: item.code,
        type: item.type,
        status: item.status
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...item, ...formData });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Editar Item</h3>
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemsList; 