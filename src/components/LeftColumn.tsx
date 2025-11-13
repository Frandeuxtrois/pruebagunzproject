// src/components/LeftColumn.tsx - AHORA CON RANKINGS DINÁMICOS

import React from 'react';
import Box from './Box';
import RankingList from './RankingList';
import RankingWidget from './RankingWidget'; // <-- 1. IMPORTAMOS NUESTRO NUEVO WIDGET


const PlayNowButton: React.FC = () => (
  <a href="#" className="block group">
    <img 
      src="/images/startnow.png" 
      alt="Jugá Ahora" 
      className="block group-hover:hidden"
    />
    <img 
      src="/images/startnow2.png" 
      alt="Jugá Ahora Hover" 
      className="hidden group-hover:block"
    />
  </a>
);

const LeftColumn: React.FC = () => {
  // --- 2. ELIMINAMOS LAS LISTAS DE DATOS FALSOS ---
  // const clanRanking = ['Guimon', 'LionII', 'Innovation', 'The World', 'Spoiler', 'Alts2012'];
  // const individualRanking = ['nmhg', 'Rapsodia', 'darkangel', 'Cyclonia', 'SoundStream', 'Suqui'];

  return (
    <aside id="left-column">
      <PlayNowButton />
      <div className="mt-4">
        <Box title="Ranking de Clanes">
          {/* --- 3. USAMOS EL WIDGET PARA EL RANKING DE CLANES --- */}
          <RankingWidget apiUrlEndpoint="/api/ranking/clans" />
        </Box>
      </div>
      <div className="mt-4">
        <Box title="Ranking Individual">
          {/* --- 4. USAMOS EL MISMO WIDGET PARA EL RANKING INDIVIDUAL --- */}
          <RankingWidget apiUrlEndpoint="/api/ranking/players" />
        </Box>
      </div>
    </aside>
  );
};

export default LeftColumn;