// src/index.tsx - CORREGIDO PARA REACT-MODAL

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Modal from 'react-modal';

// --- ESTA ES LA LÍNEA DE CONFIGURACIÓN QUE NECESITAMOS AÑADIR ---
// Le dice a react-modal cuál es el elemento principal de tu aplicación.
// Es importante para la accesibilidad (ej. para que los lectores de pantalla
// sepan que el contenido de fondo debe ser ignorado cuando el modal está abierto).
Modal.setAppElement('#root');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);