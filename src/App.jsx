//src.app.jsx
import React, { useState, useEffect } from 'react';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import useLoadLoans from './hooks/useLoadLoans';
import useSyncLoans from './hooks/useSyncLoans';
import Modal from './components/Modal';
import AddItemModal from './components/AddItemModal';
import AddUserModal from './components/AddUserModal';
import { DataProvider } from './context/DataContext';
import SplashScreen from './components/SplashScreen';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Solo mostrar splash si no se ha mostrado antes en esta sesión
    return sessionStorage.getItem('splashShown') !== 'true';
  });
  const navigate = useNavigate();
  
  useLoadLoans();
  useSyncLoans();

  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 3500);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <DataProvider>
        <div className={showSplash ? 'content hidden' : 'content'}>
          <h1 style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '2rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Gestión de préstamos
          </h1>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '2rem',
            padding: '1rem'
          }}>
            <button 
              onClick={() => setIsUserModalOpen(true)}
              style={{
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
                minWidth: '160px'
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
              👤 Agregar Usuario
            </button>
            
            <button 
              onClick={() => setIsItemModalOpen(true)}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(240, 147, 251, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.3)';
              }}
            >
              📦 Agregar Elemento
            </button>
            
            <button 
              onClick={() => navigate('/reportes')}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
              }}
            >
              📊 Reportes
            </button>
            
            <button 
              onClick={() => navigate('/users')}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(67, 233, 123, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.3)';
              }}
            >
              👥 Usuarios
            </button>
            
            <button 
              onClick={() => navigate('/items')}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(250, 112, 154, 0.3)',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(250, 112, 154, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(250, 112, 154, 0.3)';
              }}
            >
              🎮 Items
            </button>
          </div>
          
          <LoanForm />
          <LoanList />
          
          <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
            <AddUserModal onClose={() => setIsUserModalOpen(false)} />
          </Modal>

          <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)}>
            <AddItemModal onClose={() => setIsItemModalOpen(false)} />
          </Modal>
        </div>
      </DataProvider>
    </>
  );
};

export default App;
