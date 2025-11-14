// src/components/CenterColumn.tsx - AHORA ADAPTADO PARA REACT-ROUTER-DOM

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado
import Box from './Box';
// Ya no necesitamos importar las vistas aquí, App.tsx se encarga de enrutarlas
// import RankingIndividualView from './views/RankingIndividualView';
// import RankingClansView from './views/RankingClansView';
// import UserPanelView from './views/UserPanelView';

// --- VERSIÓN MEJORADA DE UsersOnline (sin cambios) ---
const UsersOnline: React.FC = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<'Online' | 'Offline' | 'Loading'>('Loading');

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/status`;
    axios.get(apiUrl)
      .then(response => {
        setPlayerCount(response.data.onlinePlayers);
        setServerStatus(response.data.server);
      })
      .catch(error => {
        console.error("Error al obtener estado del servidor:", error);
        setServerStatus('Offline');
      });
  }, []);

  const renderStatus = () => {
    switch (serverStatus) {
      case 'Loading':
        return 'Cargando...';
      case 'Offline':
        return <span className="text-red-600">Servidor Offline</span>;
      case 'Online':
        return `Users Online: ${playerCount}`;
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <div className="h-10 leading-10 text-center text-sm font-bold text-[#444] bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border border-[#aaa] rounded-lg mb-4 shadow-inner">
      {renderStatus()}
    </div>
  );
};
// --- FIN DE LA VERSIÓN MEJORADA ---

// Las definiciones de HomeView, FlashPlaceholder y PlaceholderView se han movido a sus propios archivos o ya no se usan globalmente.

// --- INTERFAZ MODIFICADA ---
// 'activeView' ahora es opcional y añadimos 'children' para que el router pueda insertar contenido.
interface CenterColumnProps {
    activeView?: string;
    children: React.ReactNode;
}

// --- COMPONENTE PRINCIPAL MODIFICADO ---
// Ahora es más simple. Solo muestra UsersOnline y el contenido que le pase el router.
const CenterColumn: React.FC<CenterColumnProps> = ({ children }) => {
  return (
    <section id="center-column">
      <UsersOnline />
      {children}
    </section>
  );
};

export default CenterColumn;