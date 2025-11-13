// Este será un componente reutilizable que podremos usar tanto para el ranking de jugadores como para el de clanes, con solo pasarle la URL de la API a la que debe consultar.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RankingList from './RankingList'; // Asumimos que RankingList está en la misma carpeta

interface RankingWidgetProps {
  apiUrlEndpoint: string; // Ej: '/api/ranking/players'
  limit?: number; // Opcional, para limitar el número de resultados a mostrar
}

const RankingWidget: React.FC<RankingWidgetProps> = ({ apiUrlEndpoint, limit = 6 }) => {
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Construimos la URL completa
    const fullApiUrl = `${import.meta.env.VITE_API_URL}${apiUrlEndpoint}`;
    
    axios.get(fullApiUrl)
      .then(response => {
        // Extraemos solo los nombres de los jugadores o clanes
        const names = response.data.map((item: { Name: string }) => item.Name);
        // Aplicamos el límite
        setItems(names.slice(0, limit));
      })
      .catch(error => {
        console.error(`Error al obtener datos para el widget desde ${apiUrlEndpoint}:`, error);
        // Si hay un error, podemos mostrar una lista vacía o un mensaje
        setItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiUrlEndpoint, limit]); // Se volverá a ejecutar si cambia la URL o el límite

  if (isLoading) {
    return <div className="p-2 text-sm">Cargando...</div>;
  }

  return <RankingList items={items} />;
};

export default RankingWidget;