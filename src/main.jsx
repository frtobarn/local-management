//src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './sw/swRegistration';
import { LoanProvider } from './context/LoanContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoanProvider>
      <App />
    </LoanProvider>
  </StrictMode>,
)
//Funcionalidad Offline con Service Worker
registerServiceWorker();