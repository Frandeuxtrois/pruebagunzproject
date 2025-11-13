// src/components/ServerStatus.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios para hacer la petición a la API

const ServerStatus: React.FC = () => {
  // --- Estados del Componente ---
  // Estado para guardar el número de jugadores. Empezamos en null.
  const [onlinePlayers, setOnlinePlayers] = useState<number | null>(null);
  // Estado para saber si estamos "cargando" la información.
  const [isLoading, setIsLoading] = useState(true);
  // Estado para guardar cualquier error que pueda ocurrir.
  const [error, setError] = useState<string | null>(null);

  // --- Efecto para Cargar los Datos ---
  // useEffect con [] al final, significa que este código se ejecutará
  // UNA SOLA VEZ, justo cuando el componente aparece en pantalla.
  useEffect(() => {
    // Hacemos una petición GET a nuestra API
    axios.get('http://localhost:3001/api/status')
      .then(response => {
        // Si la petición fue exitosa...
        setOnlinePlayers(response.data.onlinePlayers); // Guardamos el número de jugadores
      })
      .catch(err => {
        // Si hubo un error en la petición...
        console.error("Error al obtener el estado del servidor:", err);
        setError("No se pudo conectar al servidor."); // Guardamos un mensaje de error
      })
      .finally(() => {
        // Esto se ejecuta siempre, haya habido éxito o error.
        setIsLoading(false); // Dejamos de cargar
      });
  }, []); // El array vacío [] es crucial para que se ejecute solo una vez.

  // --- Renderizado del Componente ---
  // Ahora, mostramos algo diferente dependiendo del estado.
  if (isLoading) {
    return <div className="text-white">Cargando estado...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-bold">Servidor Offline</div>;
  }

  // Si no estamos cargando y no hay error, mostramos los jugadores.
  return (
    <div className="text-center p-2 bg-green-600 text-white font-bold rounded-lg shadow">
      Jugadores Online: {onlinePlayers}
    </div>
  );
};

export default ServerStatus;