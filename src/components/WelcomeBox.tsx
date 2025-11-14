// src/components/WelcomeBox.tsx - AHORA USA <Link> Y CON AXIOS CORREGIDO

import React, { useState, useEffect } from 'react';
import axios, { InternalAxiosRequestConfig } from 'axios'; // Importamos el tipo para el interceptor
import Box from './Box';
// Importamos el componente Link del router
import { Link } from 'react-router-dom';

// Función para decodificar el token y obtener el rol del usuario
const getUserRole = (): string | null => {
    const token = localStorage.getItem('gunzToken');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return null;
    }
};

interface WelcomeBoxProps {
  username: string;
  onLogout: () => void;
}

// Interceptor de Axios
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// --- INTERCEPTOR CORREGIDO ---
// La función DEBE devolver el objeto 'config' para que la petición continúe.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('gunzToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // <-- ESTA LÍNEA ES LA CORRECCIÓN
}, error => {
  return Promise.reject(error);
});

const WelcomeBox: React.FC<WelcomeBoxProps> = ({ username, onLogout }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Obtenemos el rol del usuario para mostrar el botón de admin
  const userRole = getUserRole();

  useEffect(() => {
    // --- LÓGICA DEL USEEFFECT COMPLETADA ---
    // Hacemos la llamada a nuestra ruta protegida /api/profile.
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
  }, [onLogout]);

  return (
    <Box title={`¡Bienvenido, ${username}!`} contentClassName="p-4">
      {isLoading ? (
        <p>Cargando información del perfil...</p>
      ) : profileData ? (
        <div className="text-sm">
          <p className="mb-1"><strong>Email:</strong> {profileData.email || 'No especificado'}</p>
          <p className="mb-1"><strong>Miembro desde:</strong> {new Date(profileData.registrationDate).toLocaleDateString()}</p>
          
          {/* El botón ahora es un <Link> a la nueva ruta */}
          <Link 
            to="/user-panel" 
            className="block text-center w-full mt-4 py-1.5 font-bold bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
          >
            Panel de Usuario
          </Link>
          
          {/* Botón condicional que solo se muestra si el usuario es admin */}
          {userRole === 'admin' && (
            <Link 
              to="/admin"
              className="block text-center w-full mt-2 py-1.5 font-bold bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700"
            >
              Panel de Administración
            </Link>
          )}
          
          <button 
            onClick={onLogout} 
            className="w-full mt-2 py-1.5 font-bold bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <p>No se pudo cargar la información del perfil.</p>
      )}
    </Box>
  );
};

export default WelcomeBox;