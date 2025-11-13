// src/components/WelcomeBox.tsx - AHORA MUESTRA DATOS REALES DEL PERFIL Y TIENE NAVEGACIÓN

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from './Box';

interface WelcomeBoxProps {
  username: string;
  onLogout: () => void;
  onNavigate: (view: string) => void; // <-- Prop para la navegación añadida
}

// NUEVO: Interceptor de Axios. Es una forma profesional de añadir el token a todas las
// peticiones que se hagan a la API, sin tener que hacerlo manualmente cada vez.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) {
    // Adjuntamos el token en el formato estándar "Bearer".
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const WelcomeBox: React.FC<WelcomeBoxProps> = ({ username, onLogout, onNavigate }) => {
  // NUEVO: Estados para guardar los datos del perfil y manejar la carga.
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // NUEVO: Este efecto se ejecuta cuando el componente aparece para buscar los datos del perfil.
  useEffect(() => {
    // Hacemos la llamada a nuestra nueva ruta protegida /api/profile.
    apiClient.get('/api/profile')
      .then(response => {
        // Si todo va bien, guardamos los datos del perfil.
        setProfileData(response.data);
      })
      .catch(error => {
        console.error("Error al obtener el perfil:", error);
        // Si el token es inválido o expiró (errores 401 o 403), deslogueamos al usuario.
        if (error.response?.status === 401 || error.response?.status === 403) {
          onLogout();
        }
      })
      .finally(() => {
        // Al final de la petición, dejamos de mostrar el estado de "cargando".
        setIsLoading(false);
      });
  }, [onLogout]); // [onLogout] es una dependencia para que el efecto se comporte correctamente.

  return (
    <Box title={`¡Bienvenido, ${username}!`} contentClassName="p-4">
      {isLoading ? (
        // Mostramos un mensaje mientras se cargan los datos.
        <p>Cargando información del perfil...</p>
      ) : profileData ? (
        // Cuando los datos han llegado, los mostramos.
        <div className="text-sm">
          <p className="mb-1"><strong>Email:</strong> {profileData.email || 'No especificado'}</p>
          <p className="mb-1"><strong>Miembro desde:</strong> {new Date(profileData.registrationDate).toLocaleDateString()}</p>
          
          {/* --- BOTÓN AÑADIDO --- */}
          {/* Este botón ahora usa la función onNavigate para cambiar la vista a 'UserPanel' */}
          <button 
            onClick={() => onNavigate('UserPanel')} 
            className="w-full mt-4 py-1.5 font-bold bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
          >
            Panel de Usuario
          </button>
          
          <button 
            onClick={onLogout} 
            className="w-full mt-2 py-1.5 font-bold bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        // Mensaje de error si no se pudieron cargar los datos.
        <p>No se pudo cargar la información del perfil.</p>
      )}
    </Box>
  );
};

export default WelcomeBox;