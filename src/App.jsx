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

const App = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  useLoadLoans();
  useSyncLoans();

  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3500);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <DataProvider>
        <div className={showSplash ? 'content hidden' : 'content'}>
          <h1>Gestión de préstamos</h1>
          <div>
            <button onClick={() => setIsUserModalOpen(true)}>Agregar Usuario</button>
            <button onClick={() => setIsItemModalOpen(true)}>Agregar Elemento</button>
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
