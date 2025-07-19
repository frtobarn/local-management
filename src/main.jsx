//src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './sw/swRegistration';
import { LoanProvider } from './context/LoanContext';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reportes from './components/Reportes';
import UsersList from './components/UsersList';
import ItemsList from './components/ItemsList';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoanProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/items" element={<ItemsList />} />
        </Routes>
      </BrowserRouter>
    </LoanProvider>
  </StrictMode>,
)
//Funcionalidad Offline con Service Worker
registerServiceWorker();