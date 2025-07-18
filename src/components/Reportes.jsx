import React, { useState } from 'react';
import { useLoans } from '../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const getStartOf = (date, mode) => {
  const d = new Date(date);
  if (mode === 'day') {
    d.setHours(0, 0, 0, 0);
  } else if (mode === 'week') {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio de semana
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
  } else if (mode === 'month') {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d.getTime();
};

const Reportes = () => {
  const { loans } = useLoans();
  const [filter, setFilter] = useState('day');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
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

  const filteredLoans = loans.filter(loan => loan.startTime >= start && loan.startTime < end);

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
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f5f7fa' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Usuario</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Elemento</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Fecha</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Duración (h)</th>
              <th style={{ padding: '0.5rem', border: '1px solid #eee' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>No hay préstamos en este periodo.</td></tr>
            ) : (
              filteredLoans.map((loan, idx) => (
                <tr key={loan.id} style={{ background: idx % 2 === 0 ? '#f9fbfd' : '#eaf0f6' }}>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.userName}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.itemName}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{new Date(loan.startTime).toLocaleString()}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{Math.round(loan.duration / (1000 * 60 * 60))}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #eee' }}>{loan.returned ? 'Devuelto' : 'Pendiente'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes; 