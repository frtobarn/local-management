import React, { useState } from 'react';
import { useLoans } from '../context/LoanContext';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import * as XLSX from 'xlsx';
import { getLoans } from '../services/loanService';
import { updateLoan } from '../services/loanService';

const getStartOf = (date, mode) => {
  // Crear fecha local a partir de yyyy-mm-dd
  const [year, month, day] = date.split('-').map(Number);
  
  // Crear fecha en zona horaria local (sin ajustes UTC)
  const localDate = new Date(year, month - 1, day);
  
  if (mode === 'day') {
    localDate.setHours(0, 0, 0, 0);
  } else if (mode === 'week') {
    const dayOfWeek = localDate.getDay();
    const diff = localDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lunes como inicio de semana
    localDate.setDate(diff);
    localDate.setHours(0, 0, 0, 0);
  } else if (mode === 'month') {
    localDate.setDate(1);
    localDate.setHours(0, 0, 0, 0);
  }
  
  return localDate.getTime();
};

const Reportes = () => {
  const { loans, setLoans, deleteLoan } = useLoans();
  const [filter, setFilter] = useState('day');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Usar fecha local en lugar de UTC
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [cleanStartDate, setCleanStartDate] = useState('');
  const [cleanEndDate, setCleanEndDate] = useState('');
  const navigate = useNavigate();

  const start = getStartOf(selectedDate, filter);
  let end;
  if (filter === 'day') {
    end = start + 24 * 60 * 60 * 1000;
  } else if (filter === 'week') {
    end = start + 7 * 24 * 60 * 60 * 1000;
  } else if (filter === 'month') {
    const d = new Date(start);
    d.setMonth(d.getMonth() + 1);
    end = d.getTime();
  }

  // Debug temporal para ver las fechas
  console.log('🔍 Debug fechas:', {
    selectedDate,
    start: new Date(start).toLocaleString(),
    end: new Date(end).toLocaleString(),
    startTimestamp: start,
    endTimestamp: end
  });

  const filteredLoans = loans.filter(loan => loan.startTime >= start && loan.startTime < end);

  const exportToExcel = () => {
    const dataToExport = filteredLoans.map(loan => ({
      'Usuario': loan.userName,
      'Elemento': loan.itemName,
      'Placa': loan.itemCode || '',
      'Fecha': new Date(loan.startTime).toLocaleString(),
      'Duración (h)': Math.round(loan.duration / (1000 * 60 * 60)),
      'Estado': loan.returned ? 'Devuelto' : 'Pendiente'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Préstamos');
    
    const fileName = `reporte_prestamos_${selectedDate}_${filter}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const cleanDatabase = async () => {
    if (!cleanStartDate || !cleanEndDate) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    // Usar hora local para las fechas de limpieza
    const start = new Date(cleanStartDate).getTime();
    const end = new Date(cleanEndDate).getTime() + (24 * 60 * 60 * 1000); // Incluir todo el día final

    const loansToDelete = loans.filter(loan => 
      loan.startTime >= start && loan.startTime < end
    );

    if (loansToDelete.length === 0) {
      alert('No hay préstamos en el rango seleccionado.');
      return;
    }

    const confirmMessage = `¿Estás seguro de que quieres eliminar ${loansToDelete.length} préstamos del ${cleanStartDate} al ${cleanEndDate}? Esta acción no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Eliminar préstamos uno por uno
        for (const loan of loansToDelete) {
          await deleteLoan(loan.id);
        }
        
        alert(`Se eliminaron ${loansToDelete.length} préstamos exitosamente.`);
        setShowCleanModal(false);
        setCleanStartDate('');
        setCleanEndDate('');
        
        // Recargar los datos del contexto sin recargar la página
        const updatedLoans = await getLoans();
        setLoans(updatedLoans);
      } catch (error) {
        console.error('Error al eliminar préstamos:', error);
        alert('Hubo un error al eliminar los préstamos. Intenta nuevamente.');
      }
    }
  };

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      // Actualizar en la base de datos
      await updateLoan(loanId, newStatus);
      
      // Actualizar el contexto
      const updatedLoans = await getLoans();
      setLoans(updatedLoans);
      
      console.log(`✅ Préstamo ${loanId} marcado como ${newStatus ? 'devuelto' : 'pendiente'}`);
    } catch (error) {
      console.error('Error al cambiar el estado del préstamo:', error);
      alert('Hubo un error al cambiar el estado del préstamo. Intenta nuevamente.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem', padding: '0.4rem 1.2rem', borderRadius: 6, border: '1px solid #bbb', background: '#f5f7fa', cursor: 'pointer' }}>← Volver</button>
      <h2>Reportes</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label>
          <input type="radio" name="filter" value="day" checked={filter === 'day'} onChange={() => setFilter('day')} /> Día
        </label>
        <label>
          <input type="radio" name="filter" value="week" checked={filter === 'week'} onChange={() => setFilter('week')} /> Semana
        </label>
        <label>
          <input type="radio" name="filter" value="month" checked={filter === 'month'} onChange={() => setFilter('month')} /> Mes
        </label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <button 
          onClick={exportToExcel}
          style={{ 
            padding: '0.4rem 1.2rem', 
            borderRadius: 6, 
            border: '1px solid #4CAF50', 
            background: '#4CAF50', 
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          📊 Exportar Excel
        </button>
        <button 
          onClick={() => setShowCleanModal(true)}
          style={{ 
            padding: '0.4rem 1.2rem', 
            borderRadius: 6, 
            border: '1px solid #f44336', 
            background: '#f44336', 
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          🗑️ Limpiar BD
        </button>
      </div>
      
      {filteredLoans.length > 0 && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          background: '#e8f5e8', 
          borderRadius: '4px', 
          textAlign: 'center',
          fontSize: '0.9em',
          color: '#2e7d32'
        }}>
          📊 {filteredLoans.length} elemento{filteredLoans.length !== 1 ? 's' : ''} listado{filteredLoans.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f5f7fa' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>#</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Usuario</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Elemento</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Placa</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Fecha</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Duración (h)</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Estado</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>No hay préstamos en este periodo.</td></tr>
            ) : (
              filteredLoans.map((loan, idx) => (
                <tr key={loan.id} style={{ background: idx % 2 === 0 ? '#f9fbfd' : '#eaf0f6' }}>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.userName}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.itemName}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    {loan.itemCode ? (
                      <Barcode value={loan.itemCode} width={1.2} height={32} fontSize={12} margin={0} displayValue={true} />
                    ) : ''}
                  </td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{new Date(loan.startTime).toLocaleString()}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{Math.round(loan.duration / (1000 * 60 * 60))}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.returned ? 'Devuelto' : 'Pendiente'}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>
                    <select 
                      value={loan.returned ? 'returned' : 'pending'}
                      onChange={(e) => handleStatusChange(loan.id, e.target.value === 'returned')}
                      style={{ 
                        padding: '0.2rem', 
                        fontSize: '0.8em',
                        borderRadius: '3px',
                        border: '1px solid #ccc'
                      }}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="returned">Devuelto</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de limpieza */}
      {showCleanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '400px',
            maxWidth: '500px'
          }}>
            <h3>Limpiar Base de Datos</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Selecciona el rango de fechas para eliminar los préstamos correspondientes.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Fecha de inicio:
                <input 
                  type="date" 
                  value={cleanStartDate} 
                  onChange={(e) => setCleanStartDate(e.target.value)}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
                />
              </label>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Fecha de fin:
                <input 
                  type="date" 
                  value={cleanEndDate} 
                  onChange={(e) => setCleanEndDate(e.target.value)}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
                />
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowCleanModal(false);
                  setCleanStartDate('');
                  setCleanEndDate('');
                }}
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
                onClick={cleanDatabase}
                style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: 4, 
                  border: '1px solid #f44336', 
                  background: '#f44336', 
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes; 