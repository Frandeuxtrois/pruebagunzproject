// src/components/CenterColumn.tsx - AHORA USA VARIABLES DE ENTORNO

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado
import Box from './Box';
import RankingIndividualView from './views/RankingIndividualView';
import RankingClansView from './views/RankingClansView';
// NUEVO: Importamos el componente del panel de usuario para poder mostrarlo.
import UserPanelView from './views/UserPanelView';

// --- VERSIÓN MEJORADA DE UsersOnline ---
const UsersOnline: React.FC = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<'Online' | 'Offline' | 'Loading'>('Loading');

  useEffect(() => {
    // --- MODIFICACIÓN CLAVE ---
    // Ahora construimos la URL usando la variable de entorno.
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/status`;
    axios.get(apiUrl)
      .then(response => {
        // Si todo va bien, guardamos los datos
        setPlayerCount(response.data.onlinePlayers);
        setServerStatus(response.data.server);
      })
      .catch(error => {
        // Si hay un error, marcamos el servidor como Offline
        console.error("Error al obtener estado del servidor:", error);
        setServerStatus('Offline');
      });
  }, []); // El array vacío asegura que se ejecute solo una vez

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

  // Usamos tus mismos estilos, pero ahora el contenido es dinámico
  return (
    <div className="h-10 leading-10 text-center text-sm font-bold text-[#444] bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border border-[#aaa] rounded-lg mb-4 shadow-inner">
      {renderStatus()}
    </div>
  );
};
// --- FIN DE LA VERSIÓN MEJORADA ---


const FlashPlaceholder: React.FC = () => (
    <div className="flex flex-col justify-center items-center h-52 bg-[#e9e9e9] border border-[#ccc] text-[#888]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Adobe Flash Player ya no está disponible
    </div>
);

const HomeView: React.FC = () => (
  <Box 
    title="Prysmax Gunz" 
    titleClassName="!bg-none !border-b !border-[#ccc] text-xs !text-[#777] text-right !p-1 !rounded-none"
    contentClassName="text-xs"
  >
    <h4 className="mb-2 text-[13px] font-bold">Que es Gunz?</h4>
    <p className="leading-normal text-justify mb-5">
      Gunz es un TPS, Third Person Shooter. Bastante adrenalínico y veloz, que tiene una jugabilidad única en cuanto a libertad de movimiento. A diferencia de otros shooters, aca tenes un personaje que va progresando a lo largo del tiempo, y segun tu level podes ir comprando diferentes items. Tambien tiene un modo quest, donde jugas contra NPCs para conseguir items que solo podes conseguir de esa manera.
    </p>
    <FlashPlaceholder />
  </Box>
);

const PlaceholderView: React.FC<{title: string}> = ({ title }) => (
    <Box title={title}>
        <p>Contenido de la sección de <strong>{title}</strong>. Próximamente...</p>
    </Box>
);


interface CenterColumnProps {
    activeView: string;
}

const CenterColumn: React.FC<CenterColumnProps> = ({ activeView }) => {
    
    const renderContent = () => {
        switch (activeView) {
            case 'Home':
                return <HomeView />;
            
            // NUEVO: Añadimos el "case" para que el switch sepa qué hacer
            // cuando activeView sea 'UserPanel'.
            case 'UserPanel':
                return <UserPanelView />;

            case 'Novedades':
                return <PlaceholderView title="Novedades" />;
            case 'Foro':
                return <PlaceholderView title="Foro" />;
            case 'Descargas':
                return <PlaceholderView title="Descargas" />;
            case 'Guías':
                return <PlaceholderView title="Guías" />;
            case 'Ranking Clanes':
                return <RankingClansView />;
            case 'Ranking Individual':
                return <RankingIndividualView />;
            default:
                return <HomeView />;
        }
    };

  return (
    <section id="center-column">
      <UsersOnline />
      {renderContent()}
    </section>
  );
};

export default CenterColumn;