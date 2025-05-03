//src.app.jsx
import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import useLoadLoans from './hooks/useLoadLoans';
import useSyncLoans from './hooks/useSyncLoans';
import Modal from './components/Modal';
import AddItemModal from './components/AddItemModal';
import AddUserModal from './components/AddUserModal';

const App = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  useLoadLoans();
  useSyncLoans();
  return (
    <div>
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
  );
};

export default App;
