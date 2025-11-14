// src/components/views/HomeView.tsx - VERSIÓN CORREGIDA Y COMPLETA

import React from 'react';
import Box from '../Box'; // <-- LA IMPORTACIÓN QUE FALTABA

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

export default HomeView; // <-- EL EXPORT QUE FALTABA